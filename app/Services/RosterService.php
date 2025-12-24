<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\Route;
use Carbon\Carbon;

class RosterService
{
    /**
     * Generate daily roster for a driver's route.
     *
     * @param Route $route
     * @param Carbon $date
     * @return array
     */
    public function generateDailyRoster(Route $route, Carbon $date): array
    {
        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $date->format('Y-m-d'))
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        if (!$isSchoolDay) {
            return [];
        }

        // Get active bookings for the date
        $bookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            })
            ->with(['student', 'pickupPoint'])
            ->get();

        // Group by pickup point
        return $bookings
            ->groupBy('pickup_point_id')
            ->map(function ($bookings) {
                $pickupPoint = $bookings->first()->pickupPoint;
                return [
                    'pickup_point' => $pickupPoint,
                    'bookings' => $bookings->sortBy('student.name'),
                    'pickup_time' => $pickupPoint->pickup_time,
                    'dropoff_time' => $pickupPoint->dropoff_time,
                ];
            })
            ->sortBy('pickup_point.sequence_order')
            ->values()
            ->toArray();
    }
}

