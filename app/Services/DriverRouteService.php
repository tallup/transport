<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\DailyPickup;
use App\Models\Route;
use App\Models\RouteCompletion;
use Carbon\Carbon;

/**
 * Shared driver route logic used by DashboardController and RosterController.
 * Single source of truth for route data, active route selection, period detection,
 * and booking completion checks.
 */
class DriverRouteService
{
    /**
     * Get all route data for a driver (AM/PM routes, completion status).
     */
    public function getDriverRouteData($driver): array
    {
        $today = Carbon::today();

        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints', 'completions' => function ($query) use ($today) {
                $query->whereDate('completion_date', $today);
            }])
            ->get();

        if ($routes->isEmpty()) {
            return [
                'routes' => $routes,
                'amRoute' => null,
                'pmRoute' => null,
                'bothRoute' => null,
                'amCompleted' => false,
                'pmCompleted' => false,
            ];
        }

        $amRoute = null;
        $pmRoute = null;
        $bothRoute = null;

        foreach ($routes as $route) {
            $period = $route->servicePeriod();
            if ($period === 'am') {
                if (!$amRoute) $amRoute = $route;
            } elseif ($period === 'pm') {
                if (!$pmRoute) $pmRoute = $route;
            } else {
                if (!$bothRoute) $bothRoute = $route;
            }
        }

        $amCompleted = $amRoute
            ? RouteCompletion::where('route_id', $amRoute->id)
                ->where('driver_id', $driver->id)
                ->whereDate('completion_date', $today)
                ->where('period', 'am')
                ->exists()
            : false;

        $pmCompleted = $pmRoute
            ? RouteCompletion::where('route_id', $pmRoute->id)
                ->where('driver_id', $driver->id)
                ->whereDate('completion_date', $today)
                ->where('period', 'pm')
                ->exists()
            : false;

        return [
            'routes' => $routes,
            'amRoute' => $amRoute,
            'pmRoute' => $pmRoute,
            'bothRoute' => $bothRoute,
            'amCompleted' => $amCompleted,
            'pmCompleted' => $pmCompleted,
        ];
    }

    /**
     * Get the active route for the driver based on current time and completion status,
     * with optional manual period selection.
     */
    public function getActiveRoute($driver, ?string $requestedPeriod = null, ?array $data = null)
    {
        $currentTime = Carbon::now();
        $isMorning = $currentTime->format('H:i:s') < '12:00:00';

        $data = $data ?? $this->getDriverRouteData($driver);
        $routes = $data['routes'];
        $amRoute = $data['amRoute'];
        $pmRoute = $data['pmRoute'];
        $bothRoute = $data['bothRoute'];
        $amCompleted = $data['amCompleted'];

        if ($routes->isEmpty()) {
            return null;
        }

        if (in_array($requestedPeriod, ['am', 'pm'], true)) {
            if ($requestedPeriod === 'am' && $amRoute) {
                return $amRoute;
            }
            if ($requestedPeriod === 'pm' && $pmRoute) {
                if ($amRoute && !$amCompleted) {
                    return $amRoute;
                }
                return $pmRoute;
            }
        }

        // Default behavior: never auto-switch to PM after AM completion
        if ($amRoute) {
            return $amRoute;
        }

        // No AM route exists - use time-based logic
        if ($isMorning) {
            return $bothRoute;
        }

        return $pmRoute ?: $bothRoute ?: $routes->first();
    }

    /**
     * Get the period (AM/PM) for a route based on current time and route service period.
     */
    public function getRoutePeriod($route): string
    {
        $period = $route->servicePeriod();

        if (in_array($period, ['am', 'pm'])) {
            return $period;
        }

        $currentTime = Carbon::now();
        return $currentTime->format('H:i:s') < '12:00:00' ? 'am' : 'pm';
    }

    /**
     * Check if all bookings for a route are completed for today and period.
     */
    public function areAllBookingsCompleted($route, ?string $period = null): bool
    {
        $today = Carbon::today();
        $period = $period ?? $this->getRoutePeriod($route);

        $totalBookings = Booking::where('route_id', $route->id)
            ->where('status', Booking::STATUS_ACTIVE)
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->count();

        if ($totalBookings === 0) {
            return false;
        }

        $bookingsWithPickups = Booking::where('route_id', $route->id)
            ->whereIn('status', [Booking::STATUS_ACTIVE, Booking::STATUS_AWAITING_APPROVAL])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->whereHas('dailyPickups', function ($query) use ($today, $period) {
                $query->whereDate('pickup_date', $today)
                    ->where('period', $period);
            })
            ->count();

        return $totalBookings === $bookingsWithPickups;
    }
}
