<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;

class BookingService
{
    protected $calendarService;

    public function __construct(CalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }
    /**
     * Handle booking lifecycle and status updates.
     */
    public function updateBookingStatuses(): void
    {
        $today = Carbon::today();
        
        // Fix bookings marked as 'completed' - they should be 'active' until plan period ends
        // If end_date has passed, mark as expired; otherwise mark as active
        Booking::where('status', 'completed')
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->update(['status' => 'active']);
        
        // Auto-expire bookings past end_date (including those that were 'completed')
        Booking::whereIn('status', ['active', 'completed'])
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->update(['status' => 'expired']);

        // Activate pending bookings that have passed start_date
        Booking::where('status', 'pending')
            ->where('start_date', '<=', $today)
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
            'monthly' => $startDate->copy()->addMonth(),
            'academic_term' => $startDate->copy()->addMonths(6),
            'annual' => $startDate->copy()->addYear(),
            default => null,
        };
    }

    /**
     * Validate booking dates against calendar events.
     *
     * @param Carbon $startDate
     * @return array ['valid' => bool, 'message' => string]
     */
    public function validateBookingDates(Carbon $startDate): array
    {
        return $this->calendarService->validateBookingDate($startDate);
    }

    /**
     * Check if a student has overlapping bookings for the same date range.
     *
     * @param int $studentId
     * @param Carbon $startDate
     * @param Carbon|null $endDate
     * @param int|null $excludeBookingId Booking ID to exclude from check (for updates)
     * @return bool
     */
    public function hasOverlappingBooking(int $studentId, Carbon $startDate, ?Carbon $endDate = null, ?int $excludeBookingId = null): bool
    {
        $query = Booking::where('student_id', $studentId)
            ->whereIn('status', ['pending', 'active'])
            ->where(function ($q) use ($startDate, $endDate) {
                // Check if existing booking overlaps with new booking dates
                $q->where(function ($subQ) use ($startDate, $endDate) {
                    // Existing booking starts before new booking ends
                    $subQ->where('start_date', '<=', $endDate ?? $startDate->copy()->addYear())
                        // And existing booking ends after new booking starts
                        ->where(function ($endQ) use ($startDate) {
                            $endQ->whereNull('end_date')
                                ->orWhere('end_date', '>=', $startDate);
                        });
                });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }
}

