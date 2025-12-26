<?php

namespace App\Services;

use App\Models\CalendarEvent;
use Carbon\Carbon;

class CalendarService
{
    /**
     * Check if a date is a service day (not a holiday or closure).
     *
     * @param Carbon $date
     * @return bool
     */
    public function isServiceDay(Carbon $date): bool
    {
        // Check if date is a holiday or closure
        $event = CalendarEvent::whereDate('date', $date->format('Y-m-d'))
            ->whereIn('type', ['holiday', 'closure'])
            ->first();

        return $event === null;
    }

    /**
     * Get the count of service days between two dates (excluding holidays/closures).
     *
     * @param Carbon $start
     * @param Carbon $end
     * @return int
     */
    public function getServiceDaysBetween(Carbon $start, Carbon $end): int
    {
        $count = 0;
        $current = $start->copy();

        while ($current->lte($end)) {
            if ($this->isServiceDay($current)) {
                $count++;
            }
            $current->addDay();
        }

        return $count;
    }

    /**
     * Get the next available service day from a given date.
     *
     * @param Carbon $date
     * @return Carbon
     */
    public function getNextServiceDay(Carbon $date): Carbon
    {
        $current = $date->copy();

        // Check up to 30 days ahead
        $maxDays = 30;
        $daysChecked = 0;

        while ($daysChecked < $maxDays) {
            if ($this->isServiceDay($current)) {
                return $current;
            }
            $current->addDay();
            $daysChecked++;
        }

        // If no service day found, return the original date
        return $date;
    }

    /**
     * Validate that a booking date is not on a holiday or closure.
     *
     * @param Carbon $date
     * @return array ['valid' => bool, 'message' => string]
     */
    public function validateBookingDate(Carbon $date): array
    {
        if (!$this->isServiceDay($date)) {
            $event = CalendarEvent::whereDate('date', $date->format('Y-m-d'))
                ->whereIn('type', ['holiday', 'closure'])
                ->first();

            return [
                'valid' => false,
                'message' => "Booking cannot start on {$event->type}: " . ($event->description ?? 'Event') . ". Please select a different date.",
            ];
        }

        return [
            'valid' => true,
            'message' => '',
        ];
    }

    /**
     * Calculate end date excluding non-service days.
     * This adjusts the end date to account for holidays/closures within the booking period.
     *
     * @param Carbon $startDate
     * @param string $planType
     * @return Carbon
     */
    public function calculateEndDateExcludingNonServiceDays(Carbon $startDate, string $planType): Carbon
    {
        // First calculate the base end date
        $baseEndDate = match ($planType) {
            'weekly' => $startDate->copy()->addWeek(),
            'bi_weekly' => $startDate->copy()->addWeeks(2),
            'monthly' => $startDate->copy()->addMonth(),
            'semester' => $startDate->copy()->addMonths(6),
            'annual' => $startDate->copy()->addYear(),
            default => $startDate->copy()->addWeek(),
        };

        // Count non-service days in the period
        $nonServiceDays = 0;
        $current = $startDate->copy();

        while ($current->lte($baseEndDate)) {
            if (!$this->isServiceDay($current)) {
                $nonServiceDays++;
            }
            $current->addDay();
        }

        // Extend the end date by the number of non-service days
        return $baseEndDate->addDays($nonServiceDays);
    }
}

