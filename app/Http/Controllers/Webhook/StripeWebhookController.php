<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Notifications\PaymentFailed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * Handle Stripe webhook events.
     *
     * @param Request $request
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
            Log::error('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
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
     */
    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        $bookingId = $paymentIntent->metadata->booking_id ?? null;

        if ($bookingId) {
            $booking = Booking::find($bookingId);
            if ($booking && $booking->status === 'pending') {
                $booking->update([
                    'status' => 'awaiting_approval',
                    'stripe_customer_id' => $paymentIntent->customer,
                ]);

                Log::info("Booking {$bookingId} marked awaiting approval via webhook");
            }
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
                $booking->update(['status' => 'failed']);
                
                // Notify parent
                if ($booking->student && $booking->student->parent) {
                    $booking->student->parent->notifyNow(new PaymentFailed($booking));
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

        if ($paymentIntentId) {
            // Find booking by payment intent metadata
            // Note: This requires storing payment_intent_id in bookings table for better tracking
            Log::info("Charge refunded for payment intent: {$paymentIntentId}");
            
            // Update booking status if needed
            // $booking = Booking::where('stripe_payment_intent_id', $paymentIntentId)->first();
            // if ($booking) {
            //     $booking->update(['status' => 'refunded']);
            // }
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







