<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Refund;

class RefundService
{
    public function __construct()
    {
        Stripe::setApiKey(config('cashier.secret'));
    }

    /**
     * Process a refund for a booking.
     *
     * @param Booking $booking
     * @param float|null $amount If null, refunds full amount
     * @return array ['success' => bool, 'message' => string, 'refund_id' => string|null]
     */
    public function processRefund(Booking $booking, ?float $amount = null): array
    {
        try {
            if (!$booking->stripe_customer_id) {
                return [
                    'success' => false,
                    'message' => 'No Stripe customer ID found for this booking.',
                    'refund_id' => null,
                ];
            }

            // Get the payment intent from Stripe
            // Note: In a real implementation, you'd store payment_intent_id in bookings table
            // For now, we'll search by customer and metadata
            $paymentIntents = \Stripe\PaymentIntent::all([
                'customer' => $booking->stripe_customer_id,
                'limit' => 10,
            ]);

            $paymentIntent = null;
            foreach ($paymentIntents->data as $pi) {
                if (isset($pi->metadata->booking_id) && $pi->metadata->booking_id == $booking->id) {
                    $paymentIntent = $pi;
                    break;
                }
            }

            if (!$paymentIntent) {
                return [
                    'success' => false,
                    'message' => 'Payment intent not found for this booking.',
                    'refund_id' => null,
                ];
            }

            // Get the charge ID from the payment intent
            $charges = \Stripe\Charge::all([
                'payment_intent' => $paymentIntent->id,
                'limit' => 1,
            ]);

            if (empty($charges->data)) {
                return [
                    'success' => false,
                    'message' => 'No charge found for this payment intent.',
                    'refund_id' => null,
                ];
            }

            $charge = $charges->data[0];

            // Create refund
            $refundData = [
                'charge' => $charge->id,
            ];

            if ($amount !== null) {
                $refundData['amount'] = (int)($amount * 100); // Convert to cents
            }

            $refund = Refund::create($refundData);

            // Update booking status
            $booking->update([
                'status' => 'refunded',
            ]);

            Log::info("Refund processed for booking {$booking->id}: {$refund->id}");

            return [
                'success' => true,
                'message' => $amount ? "Partial refund of $" . number_format($amount, 2) . " processed successfully." : "Full refund processed successfully.",
                'refund_id' => $refund->id,
            ];
        } catch (\Exception $e) {
            Log::error("Refund failed for booking {$booking->id}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Refund failed: ' . $e->getMessage(),
                'refund_id' => null,
            ];
        }
    }

    /**
     * Cancel a booking and process refund.
     *
     * @param Booking $booking
     * @param bool $refund Whether to process refund
     * @return array ['success' => bool, 'message' => string]
     */
    public function cancelBooking(Booking $booking, bool $refund = true): array
    {
        try {
            if ($refund) {
                $refundResult = $this->processRefund($booking);
                if (!$refundResult['success']) {
                    return $refundResult;
                }
            }

            $booking->update([
                'status' => 'cancelled',
            ]);

            Log::info("Booking {$booking->id} cancelled" . ($refund ? " with refund" : ""));

            return [
                'success' => true,
                'message' => 'Booking cancelled successfully' . ($refund ? ' and refund processed.' : '.'),
            ];
        } catch (\Exception $e) {
            Log::error("Cancel booking failed for booking {$booking->id}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Cancellation failed: ' . $e->getMessage(),
            ];
        }
    }
}







