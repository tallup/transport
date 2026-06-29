<?php

namespace App\Services;

use App\Models\Booking;
use App\Notifications\Admin\BookingExpiredAlert;
use App\Notifications\BookingExpired;
use Carbon\Carbon;

class BookingService
{
    protected $calendarService;

    public function __construct(
        CalendarService $calendarService,
        protected AdminNotificationService $adminNotificationService,
        protected PushNotificationHelper $pushNotificationHelper,
    ) {
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
        Booking::where('status', Booking::STATUS_COMPLETED)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->update(['status' => Booking::STATUS_ACTIVE]);

        // Get bookings that are expiring today (before updating status)
        // so we can send notifications to parents
        $expiringBookings = Booking::whereIn('status', [Booking::STATUS_ACTIVE, Booking::STATUS_COMPLETED])
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->with(['student.parent', 'route', 'pickupPoint'])
            ->get();

        // Auto-expire bookings past end_date (including those that were 'completed')
        Booking::whereIn('status', [Booking::STATUS_ACTIVE, Booking::STATUS_COMPLETED])
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->update(['status' => Booking::STATUS_EXPIRED]);

        // Notify parents (mail + in-app), push, and admins for each expired
        // booking. Each side-effect is wrapped individually so one failure
        // never aborts the loop or the HTTP request.
        foreach ($expiringBookings as $booking) {
            $parent = $booking->student?->parent;

            // Parent: mail + in-app database notification.
            try {
                if ($parent && filter_var($parent->email ?? '', FILTER_VALIDATE_EMAIL)) {
                    $parent->notify(new BookingExpired($booking));
                } else {
                    \Log::debug('BookingExpired notification skipped: missing parent email', [
                        'booking_id' => $booking->id,
                    ]);
                }
            } catch (\Throwable $e) {
                \Log::error('BookingExpired notification failed for booking #'.$booking->id.': '.$e->getMessage());
            }

            // Parent: PWA push (no-op when no subscription).
            try {
                if ($parent) {
                    $this->pushNotificationHelper->sendIfSubscribed(
                        $parent,
                        'Booking Expired',
                        'The booking for '.($booking->student?->name ?? 'your child').' has ended. Renew to continue service.',
                        ['type' => 'booking_expired', 'booking_id' => $booking->id],
                    );
                }
            } catch (\Throwable $e) {
                \Log::error('BookingExpired push failed for booking #'.$booking->id.': '.$e->getMessage());
            }

            // Admins: per-booking alert.
            try {
                $this->adminNotificationService->notifyAdmins(new BookingExpiredAlert($booking));
            } catch (\Throwable $e) {
                \Log::error('BookingExpiredAlert admin notification failed for booking #'.$booking->id.': '.$e->getMessage());
            }
        }

        // Bookings now require admin approval before becoming active
    }

    /**
     * Sync booking status with Stripe subscription.
     */
    public function syncStripeStatus(Booking $booking, string $stripeStatus): void
    {
        if ($stripeStatus === 'active' || $stripeStatus === 'trialing') {
            $booking->update(['status' => Booking::STATUS_ACTIVE]);
        } elseif (in_array($stripeStatus, ['canceled', 'unpaid', 'past_due'])) {
            $booking->update(['status' => Booking::STATUS_CANCELLED]);
        }
    }

    /**
     * Calculate end date based on plan type and start date.
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
     * @return array ['valid' => bool, 'message' => string]
     */
    public function validateBookingDates(Carbon $startDate): array
    {
        return $this->calendarService->validateBookingDate($startDate);
    }

    /**
     * Check if a student has overlapping bookings for the same date range.
     *
     * @param  int|null  $excludeBookingId  Booking ID to exclude from check (for updates)
     */
    public function hasOverlappingBooking(int $studentId, Carbon $startDate, ?Carbon $endDate = null, ?int $excludeBookingId = null): bool
    {
        $query = Booking::where('student_id', $studentId)
            ->whereIn('status', Booking::activeStatuses())
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
