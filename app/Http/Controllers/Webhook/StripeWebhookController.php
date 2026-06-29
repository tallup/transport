<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Notifications\PaymentFailed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * Handle Stripe webhook events.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('cashier.webhook.secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook signature verification failed: '.$e->getMessage());

            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Idempotency: Stripe retries deliveries, so process each event id at most once.
        $eventId = $event->id ?? null;
        if ($eventId && ! \Illuminate\Support\Facades\Cache::add("stripe_webhook:{$eventId}", true, now()->addHours(24))) {
            Log::info('Duplicate Stripe webhook ignored', ['event_id' => $eventId]);

            return response()->json(['received' => true, 'duplicate' => true]);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handlePaymentIntentSucceeded($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentFailed($event->data->object);
                break;

            case 'charge.refunded':
                $this->handleChargeRefunded($event->data->object);
                break;

            case 'customer.subscription.updated':
                $this->handleSubscriptionUpdated($event->data->object);
                break;

            case 'customer.subscription.deleted':
                $this->handleSubscriptionDeleted($event->data->object);
                break;

            default:
                Log::info('Unhandled Stripe webhook event', [
                    'event_type' => $event->type,
                    'event_id' => $event->id ?? null,
                    'timestamp' => now()->toIso8601String(),
                ]);
        }

        return response()->json(['received' => true]);
    }

    /**
     * Handle successful payment intent.
     * Supports metadata.booking_ids (comma-separated) or metadata.booking_id (single).
     */
    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        $bookingIdsRaw = $paymentIntent->metadata->booking_ids ?? $paymentIntent->metadata->booking_id ?? null;
        if (! $bookingIdsRaw) {
            return;
        }
        $bookingIds = array_filter(array_map('intval', explode(',', (string) $bookingIdsRaw)));
        if (empty($bookingIds)) {
            return;
        }

        $updated = 0;
        foreach ($bookingIds as $bookingId) {
            $booking = Booking::find($bookingId);
            if ($booking && $booking->status === \App\Models\Booking::STATUS_PENDING) {
                $booking->update([
                    'status' => \App\Models\Booking::STATUS_ACTIVE,
                    'stripe_customer_id' => $paymentIntent->customer ?? null,
                    'payment_id' => $paymentIntent->id,
                    'payment_method' => 'stripe',
                ]);
                $updated++;
            }
        }
        if ($updated > 0) {
            Log::info("Stripe webhook: {$updated} booking(s) activated", ['booking_ids' => $bookingIds]);
        }
    }

    /**
     * Handle failed payment intent.
     */
    protected function handlePaymentIntentFailed($paymentIntent)
    {
        $bookingId = $paymentIntent->metadata->booking_id ?? null;

        if ($bookingId) {
            $booking = Booking::with('student.parent')->find($bookingId);
            if ($booking) {
                $booking->update(['status' => Booking::STATUS_FAILED]);

                // Notify parent
                if ($booking->student && $booking->student->parent) {
                    $booking->student->parent->notify(new PaymentFailed($booking));
                }

                Log::info("Booking {$bookingId} payment failed via webhook");
            }
        }
    }

    /**
     * Handle charge refunded.
     */
    protected function handleChargeRefunded($charge)
    {
        $paymentIntentId = $charge->payment_intent ?? null;

        if (! $paymentIntentId) {
            Log::warning('charge.refunded received with no payment_intent', ['charge_id' => $charge->id ?? null]);

            return;
        }

        // Only act on full refunds; partial refunds keep the booking active.
        $fullyRefunded = isset($charge->amount, $charge->amount_refunded)
            && (int) $charge->amount_refunded >= (int) $charge->amount;

        if (! $fullyRefunded) {
            Log::info("Partial refund for payment intent {$paymentIntentId}; booking status unchanged");

            return;
        }

        // Stripe bookings store the PaymentIntent id in payment_id (see paymentSuccess / webhook succeeded).
        $bookings = Booking::where('payment_id', $paymentIntentId)->get();

        foreach ($bookings as $booking) {
            if ($booking->status !== Booking::STATUS_REFUNDED) {
                $booking->update(['status' => Booking::STATUS_REFUNDED]);
                Log::info("Booking {$booking->id} marked refunded via webhook", ['payment_intent' => $paymentIntentId]);
            }
        }

        if ($bookings->isEmpty()) {
            Log::warning("charge.refunded: no booking found for payment intent {$paymentIntentId}");
        }
    }

    /**
     * Handle subscription updated.
     */
    protected function handleSubscriptionUpdated($subscription)
    {
        // Handle subscription status changes
        Log::info("Subscription updated: {$subscription->id}");
    }

    /**
     * Handle subscription deleted.
     */
    protected function handleSubscriptionDeleted($subscription)
    {
        // Handle subscription cancellation
        Log::info("Subscription deleted: {$subscription->id}");
    }
}
