<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\DailyPickup;
use App\Models\Route;
use App\Models\RouteCompletion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    protected $pricingService;

    public function __construct(PricingService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

    /**
     * Get revenue trends for a date range.
     *
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @param string $groupBy 'day', 'week', 'month'
     * @return array
     */
    public function getRevenueTrends(Carbon $startDate, Carbon $endDate, string $groupBy = 'day'): array
    {
        $bookings = Booking::whereIn('status', ['active', 'pending', 'awaiting_approval'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with(['route.vehicle'])
            ->get();

        $trends = [];
        $current = $startDate->copy();

        while ($current->lte($endDate)) {
            $periodStart = $current->copy();
            $periodEnd = $current->copy();

            switch ($groupBy) {
                case 'week':
                    $periodEnd->endOfWeek();
                    $label = $periodStart->format('M d') . ' - ' . $periodEnd->format('M d');
                    break;
                case 'month':
                    $periodEnd->endOfMonth();
                    $label = $periodStart->format('M Y');
                    break;
                default:
                    $periodEnd->endOfDay();
                    $label = $periodStart->format('M d');
            }

            $periodBookings = $bookings->filter(function ($booking) use ($periodStart, $periodEnd) {
                return $booking->created_at->gte($periodStart) && $booking->created_at->lte($periodEnd);
            });

            $revenue = 0;
            foreach ($periodBookings as $booking) {
                try {
                    if ($booking->route) {
                        $price = $this->pricingService->calculatePrice(
                            $booking->plan_type,
                            $booking->trip_type ?? 'two_way',
                            $booking->route
                        );
                        $revenue += $price;
                    }
                } catch (\Exception $e) {
                    // Skip bookings without valid pricing
                }
            }

            $trends[] = [
                'date' => $periodStart->format('Y-m-d'),
                'label' => $label,
                'revenue' => round($revenue, 2),
                'bookings_count' => $periodBookings->count(),
            ];

            switch ($groupBy) {
                case 'week':
                    $current->addWeek();
                    break;
                case 'month':
                    $current->addMonth();
                    break;
                default:
                    $current->addDay();
            }
        }

        return $trends;
    }

    /**
     * Get capacity utilization metrics for all routes.
     *
     * @return array
     */
    public function getCapacityUtilization(): array
    {
        $routes = Route::where('active', true)
            ->with(['vehicle', 'driver'])
            ->get();

        $utilization = [];

        foreach ($routes as $route) {
            $activeBookings = Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
                ->count();

            $utilizationPercent = $route->capacity > 0 
                ? round(($activeBookings / $route->capacity) * 100, 2)
                : 0;

            $utilization[] = [
                'route_id' => $route->id,
                'route_name' => $route->name,
                'capacity' => $route->capacity,
                'active_bookings' => $activeBookings,
                'available_seats' => max(0, $route->capacity - $activeBookings),
                'utilization_percent' => $utilizationPercent,
                'status' => $utilizationPercent >= 100 ? 'full' : ($utilizationPercent >= 80 ? 'high' : ($utilizationPercent >= 50 ? 'medium' : 'low')),
                'driver_name' => $route->driver ? $route->driver->name : 'No driver',
                'vehicle_type' => $route->vehicle ? $route->vehicle->type : 'No vehicle',
            ];
        }

        return $utilization;
    }

    /**
     * Get driver performance metrics.
     *
     * @param int|null $driverId
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public function getDriverPerformanceMetrics(?int $driverId = null, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subDays(30);
        $endDate = $endDate ?? Carbon::now();

        $query = User::where('role', 'driver');

        if ($driverId) {
            $query->where('id', $driverId);
        }

        $drivers = $query->get();

        $metrics = [];

        foreach ($drivers as $driver) {
            $routes = Route::where('driver_id', $driver->id)
                ->where('active', true)
                ->get();

            $totalRoutes = $routes->count();
            $totalBookings = Booking::whereIn('route_id', $routes->pluck('id'))
                ->whereIn('status', ['active', 'pending', 'awaiting_approval'])
                ->count();

            // Route completions
            $completions = RouteCompletion::where('driver_id', $driver->id)
                ->whereBetween('completion_date', [$startDate, $endDate])
                ->get();

            $totalCompletions = $completions->count();

            // Daily pickups
            $dailyPickups = DailyPickup::where('driver_id', $driver->id)
                ->whereBetween('pickup_date', [$startDate, $endDate])
                ->get();

            $totalPickups = $dailyPickups->count();
            $onTimePickups = $dailyPickups->filter(function ($pickup) use ($routes) {
                $route = $routes->firstWhere('id', $pickup->route_id);
                if (!$route || !$route->pickup_time) {
                    return false;
                }
                $expectedTime = Carbon::parse($pickup->pickup_date->format('Y-m-d') . ' ' . $route->pickup_time->format('H:i:s'));
                $actualTime = $pickup->completed_at;
                if (!$actualTime) {
                    return false;
                }
                $diff = abs($expectedTime->diffInMinutes($actualTime));
                return $diff <= 15; // On time if within 15 minutes
            })->count();

            $onTimeRate = $totalPickups > 0 ? round(($onTimePickups / $totalPickups) * 100, 2) : 0;

            // Average completion time (if we have completion data)
            $avgCompletionTime = null;
            if ($completions->isNotEmpty()) {
                $totalMinutes = $completions->sum(function ($completion) {
                    if ($completion->completed_at && $completion->route && $completion->route->pickup_time) {
                        $startTime = Carbon::parse($completion->completion_date->format('Y-m-d') . ' ' . $completion->route->pickup_time->format('H:i:s'));
                        return $startTime->diffInMinutes($completion->completed_at);
                    }
                    return 0;
                });
                $avgCompletionTime = $totalMinutes > 0 ? round($totalMinutes / $completions->count(), 2) : null;
            }

            $metrics[] = [
                'driver_id' => $driver->id,
                'driver_name' => $driver->name,
                'driver_email' => $driver->email,
                'total_routes' => $totalRoutes,
                'total_bookings' => $totalBookings,
                'total_completions' => $totalCompletions,
                'total_pickups' => $totalPickups,
                'on_time_pickups' => $onTimePickups,
                'on_time_rate' => $onTimeRate,
                'avg_completion_time_minutes' => $avgCompletionTime,
                'period_start' => $startDate->format('Y-m-d'),
                'period_end' => $endDate->format('Y-m-d'),
            ];
        }

        return $metrics;
    }

    /**
     * Get route efficiency metrics.
     *
     * @param int|null $routeId
     * @return array
     */
    public function getRouteEfficiencyMetrics(?int $routeId = null): array
    {
        $query = Route::where('active', true);

        if ($routeId) {
            $query->where('id', $routeId);
        }

        $routes = $query->with(['vehicle', 'driver', 'pickupPoints'])->get();

        $metrics = [];

        foreach ($routes as $route) {
            $bookings = Booking::where('route_id', $route->id)
                ->whereIn('status', ['active', 'pending', 'awaiting_approval'])
                ->count();

            $utilization = $route->capacity > 0 
                ? round(($bookings / $route->capacity) * 100, 2)
                : 0;

            // Average bookings per day (last 30 days)
            $recentBookings = Booking::where('route_id', $route->id)
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->count();

            $avgBookingsPerDay = round($recentBookings / 30, 2);

            // Pickup points efficiency
            $pickupPoints = $route->pickupPoints;
            $pickupPointsCount = $pickupPoints->count();

            // Daily pickups for this route
            $dailyPickups = DailyPickup::where('route_id', $route->id)
                ->where('pickup_date', '>=', Carbon::now()->subDays(30))
                ->get();

            $avgPickupsPerDay = $dailyPickups->count() > 0 
                ? round($dailyPickups->count() / 30, 2)
                : 0;

            $metrics[] = [
                'route_id' => $route->id,
                'route_name' => $route->name,
                'capacity' => $route->capacity,
                'active_bookings' => $bookings,
                'utilization_percent' => $utilization,
                'pickup_points_count' => $pickupPointsCount,
                'avg_bookings_per_day' => $avgBookingsPerDay,
                'avg_pickups_per_day' => $avgPickupsPerDay,
                'driver_name' => $route->driver ? $route->driver->name : 'No driver',
                'vehicle_type' => $route->vehicle ? $route->vehicle->type : 'No vehicle',
                'service_period' => $route->servicePeriod(),
            ];
        }

        return $metrics;
    }

    /**
     * Generate a report based on type and filters.
     *
     * @param string $type
     * @param array $filters
     * @return array
     */
    public function generateReport(string $type, array $filters = []): array
    {
        $startDate = isset($filters['start_date']) 
            ? Carbon::parse($filters['start_date']) 
            : Carbon::now()->subDays(30);
        
        $endDate = isset($filters['end_date']) 
            ? Carbon::parse($filters['end_date']) 
            : Carbon::now();

        switch ($type) {
            case 'revenue':
                return [
                    'type' => 'revenue',
                    'data' => $this->getRevenueTrends($startDate, $endDate, $filters['group_by'] ?? 'day'),
                    'summary' => $this->getRevenueSummary($startDate, $endDate),
                ];

            case 'capacity':
                return [
                    'type' => 'capacity',
                    'data' => $this->getCapacityUtilization(),
                    'summary' => $this->getCapacitySummary(),
                ];

            case 'driver':
                return [
                    'type' => 'driver',
                    'data' => $this->getDriverPerformanceMetrics(
                        $filters['driver_id'] ?? null,
                        $startDate,
                        $endDate
                    ),
                ];

            case 'route':
                return [
                    'type' => 'route',
                    'data' => $this->getRouteEfficiencyMetrics($filters['route_id'] ?? null),
                ];

            default:
                throw new \InvalidArgumentException("Unknown report type: {$type}");
        }
    }

    /**
     * Get revenue summary.
     *
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    protected function getRevenueSummary(Carbon $startDate, Carbon $endDate): array
    {
        $bookings = Booking::whereIn('status', ['active', 'pending', 'awaiting_approval'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with(['route.vehicle'])
            ->get();

        $totalRevenue = 0;
        $byPlanType = [];

        foreach ($bookings as $booking) {
            try {
                if ($booking->route) {
                    $price = $this->pricingService->calculatePrice(
                        $booking->plan_type,
                        $booking->trip_type ?? 'two_way',
                        $booking->route
                    );
                    $totalRevenue += $price;

                    if (!isset($byPlanType[$booking->plan_type])) {
                        $byPlanType[$booking->plan_type] = 0;
                    }
                    $byPlanType[$booking->plan_type] += $price;
                }
            } catch (\Exception $e) {
                // Skip bookings without valid pricing
            }
        }

        return [
            'total_revenue' => round($totalRevenue, 2),
            'total_bookings' => $bookings->count(),
            'revenue_by_plan_type' => $byPlanType,
            'period_start' => $startDate->format('Y-m-d'),
            'period_end' => $endDate->format('Y-m-d'),
        ];
    }

    /**
     * Get capacity summary.
     *
     * @return array
     */
    protected function getCapacitySummary(): array
    {
        $utilization = $this->getCapacityUtilization();

        $totalCapacity = array_sum(array_column($utilization, 'capacity'));
        $totalBookings = array_sum(array_column($utilization, 'active_bookings'));
        $overallUtilization = $totalCapacity > 0 
            ? round(($totalBookings / $totalCapacity) * 100, 2)
            : 0;

        $fullRoutes = count(array_filter($utilization, fn($r) => $r['status'] === 'full'));
        $highRoutes = count(array_filter($utilization, fn($r) => $r['status'] === 'high'));
        $mediumRoutes = count(array_filter($utilization, fn($r) => $r['status'] === 'medium'));
        $lowRoutes = count(array_filter($utilization, fn($r) => $r['status'] === 'low'));

        return [
            'total_routes' => count($utilization),
            'total_capacity' => $totalCapacity,
            'total_bookings' => $totalBookings,
            'overall_utilization_percent' => $overallUtilization,
            'full_routes' => $fullRoutes,
            'high_utilization_routes' => $highRoutes,
            'medium_utilization_routes' => $mediumRoutes,
            'low_utilization_routes' => $lowRoutes,
        ];
    }
}




