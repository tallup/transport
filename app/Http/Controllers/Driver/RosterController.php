<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\DailyPickup;
use App\Models\Route;
use App\Models\RouteCompletion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RosterController extends Controller
{
    private function getDriverRouteData($driver)
    {
        $today = Carbon::today();

        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
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

        $amCompleted = $amRoute
            ? RouteCompletion::where('route_id', $amRoute->id)
                ->where('driver_id', $driver->id)
                ->whereDate('completion_date', $today)
                ->exists()
            : false;

        $pmCompleted = $pmRoute
            ? RouteCompletion::where('route_id', $pmRoute->id)
                ->where('driver_id', $driver->id)
                ->whereDate('completion_date', $today)
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
     * Get the active route for the driver based on current time and completion status.
     * Same logic as DashboardController, with optional manual period selection.
     */
    private function getActiveRoute($driver, ?string $requestedPeriod = null, ?array $data = null)
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
                // Block PM switch until AM is completed
                if ($amRoute && !$amCompleted) {
                    return $amRoute;
                }
                return $pmRoute;
            }
        }

        // Default behavior: never auto-switch to PM after AM completion
        if ($amRoute) {
            if (!$amCompleted) {
                return $amRoute;
            }

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
    private function getRoutePeriod($route)
    {
        $period = $route->servicePeriod();
        
        // If route has explicit period, use it
        if (in_array($period, ['am', 'pm'])) {
            return $period;
        }
        
        // If route is 'both' or undefined, determine by current time
        $currentTime = Carbon::now();
        return $currentTime->format('H:i:s') < '12:00:00' ? 'am' : 'pm';
    }

    /**
     * Check if all bookings for a route are completed for today and period.
     */
    private function areAllBookingsCompleted($route, $period = null)
    {
        $today = Carbon::today();
        $period = $period ?? $this->getRoutePeriod($route);
        
        // Get all active bookings for this route on this date
        // Only show 'active' bookings on routes (not 'pending' - those haven't been paid yet)
        $totalBookings = Booking::where('route_id', $route->id)
            ->where('status', 'active')
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->count();

        if ($totalBookings === 0) {
            return false;
        }

        // Check if all bookings have daily pickup records for today and period
        // Only check 'active' bookings (not 'pending' - those haven't been paid yet)
        $bookingsWithPickups = Booking::where('route_id', $route->id)
            ->where('status', 'active')
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

    public function index(Request $request)
    {
        $driver = $request->user();
        $today = Carbon::today();
        $todayFormatted = $today->format('Y-m-d');

        $requestedPeriod = $request->query('period');
        $routeData = $this->getDriverRouteData($driver);

        // Get the active route (always use today's date)
        $selectedRoute = $this->getActiveRoute($driver, $requestedPeriod, $routeData);

        if (!$selectedRoute) {
            return Inertia::render('Driver/Roster', [
                'route' => null,
                'date' => $todayFormatted,
                'isSchoolDay' => false,
                'groupedBookings' => [],
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
                'canCompleteRoute' => false,
                'isRouteCompleted' => false,
                'message' => 'No active route assigned to you.',
            ]);
        }

        // Determine the period for this route
        $routePeriod = $this->getRoutePeriod($selectedRoute);

        // Check if route is completed today for this period
        $isRouteCompleted = RouteCompletion::where('route_id', $selectedRoute->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->where('period', $routePeriod)
            ->exists();

        // Check if all bookings are completed for this period
        $canCompleteRoute = $this->areAllBookingsCompleted($selectedRoute, $routePeriod) && !$isRouteCompleted;

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $todayFormatted)
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        $groupedBookings = [];

        if ($isSchoolDay) {
            // Get active bookings for today (within their booking period)
            // Only show 'active' bookings on routes (not 'pending' - those haven't been paid yet)
            // This ensures bookings are visible for the entire duration they're valid
            $bookings = Booking::where('route_id', $selectedRoute->id)
                ->where('status', 'active')
                ->whereDate('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhereDate('end_date', '>=', $today);
                })
                ->with(['student.school', 'pickupPoint', 'dailyPickups' => function ($query) use ($today, $routePeriod) {
                    $query->whereDate('pickup_date', $today)
                        ->where('period', $routePeriod);
                }])
                ->get();

            // Separate bookings with pickup points and custom addresses
            $bookingsWithPickupPoints = $bookings->filter(function ($booking) {
                return $booking->pickupPoint !== null && $booking->student !== null;
            });
            
            $bookingsWithCustomAddresses = $bookings->filter(function ($booking) {
                return $booking->pickupPoint === null && 
                       !empty($booking->pickup_address) && 
                       $booking->student !== null;
            });

            // Group by pickup point
            $groupedBookings = $bookingsWithPickupPoints
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
                            // Check if this booking has a daily pickup for today
                            $hasDailyPickup = $booking->dailyPickups->isNotEmpty();
                            return [
                                'id' => $booking->id,
                                'status' => $booking->status,
                                'hasDailyPickup' => $hasDailyPickup,
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

            // Add custom address bookings as a separate group
            if ($bookingsWithCustomAddresses->count() > 0) {
                $customGroup = [
                    'pickup_point' => [
                        'id' => null,
                        'name' => 'Custom Pickup Locations',
                        'address' => 'Various addresses',
                        'pickup_time' => $selectedRoute->pickup_time ? (is_string($selectedRoute->pickup_time) ? substr($selectedRoute->pickup_time, 0, 5) : $selectedRoute->pickup_time->format('H:i')) : 'TBD',
                        'dropoff_time' => $selectedRoute->dropoff_time ? (is_string($selectedRoute->dropoff_time) ? substr($selectedRoute->dropoff_time, 0, 5) : $selectedRoute->dropoff_time->format('H:i')) : null,
                        'sequence_order' => 9999,
                    ],
                    'bookings' => $bookingsWithCustomAddresses->sortBy(function ($booking) {
                        return $booking->student ? $booking->student->name : '';
                    })->map(function ($booking) {
                        if (!$booking->student) {
                            return null;
                        }
                        // Check if this booking has a daily pickup for today
                        $hasDailyPickup = $booking->dailyPickups->isNotEmpty();
                        return [
                            'id' => $booking->id,
                            'status' => $booking->status,
                            'hasDailyPickup' => $hasDailyPickup,
                            'pickup_address' => $booking->pickup_address,
                            'student' => [
                                'id' => $booking->student->id,
                                'name' => $booking->student->name,
                                'school' => $booking->student->school->name ?? 'N/A',
                                'emergency_phone' => $booking->student->emergency_phone ?? null,
                                'grade' => $booking->student->grade ?? null,
                            ],
                        ];
                    })->filter()->values()->toArray(),
                ];
                $groupedBookings[] = $customGroup;
            }
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
            'currentPeriod' => $routePeriod,
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'canCompleteRoute' => $canCompleteRoute,
            'isRouteCompleted' => $isRouteCompleted,
        ]);
    }

    public function markComplete(Request $request, Booking $booking)
    {
        $driver = $request->user();
        $today = Carbon::today();

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
        if (!in_array($booking->status, ['pending', 'awaiting_approval', 'active'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending, awaiting approval, or active bookings can be marked as complete.',
            ], 400);
        }

        // Get the route to determine period
        $route = Route::find($booking->route_id);
        $period = $this->getRoutePeriod($route);

        // Check if daily pickup already exists for today and period
        $existingPickup = DailyPickup::where('booking_id', $booking->id)
            ->whereDate('pickup_date', $today)
            ->where('period', $period)
            ->first();

        if ($existingPickup) {
            return response()->json([
                'success' => false,
                'message' => 'This pickup has already been marked as complete for today.',
            ], 400);
        }

        // Create daily pickup record instead of updating booking status
        $dailyPickup = DailyPickup::create([
            'booking_id' => $booking->id,
            'route_id' => $booking->route_id,
            'driver_id' => $driver->id,
            'pickup_date' => $today,
            'pickup_point_id' => $booking->pickup_point_id,
            'period' => $period,
            'completed_at' => Carbon::now(),
            'notes' => $request->input('notes'),
        ]);

        // Send pickup completed notification to parent
        $pickupLocation = $booking->pickupPoint ? $booking->pickupPoint->name : ($booking->pickup_address ?? 'Custom Location');
        $parent = $booking->student?->parent;
        if ($parent && filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
            $parent->notifyNow(new \App\Notifications\PickupCompleted(
                $booking,
                $pickupLocation,
                $period,
                $dailyPickup->completed_at
            ));
        } else {
            \Log::warning('PickupCompleted notification skipped: missing parent email', [
                'booking_id' => $booking->id,
            ]);
        }

        // Notify admins of pickup/drop-off completion
        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\PickupCompletedAlert(
            $booking,
            $driver,
            $period,
            $dailyPickup->completed_at,
            $pickupLocation
        ));

        return response()->json([
            'success' => true,
            'message' => 'Pickup marked as complete successfully.',
        ]);
    }

    public function markPickupPointComplete(Request $request)
    {
        $driver = $request->user();
        
        $validated = $request->validate([
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
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

        // Get the period for this route
        $period = $this->getRoutePeriod($route);

        // Get all active bookings for this pickup point on this date
        // Only show 'active' bookings (not 'pending' - those haven't been paid yet)
        $date = Carbon::parse($validated['date']);
        $bookings = Booking::where('route_id', $validated['route_id'])
            ->where(function ($query) use ($validated) {
                // Match bookings with this pickup_point_id, or bookings with custom addresses if pickup_point_id is null
                if ($validated['pickup_point_id']) {
                    $query->where('pickup_point_id', $validated['pickup_point_id']);
                } else {
                    // If pickup_point_id is null, we're trying to complete custom address bookings
                    $query->whereNull('pickup_point_id')
                        ->whereNotNull('pickup_address');
                }
            })
            ->where('status', 'active')
            ->whereDate('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $date);
            })
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active bookings found for this pickup point.',
            ], 404);
        }

        // Create daily pickup records for all bookings instead of updating booking status
        $createdCount = 0;
        $bookings->each(function ($booking) use ($driver, $route, $date, $period, &$createdCount) {
            // Check if daily pickup already exists
            $existingPickup = DailyPickup::where('booking_id', $booking->id)
                ->whereDate('pickup_date', $date)
                ->where('period', $period)
                ->first();

            if (!$existingPickup) {
                $dailyPickup = DailyPickup::create([
                    'booking_id' => $booking->id,
                    'route_id' => $booking->route_id,
                    'driver_id' => $driver->id,
                    'pickup_date' => $date,
                    'pickup_point_id' => $booking->pickup_point_id,
                    'period' => $period,
                    'completed_at' => Carbon::now(),
                ]);
                $createdCount++;

                // Send pickup completed notification to parent
                $pickupLocation = $booking->pickupPoint ? $booking->pickupPoint->name : ($booking->pickup_address ?? 'Custom Location');
                $parent = $booking->student?->parent;
                if ($parent && filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
                    $parent->notifyNow(new \App\Notifications\PickupCompleted(
                        $booking,
                        $pickupLocation,
                        $period,
                        $dailyPickup->completed_at
                    ));
                } else {
                    \Log::warning('PickupCompleted notification skipped: missing parent email', [
                        'booking_id' => $booking->id,
                    ]);
                }

                // Notify admins of pickup/drop-off completion
                $adminService = app(\App\Services\AdminNotificationService::class);
                $adminService->notifyAdmins(new \App\Notifications\Admin\PickupCompletedAlert(
                    $booking,
                    $driver,
                    $period,
                    $dailyPickup->completed_at,
                    $pickupLocation
                ));
            }
        });

        return response()->json([
            'success' => true,
            'message' => "Successfully marked {$createdCount} pickup(s) as complete.",
            'count' => $createdCount,
        ]);
    }
}





