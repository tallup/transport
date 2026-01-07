<?php

namespace App\Services;

use App\Exceptions\CapacityExceededException;
use App\Models\Booking;
use App\Models\Route;

class CapacityGuard
{
    /**
     * Check if a route has available capacity.
     *
     * @param Route $route
     * @param int|null $excludeBookingId Booking ID to exclude from count (for updates)
     * @return bool
     */
    public function hasAvailableCapacity(Route $route, ?int $excludeBookingId = null): bool
    {
        return $this->getAvailableSeats($route, $excludeBookingId) > 0;
    }

    /**
     * Get the number of available seats for a route.
     *
     * @param Route $route
     * @param int|null $excludeBookingId Booking ID to exclude from count (for updates)
     * @return int
     */
    public function getAvailableSeats(Route $route, ?int $excludeBookingId = null): int
    {
        $activeBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->when($excludeBookingId, fn($query) => $query->where('id', '!=', $excludeBookingId))
            ->count();

        return max(0, $route->capacity - $activeBookings);
    }

    /**
     * Validate if a booking can be created for a route.
     *
     * @param Route $route
     * @return bool
     * @throws CapacityExceededException
     */
    public function validateBookingCapacity(Route $route): bool
    {
        if (!$this->hasAvailableCapacity($route)) {
            throw new CapacityExceededException("Route '{$route->name}' is at full capacity. No seats available.");
        }

        return true;
    }
}

