<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;

class BookingService
{
    /**
     * Handle booking lifecycle and status updates.
     */
    public function updateBookingStatuses(): void
    {
        // Auto-expire bookings past end_date
        Booking::where('status', 'active')
            ->whereNotNull('end_date')
            ->where('end_date', '<', Carbon::now())
            ->update(['status' => 'expired']);

        // Activate pending bookings that have passed start_date
        Booking::where('status', 'pending')
            ->where('start_date', '<=', Carbon::now())
            ->update(['status' => 'active']);
    }

    /**
     * Sync booking status with Stripe subscription.
     *
     * @param Booking $booking
     * @param string $stripeStatus
     * @return void
     */
    public function syncStripeStatus(Booking $booking, string $stripeStatus): void
    {
        if ($stripeStatus === 'active' || $stripeStatus === 'trialing') {
            $booking->update(['status' => 'active']);
        } elseif (in_array($stripeStatus, ['canceled', 'unpaid', 'past_due'])) {
            $booking->update(['status' => 'cancelled']);
        }
    }

    /**
     * Calculate end date based on plan type and start date.
     *
     * @param string $planType
     * @param Carbon $startDate
     * @return Carbon|null
     */
    public function calculateEndDate(string $planType, Carbon $startDate): ?Carbon
    {
        return match ($planType) {
            'weekly' => $startDate->copy()->addWeek(),
            'bi_weekly' => $startDate->copy()->addWeeks(2),
            'monthly' => $startDate->copy()->addMonth(),
            'semester' => $startDate->copy()->addMonths(6),
            'annual' => $startDate->copy()->addYear(),
            default => null,
        };
    }
}

