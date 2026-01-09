<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\PickupPoint;
use App\Models\Route;
use App\Models\RouteCompletion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Get the active route for the driver based on current time and completion status.
     * 
     * @param \App\Models\User $driver
     * @return \App\Models\Route|null
     */
    private function getActiveRoute($driver)
    {
        $today = Carbon::today();
        $currentTime = Carbon::now();
        $isMorning = $currentTime->format('H:i:s') < '12:00:00';

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

        // If driver has only one route, show it regardless of period
        if ($routes->count() === 1) {
            return $routes->first();
        }

        // If it's morning (before 12:00 PM), show AM route or 'both' route
        if ($isMorning) {
            if ($amRoute) {
                return $amRoute;
            }
            // Fallback to 'both' route or PM route or any route
            return $bothRoute ?: $pmRoute ?: $routes->first();
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
     * 
     * @param \App\Models\Route $route
     * @return bool
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
            return false; // No bookings to complete
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
        
        // Get the active route based on time and completion status
        $route = $this->getActiveRoute($driver);

        // If no active route, return empty dashboard
        if (!$route) {
            return Inertia::render('Driver/Dashboard', [
                'route' => null,
                'currentPeriod' => null,
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
        $currentPeriod = $route->servicePeriod(); // 'am' or 'pm'
        
        // Check if route is already completed today
        $today = Carbon::today();
        $isRouteCompleted = RouteCompletion::where('route_id', $route->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->exists();

        // Check if all bookings are completed
        $canCompleteRoute = $this->areAllBookingsCompleted($route) && !$isRouteCompleted;

        // Calculate stats for the active route
        $todayFormatted = $today->format('Y-m-d');
        $totalStudents = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $todayFormatted)
            ->where(function ($query) use ($todayFormatted) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $todayFormatted);
            })
            ->distinct()
            ->count('student_id');

        $todayBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $todayFormatted)
            ->where(function ($query) use ($todayFormatted) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $todayFormatted);
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
        $todaySchedule = [];
        $todayBookingsList = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active', 'completed'])
            ->where('start_date', '<=', $todayFormatted)
            ->where(function ($query) use ($todayFormatted) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $todayFormatted);
            })
            ->with(['student', 'pickupPoint'])
            ->get();

        $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();

        foreach ($pickupPoints as $pickupPoint) {
            $pointBookings = $todayBookingsList->where('pickup_point_id', $pickupPoint->id);
            if ($pointBookings->count() > 0) {
                $allCompleted = $pointBookings->every(function ($booking) {
                    return $booking->status === 'completed';
                });
                
                $todaySchedule[] = [
                    'time' => $pickupPoint->pickup_time,
                    'title' => $pickupPoint->name,
                    'description' => "Pickup {$pointBookings->count()} student(s)",
                    'students' => $pointBookings->map(function ($booking) {
                        return $booking->student->name;
                    })->toArray(),
                    'status' => $allCompleted ? 'completed' : 'upcoming',
                    'pickup_point_id' => $pickupPoint->id,
                    'route_id' => $route->id,
                ];
            }
        }

        // Route performance metrics
        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => Booking::where('route_id', $route->id)->count(),
            'average_students_per_trip' => $todayBookings > 0 
                ? round($totalStudents / $todayBookings, 1) 
                : 0,
        ];

        // Detailed student list
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
                        'pickup_time' => $pickupPoint->pickup_time,
                        'sequence_order' => $pickupPoint->sequence_order,
                        'booking_id' => $booking->id,
                    ];
                }
            }
        }

        // Sort by pickup time, then by sequence order
        usort($studentsList, function ($a, $b) {
            $timeCompare = strcmp($a['pickup_time'], $b['pickup_time']);
            if ($timeCompare !== 0) {
                return $timeCompare;
            }
            return $a['sequence_order'] <=> $b['sequence_order'];
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

        // Check if route is already completed today
        $today = Carbon::today();
        $existingCompletion = RouteCompletion::where('route_id', $route->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->first();

        if ($existingCompletion) {
            return response()->json([
                'success' => false,
                'message' => 'This route has already been completed today.',
            ], 400);
        }

        // Verify all bookings are completed
        if (!$this->areAllBookingsCompleted($route)) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot complete route. Some bookings are not yet completed.',
            ], 400);
        }

        // Create route completion record
        RouteCompletion::create([
            'route_id' => $route->id,
            'driver_id' => $driver->id,
            'completion_date' => $today,
            'completed_at' => Carbon::now(),
            'notes' => $request->input('notes'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Route marked as complete successfully.',
        ]);
    }

    public function studentsSchedule(Request $request)
    {
        $driver = $request->user();
        
        // Get the active route
        $route = $this->getActiveRoute($driver);

        if (!$route) {
            return Inertia::render('Driver/StudentsSchedule', [
                'route' => null,
                'studentsList' => [],
            ]);
        }

        $today = Carbon::today();
        $activeBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
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

        // Sort by sequence order, then by pickup time
        usort($studentsList, function ($a, $b) {
            if ($a['sequence_order'] != $b['sequence_order']) {
                return $a['sequence_order'] <=> $b['sequence_order'];
            }
            return strcmp($a['pickup_time'], $b['pickup_time']);
        });

        return Inertia::render('Driver/StudentsSchedule', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
            ],
            'studentsList' => $studentsList,
        ]);
    }

    public function routePerformance(Request $request)
    {
        $driver = $request->user();
        
        // Get the active route
        $route = $this->getActiveRoute($driver);

        if (!$route) {
            return Inertia::render('Driver/RoutePerformance', [
                'route' => null,
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
            ->whereIn('status', ['pending', 'active'])
            ->count();
        $completedBookings = Booking::whereIn('route_id', $routeIds)
            ->where('status', 'completed')
            ->count();

        // Weekly stats
        $weeklyBookings = Booking::whereIn('route_id', $routeIds)
            ->where('created_at', '>=', $thisWeekStart)
            ->count();
        $weeklyActive = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->where('start_date', '>=', $thisWeekStart)
            ->count();

        // Monthly stats
        $monthlyBookings = Booking::whereIn('route_id', $routeIds)
            ->where('created_at', '>=', $thisMonthStart)
            ->count();
        $monthlyActive = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->where('start_date', '>=', $thisMonthStart)
            ->count();

        // Calculate average students per trip
        $totalStudents = Booking::whereIn('route_id', $routeIds)
            ->whereIn('status', ['pending', 'active'])
            ->distinct()
            ->count('student_id');

        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => $totalBookings,
            'active_trips' => $activeBookings,
            'completed_trips' => $completedBookings,
            'total_students' => $totalStudents,
            'average_students_per_trip' => $totalBookings > 0 ? round($totalStudents / $totalBookings, 1) : 0,
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
            'performanceMetrics' => $performanceMetrics,
            'weeklyStats' => $weeklyStats,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function routeInformation(Request $request)
    {
        $driver = $request->user();
        
        // Get the active route
        $route = $this->getActiveRoute($driver);

        if (!$route) {
            return Inertia::render('Driver/RouteInformation', [
                'route' => null,
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
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->count();

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
            'pickupPoints' => $pickupPoints,
            'activeBookingsCount' => $activeBookingsCount,
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
                ->where('start_date', '<=', $completion->completion_date)
                ->where(function ($query) use ($completion) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $completion->completion_date);
                })
                ->count();

            $completedBookings = Booking::where('route_id', $route->id)
                ->where('status', 'completed')
                ->where('start_date', '<=', $completion->completion_date)
                ->where(function ($query) use ($completion) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $completion->completion_date);
                })
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
                    'completed_bookings' => $completedBookings,
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

