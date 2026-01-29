<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\DailyPickup;
use App\Models\PickupPoint;
use App\Models\Route;
use App\Models\RouteCompletion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getDriverRouteData($driver)
    {
        $today = Carbon::today();

        // Get all active routes for the driver
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints', 'completions' => function ($query) use ($today) {
                $query->whereDate('completion_date', $today);
            }])
            ->get();

        // Debug logging
        \Log::info("Driver {$driver->id} ({$driver->name}) - Active routes found: " . $routes->count());

        if ($routes->isEmpty()) {
            // Check if driver has any routes (even inactive ones) for debugging
            $allRoutes = Route::where('driver_id', $driver->id)->get(['id', 'name', 'active']);
            if ($allRoutes->isNotEmpty()) {
                \Log::info("Driver {$driver->id} has routes but none are active: " . $allRoutes->pluck('name')->join(', '));
            }
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
     * Check if all bookings for a route are completed for today.
     * 
     * @param \App\Models\Route $route
     * @return bool
     */
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
        // Include 'active' and 'awaiting_approval' bookings (awaiting_approval means approved and ready to service)
        $totalBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['active', 'awaiting_approval'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->count();

        if ($totalBookings === 0) {
            return false; // No bookings to complete
        }

        // Check if all bookings have daily pickup records for today and period
        // Check 'active' and 'awaiting_approval' bookings (awaiting_approval means approved and ready to service)
        $bookingsWithPickups = Booking::where('route_id', $route->id)
            ->whereIn('status', ['active', 'awaiting_approval'])
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
        
        $requestedPeriod = $request->query('period');
        $routeData = $this->getDriverRouteData($driver);

        // Get the active route based on time, completion status, and optional manual selection
        $route = $this->getActiveRoute($driver, $requestedPeriod, $routeData);

        // If no active route, return empty dashboard
        if (!$route) {
            return Inertia::render('Driver/Dashboard', [
                'route' => null,
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
                'stats' => [
                    'route_name' => 'No route assigned',
                    'vehicle' => 'No vehicle assigned',
                    'total_students' => 0,
                    'pickup_points' => 0,
                    'pickup_time' => null,
                    'dropoff_time' => null,
                ],
                'todaySchedule' => [],
                'performanceMetrics' => [
                    'on_time_percentage' => 0,
                    'total_trips' => 0,
                    'average_students_per_trip' => 0,
                ],
                'studentsList' => [],
                'canCompleteRoute' => false,
                'isRouteCompleted' => false,
            ]);
        }

        // Determine current period
        $currentPeriod = $this->getRoutePeriod($route); // 'am' or 'pm'
        
        // Check if route is already completed today for this period
        $today = Carbon::today();
        $isRouteCompleted = RouteCompletion::where('route_id', $route->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->where('period', $currentPeriod)
            ->exists();

        // Check if all bookings are completed for this period
        $canCompleteRoute = $this->areAllBookingsCompleted($route, $currentPeriod) && !$isRouteCompleted;

        // Calculate stats for the active route
        // Use Carbon instance for date comparison to ensure proper type handling
        $totalStudents = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->distinct()
            ->count('student_id');

        $todayBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->count();

        // Format pickup/dropoff times
        $pickupTimeFormatted = $route->pickup_time 
            ? (is_string($route->pickup_time) ? substr($route->pickup_time, 0, 5) : $route->pickup_time->format('H:i'))
            : null;
        
        $dropoffTimeFormatted = $route->dropoff_time 
            ? (is_string($route->dropoff_time) ? substr($route->dropoff_time, 0, 5) : $route->dropoff_time->format('H:i'))
            : null;

        $stats = [
            'route_name' => $route->name,
            'vehicle' => $route->vehicle 
                ? "{$route->vehicle->make} {$route->vehicle->model} ({$route->vehicle->license_plate})"
                : 'No vehicle assigned',
            'total_students' => $totalStudents,
            'pickup_points' => $route->pickupPoints->count(),
            'pickup_time' => $pickupTimeFormatted,
            'dropoff_time' => $dropoffTimeFormatted,
        ];

        // Today's schedule timeline
        // Fetch bookings that are active today (within their booking period)
        // Show 'active' and 'awaiting_approval' bookings (awaiting_approval means approved and ready to service)
        $todaySchedule = [];
        $todayBookingsList = Booking::where('route_id', $route->id)
            ->whereIn('status', ['active', 'awaiting_approval'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->with(['student', 'pickupPoint', 'dailyPickups' => function ($query) use ($today, $currentPeriod) {
                $query->whereDate('pickup_date', $today)
                    ->where('period', $currentPeriod);
            }])
            ->get();

        $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();

        // Group bookings by pickup points
        foreach ($pickupPoints as $pickupPoint) {
            $pointBookings = $todayBookingsList->where('pickup_point_id', $pickupPoint->id);
            if ($pointBookings->count() > 0) {
                $allCompleted = $pointBookings->every(function ($booking) {
                    return $booking->dailyPickups->isNotEmpty();
                });
                
                $todaySchedule[] = [
                    'time' => $pickupPoint->pickup_time,
                    'title' => $pickupPoint->name,
                    'description' => "Pickup {$pointBookings->count()} student(s)",
                    'students' => $pointBookings->map(function ($booking) {
                        return [
                            'name' => $booking->student->name,
                            'address' => $booking->pickup_address ?? $booking->pickupPoint->address ?? 'Address not set',
                            'booking_id' => $booking->id,
                        ];
                    })->toArray(),
                    'status' => $allCompleted ? 'completed' : 'upcoming',
                    'pickup_point_id' => $pickupPoint->id,
                    'route_id' => $route->id,
                ];
            }
        }

        // Also show bookings with custom pickup addresses (no pickup_point_id)
        $customAddressBookings = $todayBookingsList->filter(function ($booking) {
            return empty($booking->pickup_point_id) && !empty($booking->pickup_address);
        });

        if ($customAddressBookings->count() > 0) {
            $allCompleted = $customAddressBookings->every(function ($booking) {
                return $booking->dailyPickups->isNotEmpty();
            });
            
            $todaySchedule[] = [
                'time' => $route->pickup_time ? (is_string($route->pickup_time) ? substr($route->pickup_time, 0, 5) : $route->pickup_time->format('H:i')) : 'TBD',
                'title' => 'Custom Pickup Locations',
                'description' => "Pickup {$customAddressBookings->count()} student(s) at custom locations",
                'students' => $customAddressBookings->map(function ($booking) {
                    return [
                        'name' => $booking->student->name,
                        'address' => $booking->pickup_address,
                        'booking_id' => $booking->id,
                    ];
                })->toArray(),
                'status' => $allCompleted ? 'completed' : 'upcoming',
                'pickup_point_id' => null,
                'route_id' => $route->id,
                'is_custom' => true,
            ];
        }

        // Route performance metrics
        // Count daily pickups for today and current period
        $todayPickups = DailyPickup::where('route_id', $route->id)
            ->whereDate('pickup_date', $today)
            ->where('period', $currentPeriod)
            ->count();

        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => $todayPickups,
            'average_students_per_trip' => $todayPickups > 0 
                ? round($totalStudents / $todayPickups, 1) 
                : 0,
        ];

        // Detailed student list (using the same bookings list from todaySchedule)
        $studentsList = [];
        foreach ($pickupPoints as $pickupPoint) {
            $pointBookings = $todayBookingsList->where('pickup_point_id', $pickupPoint->id);
            
            if ($pointBookings->count() > 0) {
                foreach ($pointBookings as $booking) {
                    $studentsList[] = [
                        'id' => $booking->student->id,
                        'name' => $booking->student->name,
                        'pickup_point_id' => $pickupPoint->id,
                        'pickup_point_name' => $pickupPoint->name,
                        'pickup_point_address' => $pickupPoint->address,
                        'pickup_address' => $booking->pickup_address ?? null,
                        'pickup_time' => $pickupPoint->pickup_time,
                        'sequence_order' => $pickupPoint->sequence_order,
                        'booking_id' => $booking->id,
                        'status' => $booking->status,
                    ];
                }
            }
        }

        // Add students with custom pickup addresses (no pickup_point_id)
        foreach ($customAddressBookings as $booking) {
            $studentsList[] = [
                'id' => $booking->student->id,
                'name' => $booking->student->name,
                'pickup_point_id' => null,
                'pickup_point_name' => 'Custom Location',
                'pickup_point_address' => $booking->pickup_address,
                'pickup_address' => $booking->pickup_address,
                'pickup_time' => $route->pickup_time ? (is_string($route->pickup_time) ? substr($route->pickup_time, 0, 5) : $route->pickup_time->format('H:i')) : 'TBD',
                'sequence_order' => 9999, // Put custom addresses at the end
                'booking_id' => $booking->id,
                'status' => $booking->status,
                'is_custom' => true,
            ];
        }

        // Sort by pickup time, then by sequence order
        usort($studentsList, function ($a, $b) {
            $timeCompare = strcmp($a['pickup_time'] ?? '', $b['pickup_time'] ?? '');
            if ($timeCompare !== 0) {
                return $timeCompare;
            }
            return ($a['sequence_order'] ?? 9999) <=> ($b['sequence_order'] ?? 9999);
        });

        return Inertia::render('Driver/Dashboard', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'vehicle' => $route->vehicle ? [
                    'make' => $route->vehicle->make,
                    'model' => $route->vehicle->model,
                    'license_plate' => $route->vehicle->license_plate,
                ] : null,
                'pickup_time' => $pickupTimeFormatted,
                'dropoff_time' => $dropoffTimeFormatted,
            ],
            'currentPeriod' => $currentPeriod,
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'stats' => $stats,
            'todaySchedule' => $todaySchedule,
            'performanceMetrics' => $performanceMetrics,
            'studentsList' => $studentsList,
            'canCompleteRoute' => $canCompleteRoute,
            'isRouteCompleted' => $isRouteCompleted,
        ]);
    }

    /**
     * Mark a route as complete for the current day.
     * 
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Route $route
     * @return \Illuminate\Http\JsonResponse
     */
    public function markRouteComplete(Request $request, Route $route)
    {
        $driver = $request->user();

        // Verify the route belongs to the driver
        if ($route->driver_id !== $driver->id || !$route->active) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This route does not belong to you.',
            ], 403);
        }

        // Get the period for this route
        $period = $this->getRoutePeriod($route);

        // Check if route is already completed today for this period
        $today = Carbon::today();
        $existingCompletion = RouteCompletion::where('route_id', $route->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->where('period', $period)
            ->first();

        if ($existingCompletion) {
            return response()->json([
                'success' => false,
                'message' => 'This route has already been completed today for this period.',
            ], 400);
        }

        // Verify all bookings are completed for this period
        if (!$this->areAllBookingsCompleted($route, $period)) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot complete route. Some pickups are not yet completed.',
            ], 400);
        }

        // Create route completion record (daily pickup completion)
        $routeCompletion = RouteCompletion::create([
            'route_id' => $route->id,
            'driver_id' => $driver->id,
            'completion_date' => $today,
            'period' => $period,
            'completed_at' => Carbon::now(),
            'notes' => $request->input('notes'),
            'review' => $request->input('review'),
        ]);

        // Send route completed notification to all parents with active bookings on this route
        $activeBookings = Booking::where('route_id', $route->id)
            ->where('status', 'active')
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->with(['student.parent'])
            ->get();

        $studentsCount = $activeBookings->count();

        foreach ($activeBookings as $booking) {
            $parent = $booking->student?->parent;
            if ($parent && filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
                $parent->notifyNow(new \App\Notifications\RouteCompleted(
                    $booking,
                    $route,
                    $period,
                    $routeCompletion->completed_at
                ));
            } else {
                \Log::warning('RouteCompleted notification skipped: missing parent email', [
                    'booking_id' => $booking->id,
                ]);
            }
            
            // Send push notification
            if ($parent) {
                $pushHelper = app(\App\Services\PushNotificationHelper::class);
                $pushHelper->sendIfSubscribed(
                    $parent,
                    'Route Completed',
                    'The ' . strtoupper($period) . ' route has been completed successfully.',
                    ['type' => 'route_completed', 'booking_id' => $booking->id, 'route_id' => $route->id, 'period' => $period, 'url' => route('parent.bookings.show', $booking)]
                );
            }
        }

        // Notify admins of route completion
        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\RouteCompletedAlert(
            $route,
            $driver,
            $period,
            $routeCompletion->completed_at,
            $studentsCount
        ));

        return response()->json([
            'success' => true,
            'message' => 'Route marked as complete successfully.',
        ]);
    }

    public function studentsSchedule(Request $request)
    {
        $driver = $request->user();
        
        $requestedPeriod = $request->query('period');
        $routeData = $this->getDriverRouteData($driver);
        
        // Get the active route
        $route = $this->getActiveRoute($driver, $requestedPeriod, $routeData);

        if (!$route) {
            return Inertia::render('Driver/StudentsSchedule', [
                'route' => null,
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
                'studentsList' => [],
            ]);
        }

        $today = Carbon::today();
        // Show 'active' and 'awaiting_approval' bookings (awaiting_approval means approved and ready to service)
        $activeBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['active', 'awaiting_approval'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->with(['student.school', 'pickupPoint', 'dropoffPoint'])
            ->get();

        // Group by pickup point and sort by sequence order
        $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();
        $studentsList = [];
        
        foreach ($pickupPoints as $pickupPoint) {
            $pointBookings = $activeBookings->where('pickup_point_id', $pickupPoint->id);
            
            if ($pointBookings->count() > 0) {
                foreach ($pointBookings as $booking) {
                    $studentsList[] = [
                        'id' => $booking->student->id,
                        'name' => $booking->student->name,
                        'grade' => $booking->student->grade,
                        'school' => $booking->student->school->name ?? 'N/A',
                        'pickup_point_id' => $pickupPoint->id,
                        'pickup_point_name' => $pickupPoint->name,
                        'pickup_point_address' => $pickupPoint->address,
                        'pickup_address' => $booking->pickup_address ?? null,
                        'pickup_time' => $pickupPoint->pickup_time,
                        'dropoff_time' => $pickupPoint->dropoff_time,
                        'dropoff_point_name' => $booking->dropoffPoint->name ?? $pickupPoint->name,
                        'sequence_order' => $pickupPoint->sequence_order,
                        'booking_id' => $booking->id,
                        'plan_type' => $booking->plan_type,
                        'start_date' => $booking->start_date->format('Y-m-d'),
                        'end_date' => $booking->end_date ? $booking->end_date->format('Y-m-d') : null,
                    ];
                }
            }
        }

        // Add bookings with custom pickup addresses (no pickup_point_id)
        $customAddressBookings = $activeBookings->filter(function ($booking) {
            return empty($booking->pickup_point_id) && !empty($booking->pickup_address);
        });

        foreach ($customAddressBookings as $booking) {
            $studentsList[] = [
                'id' => $booking->student->id,
                'name' => $booking->student->name,
                'grade' => $booking->student->grade,
                'school' => $booking->student->school->name ?? 'N/A',
                'pickup_point_id' => null,
                'pickup_point_name' => 'Custom Location',
                'pickup_point_address' => $booking->pickup_address,
                'pickup_address' => $booking->pickup_address,
                'pickup_time' => $route->pickup_time ? (is_string($route->pickup_time) ? substr($route->pickup_time, 0, 5) : $route->pickup_time->format('H:i')) : 'TBD',
                'dropoff_time' => $route->dropoff_time ? (is_string($route->dropoff_time) ? substr($route->dropoff_time, 0, 5) : $route->dropoff_time->format('H:i')) : null,
                'dropoff_point_name' => $booking->dropoffPoint->name ?? 'Custom Location',
                'sequence_order' => 9999, // Put custom addresses at the end
                'booking_id' => $booking->id,
                'plan_type' => $booking->plan_type,
                'start_date' => $booking->start_date->format('Y-m-d'),
                'end_date' => $booking->end_date ? $booking->end_date->format('Y-m-d') : null,
                'is_custom' => true,
            ];
        }

        // Sort by sequence order, then by pickup time
        usort($studentsList, function ($a, $b) {
            if (($a['sequence_order'] ?? 9999) != ($b['sequence_order'] ?? 9999)) {
                return ($a['sequence_order'] ?? 9999) <=> ($b['sequence_order'] ?? 9999);
            }
            return strcmp($a['pickup_time'] ?? '', $b['pickup_time'] ?? '');
        });

        return Inertia::render('Driver/StudentsSchedule', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
            ],
            'currentPeriod' => $this->getRoutePeriod($route),
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'studentsList' => $studentsList,
        ]);
    }

    public function routePerformance(Request $request)
    {
        $driver = $request->user();
        
        $requestedPeriod = $request->query('period');
        $routeData = $this->getDriverRouteData($driver);

        // Get the active route
        $route = $this->getActiveRoute($driver, $requestedPeriod, $routeData);

        if (!$route) {
            return Inertia::render('Driver/RoutePerformance', [
                'route' => null,
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
                'performanceMetrics' => [],
                'weeklyStats' => [],
                'monthlyStats' => [],
            ]);
        }

        $routeIds = [$route->id];

        $today = Carbon::today();
        $thisWeekStart = $today->copy()->startOfWeek();
        $thisMonthStart = $today->copy()->startOfMonth();

        // Overall performance metrics (aggregated or single route)
        $totalBookings = Booking::whereIn('route_id', $routeIds)->count();
        $activeBookings = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->count();
        // Count daily pickups instead of completed bookings
        $completedPickups = DailyPickup::whereIn('route_id', $routeIds)
            ->count();

        // Weekly stats
        $weeklyBookings = Booking::whereIn('route_id', $routeIds)
            ->where('created_at', '>=', $thisWeekStart)
            ->count();
        $weeklyActive = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->whereDate('start_date', '>=', $thisWeekStart)
            ->count();

        // Monthly stats
        $monthlyBookings = Booking::whereIn('route_id', $routeIds)
            ->where('created_at', '>=', $thisMonthStart)
            ->count();
        $monthlyActive = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->whereDate('start_date', '>=', $thisMonthStart)
            ->count();

        // Calculate average students per trip
        $totalStudents = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->distinct()
            ->count('student_id');

        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => $totalBookings,
            'active_trips' => $activeBookings,
            'completed_trips' => $completedPickups,
            'total_students' => $totalStudents,
            'average_students_per_trip' => $completedPickups > 0 ? round($totalStudents / $completedPickups, 1) : 0,
        ];

        $weeklyStats = [
            'total_bookings' => $weeklyBookings,
            'active_bookings' => $weeklyActive,
        ];

        $monthlyStats = [
            'total_bookings' => $monthlyBookings,
            'active_bookings' => $monthlyActive,
        ];

        return Inertia::render('Driver/RoutePerformance', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
            ],
            'currentPeriod' => $this->getRoutePeriod($route),
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'performanceMetrics' => $performanceMetrics,
            'weeklyStats' => $weeklyStats,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function routeInformation(Request $request)
    {
        $driver = $request->user();
        
        $requestedPeriod = $request->query('period');
        $routeData = $this->getDriverRouteData($driver);
        
        // Get the active route
        $route = $this->getActiveRoute($driver, $requestedPeriod, $routeData);

        if (!$route) {
            return Inertia::render('Driver/RouteInformation', [
                'route' => null,
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
            ]);
        }

        $route->load(['vehicle', 'pickupPoints', 'driver']);

        $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get()->map(function ($point) {
            return [
                'id' => $point->id,
                'name' => $point->name,
                'address' => $point->address,
                'latitude' => $point->latitude,
                'longitude' => $point->longitude,
                'sequence_order' => $point->sequence_order,
                'pickup_time' => $point->pickup_time,
                'dropoff_time' => $point->dropoff_time,
            ];
        });

        $today = Carbon::today();
        $activeBookingsCount = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->whereDate('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $today);
            })
            ->count();

        // Get all bookings for this route (active and pending)
        $bookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
            ->with(['student.school', 'pickupPoint', 'dropoffPoint'])
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'status' => $booking->status,
                    'plan_type' => $booking->plan_type,
                    'trip_type' => $booking->trip_type,
                    'start_date' => $booking->start_date->format('Y-m-d'),
                    'start_date_formatted' => $booking->start_date->format('M d, Y'),
                    'end_date' => $booking->end_date ? $booking->end_date->format('Y-m-d') : null,
                    'end_date_formatted' => $booking->end_date ? $booking->end_date->format('M d, Y') : 'Ongoing',
                    'pickup_address' => $booking->pickup_address,
                    'student' => $booking->student ? [
                        'id' => $booking->student->id,
                        'name' => $booking->student->name,
                        'grade' => $booking->student->grade,
                        'school' => $booking->student->school ? $booking->student->school->name : null,
                    ] : null,
                    'pickup_point' => $booking->pickupPoint ? [
                        'id' => $booking->pickupPoint->id,
                        'name' => $booking->pickupPoint->name,
                        'address' => $booking->pickupPoint->address,
                        'pickup_time' => $booking->pickupPoint->pickup_time,
                    ] : null,
                    'dropoff_point' => $booking->dropoffPoint ? [
                        'id' => $booking->dropoffPoint->id,
                        'name' => $booking->dropoffPoint->name,
                        'address' => $booking->dropoffPoint->address,
                    ] : null,
                ];
            });

        return Inertia::render('Driver/RouteInformation', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'capacity' => $route->capacity,
                'service_type' => $route->service_type,
                'active' => $route->active,
                'vehicle' => $route->vehicle ? [
                    'id' => $route->vehicle->id,
                    'make' => $route->vehicle->make,
                    'model' => $route->vehicle->model,
                    'year' => $route->vehicle->year,
                    'license_plate' => $route->vehicle->license_plate,
                    'registration_number' => $route->vehicle->registration_number,
                    'capacity' => $route->vehicle->capacity,
                    'type' => $route->vehicle->type,
                    'status' => $route->vehicle->status,
                ] : null,
                'driver' => $route->driver ? [
                    'id' => $route->driver->id,
                    'name' => $route->driver->name,
                    'email' => $route->driver->email,
                ] : null,
            ],
            'currentPeriod' => $this->getRoutePeriod($route),
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'pickupPoints' => $pickupPoints,
            'activeBookingsCount' => $activeBookingsCount,
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show all completed routes for the driver.
     */
    public function completedRoutes(Request $request)
    {
        $driver = $request->user();

        // Get all route completions for this driver, ordered by completion date (newest first)
        $completions = RouteCompletion::where('driver_id', $driver->id)
            ->with(['route.vehicle', 'route.pickupPoints'])
            ->orderBy('completion_date', 'desc')
            ->orderBy('completed_at', 'desc')
            ->paginate(15);

        // Format the completions data
        $completedRoutes = $completions->map(function ($completion) {
            $route = $completion->route;
            
            // Get route stats
            $totalBookings = Booking::where('route_id', $route->id)
                ->whereDate('start_date', '<=', $completion->completion_date)
                ->where(function ($query) use ($completion) {
                    $query->whereNull('end_date')
                        ->orWhereDate('end_date', '>=', $completion->completion_date);
                })
                ->count();

            // Count daily pickups for this completion date and period
            $completedPickups = DailyPickup::where('route_id', $route->id)
                ->whereDate('pickup_date', $completion->completion_date)
                ->where('period', $completion->period ?? 'am')
                ->count();

            // Format pickup/dropoff times
            $pickupTimeFormatted = $route->pickup_time 
                ? (is_string($route->pickup_time) ? substr($route->pickup_time, 0, 5) : $route->pickup_time->format('H:i'))
                : null;
            
            $dropoffTimeFormatted = $route->dropoff_time 
                ? (is_string($route->dropoff_time) ? substr($route->dropoff_time, 0, 5) : $route->dropoff_time->format('H:i'))
                : null;

            return [
                'id' => $completion->id,
                'completion_date' => $completion->completion_date->format('Y-m-d'),
                'completion_date_formatted' => $completion->completion_date->format('F j, Y'),
                'completed_at' => $completion->completed_at ? $completion->completed_at->format('Y-m-d H:i:s') : null,
                'completed_at_formatted' => $completion->completed_at ? $completion->completed_at->format('g:i A') : null,
                'notes' => $completion->notes,
                'review' => $completion->review,
                'period' => $completion->period ?? 'am',
                'route' => [
                    'id' => $route->id,
                    'name' => $route->name,
                    'service_type' => $route->service_type,
                    'service_period' => $route->servicePeriod(),
                    'pickup_time' => $pickupTimeFormatted,
                    'dropoff_time' => $dropoffTimeFormatted,
                    'capacity' => $route->capacity,
                    'vehicle' => $route->vehicle ? [
                        'make' => $route->vehicle->make,
                        'model' => $route->vehicle->model,
                        'license_plate' => $route->vehicle->license_plate,
                        'type' => $route->vehicle->type,
                    ] : null,
                    'pickup_points_count' => $route->pickupPoints->count(),
                ],
                'stats' => [
                    'total_bookings' => $totalBookings,
                    'completed_pickups' => $completedPickups,
                ],
            ];
        });

        return Inertia::render('Driver/CompletedRoutes', [
            'completedRoutes' => $completedRoutes,
            'pagination' => [
                'current_page' => $completions->currentPage(),
                'last_page' => $completions->lastPage(),
                'per_page' => $completions->perPage(),
                'total' => $completions->total(),
            ],
        ]);
    }
}

