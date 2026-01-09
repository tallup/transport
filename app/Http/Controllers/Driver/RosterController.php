<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\Route;
use App\Models\RouteCompletion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RosterController extends Controller
{
    /**
     * Get the active route for the driver based on current time and completion status.
     * Same logic as DashboardController.
     */
    private function getActiveRoute($driver)
    {
        $today = Carbon::today();
        $currentTime = Carbon::now();
        $isMorning = $currentTime->format('H:i:s') < '12:00:00';

        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->get();

        if ($routes->isEmpty()) {
            return null;
        }

        // Separate AM and PM routes
        $amRoute = null;
        $pmRoute = null;
        $bothRoute = null; // Route with service_type 'both' or no pickup_time

        foreach ($routes as $route) {
            $period = $route->servicePeriod();
            if ($period === 'am') {
                if (!$amRoute) {
                    $amRoute = $route;
                }
            } elseif ($period === 'pm') {
                if (!$pmRoute) {
                    $pmRoute = $route;
                }
            } else {
                // 'both' or undefined - can work for either period
                if (!$bothRoute) {
                    $bothRoute = $route;
                }
            }
        }

        // If it's morning (before 12:00 PM), show AM route or 'both' route only
        if ($isMorning) {
            if ($amRoute) {
                return $amRoute;
            }
            // Only show 'both' route in morning if no AM route exists
            // Don't show PM-only routes in the morning
            return $bothRoute;
        }

        // If it's afternoon (after 12:00 PM)
        // Check if AM route exists and is completed
        if ($amRoute) {
            $amCompleted = RouteCompletion::where('route_id', $amRoute->id)
                ->where('driver_id', $driver->id)
                ->whereDate('completion_date', $today)
                ->exists();

            // If AM route is not completed, show it
            if (!$amCompleted) {
                return $amRoute;
            }
        }

        // AM route is completed or doesn't exist, show PM route or 'both' route
        // Final fallback: return first active route if nothing else matches
        return $pmRoute ?: $bothRoute ?: $routes->first();
    }

    /**
     * Check if all bookings for a route are completed for today.
     */
    private function areAllBookingsCompleted($route)
    {
        $today = Carbon::today();
        
        $totalBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->count();

        if ($totalBookings === 0) {
            return false;
        }

        $completedBookings = Booking::where('route_id', $route->id)
            ->where('status', 'completed')
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->count();

        return $totalBookings === $completedBookings;
    }

    public function index(Request $request)
    {
        $driver = $request->user();
        $today = Carbon::today();
        $todayFormatted = $today->format('Y-m-d');

        // Get the active route (always use today's date)
        $selectedRoute = $this->getActiveRoute($driver);

        if (!$selectedRoute) {
            return Inertia::render('Driver/Roster', [
                'route' => null,
                'date' => $todayFormatted,
                'isSchoolDay' => false,
                'groupedBookings' => [],
                'canCompleteRoute' => false,
                'isRouteCompleted' => false,
                'message' => 'No active route assigned to you.',
            ]);
        }

        // Check if route is completed today
        $isRouteCompleted = RouteCompletion::where('route_id', $selectedRoute->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->exists();

        // Check if all bookings are completed
        $canCompleteRoute = $this->areAllBookingsCompleted($selectedRoute) && !$isRouteCompleted;

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $todayFormatted)
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        $groupedBookings = [];

        if ($isSchoolDay) {
            // Get active bookings for today
            $bookings = Booking::where('route_id', $selectedRoute->id)
                ->whereIn('status', ['pending', 'active', 'completed'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->with(['student.school', 'pickupPoint'])
                ->get();

            // Group by pickup point
            $groupedBookings = $bookings
                ->filter(function ($booking) {
                    // Only include bookings with valid pickup points and students
                    return $booking->pickupPoint !== null && $booking->student !== null;
                })
                ->groupBy('pickup_point_id')
                ->map(function ($bookings) {
                    $firstBooking = $bookings->first();
                    $pickupPoint = $firstBooking->pickupPoint;
                    
                    if (!$pickupPoint) {
                        return null;
                    }
                    
                    return [
                        'pickup_point' => [
                            'id' => $pickupPoint->id,
                            'name' => $pickupPoint->name,
                            'address' => $pickupPoint->address ?? null,
                            'pickup_time' => $pickupPoint->pickup_time,
                            'dropoff_time' => $pickupPoint->dropoff_time ?? null,
                            'sequence_order' => $pickupPoint->sequence_order ?? 999,
                        ],
                        'bookings' => $bookings->sortBy(function ($booking) {
                            return $booking->student ? $booking->student->name : '';
                        })->map(function ($booking) {
                            if (!$booking->student) {
                                return null;
                            }
                            return [
                                'id' => $booking->id,
                                'status' => $booking->status,
                                'student' => [
                                    'id' => $booking->student->id,
                                    'name' => $booking->student->name,
                                    'school' => $booking->student->school->name ?? 'N/A',
                                    'emergency_phone' => $booking->student->emergency_phone ?? null,
                                    'grade' => $booking->student->grade ?? null,
                                ],
                            ];
                        })->filter()->values(),
                    ];
                })
                ->filter() // Remove null entries
                ->sortBy('pickup_point.sequence_order')
                ->values()
                ->toArray();
        }

        return Inertia::render('Driver/Roster', [
            'route' => [
                'id' => $selectedRoute->id,
                'name' => $selectedRoute->name,
                'vehicle' => $selectedRoute->vehicle ? [
                    'make' => $selectedRoute->vehicle->make,
                    'model' => $selectedRoute->vehicle->model,
                    'license_plate' => $selectedRoute->vehicle->license_plate,
                ] : null,
            ],
            'date' => $todayFormatted,
            'isSchoolDay' => $isSchoolDay,
            'groupedBookings' => $groupedBookings,
            'canCompleteRoute' => $canCompleteRoute,
            'isRouteCompleted' => $isRouteCompleted,
        ]);
    }

    public function markComplete(Request $request, Booking $booking)
    {
        $driver = $request->user();

        // Verify the booking belongs to one of the driver's routes
        $driverRoutes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->pluck('id')
            ->toArray();

        if (!in_array($booking->route_id, $driverRoutes)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This booking does not belong to your route.',
            ], 403);
        }

        // Verify booking is in a state that can be completed
        if (!in_array($booking->status, ['pending', 'active'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending or active bookings can be marked as complete.',
            ], 400);
        }

        // Mark booking as completed
        $booking->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'message' => 'Trip marked as complete successfully.',
        ]);
    }

    public function markPickupPointComplete(Request $request)
    {
        $driver = $request->user();
        
        $validated = $request->validate([
            'pickup_point_id' => 'required|exists:pickup_points,id',
            'route_id' => 'required|exists:routes,id',
            'date' => 'required|date',
        ]);

        // Verify the route belongs to the driver
        $route = Route::where('id', $validated['route_id'])
            ->where('driver_id', $driver->id)
            ->where('active', true)
            ->first();

        if (!$route) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This route does not belong to you.',
            ], 403);
        }

        // Get all active bookings for this pickup point on this date
        $date = Carbon::parse($validated['date']);
        $bookings = Booking::where('route_id', $validated['route_id'])
            ->where('pickup_point_id', $validated['pickup_point_id'])
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            })
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active bookings found for this pickup point.',
            ], 404);
        }

        // Mark all bookings as completed
        $bookings->each(function ($booking) {
            $booking->update(['status' => 'completed']);
        });

        return response()->json([
            'success' => true,
            'message' => "Successfully marked {$bookings->count()} trip(s) as complete.",
            'count' => $bookings->count(),
        ]);
    }
}





