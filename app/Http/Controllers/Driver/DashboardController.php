<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\PickupPoint;
use App\Models\Route;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $driver = $request->user();
        
        // Get driver's assigned routes (multiple routes support)
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->get();

        $routeIds = $routes->pluck('id')->toArray();

        // Aggregate stats across all routes
        $stats = [
            'route_name' => $routes->count() > 1 
                ? "{$routes->count()} Routes" 
                : ($routes->first()?->name ?? 'No route assigned'),
            'vehicle' => $routes->count() === 1 && $routes->first()?->vehicle
                ? "{$routes->first()->vehicle->make} {$routes->first()->vehicle->model} ({$routes->first()->vehicle->license_plate})"
                : ($routes->count() > 1 ? "Multiple Vehicles" : 'No vehicle assigned'),
            'total_students' => !empty($routeIds) ? Booking::whereIn('route_id', $routeIds)
                ->whereIn('status', ['pending', 'active'])
                ->distinct()
                ->count('student_id') : 0,
            'pickup_points' => $routes->sum(function ($route) {
                return $route->pickupPoints->count();
            }),
        ];

        // Get today's bookings count across all routes
        $todayBookings = 0;
        if (!empty($routeIds)) {
            $today = now()->format('Y-m-d');
            $todayBookings = Booking::whereIn('route_id', $routeIds)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->count();
        }
        
        $stats['today_bookings'] = $todayBookings;

        // Today's schedule timeline (across all routes)
        $todaySchedule = [];
        if (!empty($routeIds)) {
            $today = Carbon::today();
            $todayBookingsList = Booking::whereIn('route_id', $routeIds)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->with(['student', 'pickupPoint', 'route'])
                ->get();

            // Get all pickup points from all routes
            $allPickupPoints = collect();
            foreach ($routes as $route) {
                $points = $route->pickupPoints()->orderBy('sequence_order')->get();
                foreach ($points as $point) {
                    $allPickupPoints->push([
                        'id' => $point->id,
                        'name' => $point->name,
                        'pickup_time' => $point->pickup_time,
                        'sequence_order' => $point->sequence_order,
                        'route_name' => $route->name,
                    ]);
                }
            }

            // Sort by pickup time
            $allPickupPoints = $allPickupPoints->sortBy('pickup_time');

            foreach ($allPickupPoints as $pickupPointData) {
                $pointBookings = $todayBookingsList->where('pickup_point_id', $pickupPointData['id']);
                if ($pointBookings->count() > 0) {
                    $route = $routes->firstWhere('name', $pickupPointData['route_name']);
                    $allCompleted = $pointBookings->every(function ($booking) {
                        return $booking->status === 'completed';
                    });
                    
                    $todaySchedule[] = [
                        'time' => $pickupPointData['pickup_time'],
                        'title' => $pickupPointData['name'],
                        'description' => "Pickup {$pointBookings->count()} student(s) - {$pickupPointData['route_name']}",
                        'students' => $pointBookings->map(function ($booking) {
                            return $booking->student->name;
                        })->toArray(),
                        'status' => $allCompleted ? 'completed' : 'upcoming',
                        'pickup_point_id' => $pickupPointData['id'],
                        'route_id' => $route?->id,
                    ];
                }
            }
        }

        // Next 3 pickup points (across all routes)
        $nextPickupPoints = [];
        if (!empty($routeIds)) {
            $allPoints = collect();
            foreach ($routes as $route) {
                $points = $route->pickupPoints()->orderBy('sequence_order')->get();
                foreach ($points as $point) {
                    $allPoints->push([
                        'id' => $point->id,
                        'name' => $point->name,
                        'address' => $point->address,
                        'pickup_time' => $point->pickup_time,
                        'dropoff_time' => $point->dropoff_time,
                        'sequence_order' => $point->sequence_order,
                        'route_name' => $route->name,
                    ]);
                }
            }
            
            $nextPickupPoints = $allPoints->sortBy('pickup_time')->take(3)->values()->toArray();
        }

        // Route performance metrics (aggregated)
        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => !empty($routeIds) ? Booking::whereIn('route_id', $routeIds)->count() : 0,
            'average_students_per_trip' => !empty($routeIds) 
                ? round(Booking::whereIn('route_id', $routeIds)->count() > 0 
                    ? Booking::whereIn('route_id', $routeIds)->distinct('student_id')->count() / Booking::whereIn('route_id', $routeIds)->count() 
                    : 0, 1) 
                : 0,
        ];

        // Detailed student list with pickup points and times (across all routes)
        $studentsList = [];
        if (!empty($routeIds)) {
            $today = Carbon::today();
            $activeBookings = Booking::whereIn('route_id', $routeIds)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->with(['student', 'pickupPoint', 'route'])
                ->get();

            // Get all pickup points from all routes
            $allPickupPoints = collect();
            foreach ($routes as $route) {
                $points = $route->pickupPoints()->orderBy('sequence_order')->get();
                foreach ($points as $point) {
                    $allPickupPoints->push($point);
                }
            }

            foreach ($allPickupPoints as $pickupPoint) {
                $pointBookings = $activeBookings->where('pickup_point_id', $pickupPoint->id);
                
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
                            'route_name' => $booking->route->name,
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
        }

        return Inertia::render('Driver/Dashboard', [
            'routes' => $routes->map(function ($route) {
                return [
                    'id' => $route->id,
                    'name' => $route->name,
                    'vehicle' => $route->vehicle ? [
                        'make' => $route->vehicle->make,
                        'model' => $route->vehicle->model,
                        'license_plate' => $route->vehicle->license_plate,
                    ] : null,
                ];
            })->values(),
            'route' => $routes->count() === 1 ? [
                'id' => $routes->first()->id,
                'name' => $routes->first()->name,
                'vehicle' => $routes->first()->vehicle ? [
                    'make' => $routes->first()->vehicle->make,
                    'model' => $routes->first()->vehicle->model,
                    'license_plate' => $routes->first()->vehicle->license_plate,
                ] : null,
            ] : null,
            'stats' => $stats,
            'todaySchedule' => $todaySchedule,
            'nextPickupPoints' => $nextPickupPoints,
            'performanceMetrics' => $performanceMetrics,
            'studentsList' => $studentsList,
        ]);
    }

    public function studentsSchedule(Request $request)
    {
        $driver = $request->user();
        $routeId = $request->input('route_id');
        
        // Get driver's assigned routes
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->get();

        if ($routes->isEmpty()) {
            return Inertia::render('Driver/StudentsSchedule', [
                'routes' => [],
                'selectedRoute' => null,
                'studentsList' => [],
            ]);
        }

        // If route_id is provided, use it; otherwise use the first route
        $route = $routeId 
            ? $routes->firstWhere('id', $routeId) 
            : $routes->first();

        if (!$route) {
            return Inertia::render('Driver/StudentsSchedule', [
                'routes' => $routes->map(function ($r) {
                    return ['id' => $r->id, 'name' => $r->name];
                })->values(),
                'selectedRoute' => null,
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
            'routes' => $routes->map(function ($r) {
                return ['id' => $r->id, 'name' => $r->name];
            })->values(),
            'selectedRoute' => [
                'id' => $route->id,
                'name' => $route->name,
            ],
            'studentsList' => $studentsList,
        ]);
    }

    public function routePerformance(Request $request)
    {
        $driver = $request->user();
        $routeId = $request->input('route_id');
        
        // Get driver's assigned routes
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle'])
            ->get();

        if ($routes->isEmpty()) {
            return Inertia::render('Driver/RoutePerformance', [
                'routes' => [],
                'selectedRoute' => null,
                'performanceMetrics' => [],
                'weeklyStats' => [],
                'monthlyStats' => [],
            ]);
        }

        // If route_id is provided, use it; otherwise aggregate across all routes
        $routeIds = $routeId 
            ? [$routeId]
            : $routes->pluck('id')->toArray();

        $selectedRoute = $routeId ? $routes->firstWhere('id', $routeId) : null;

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
            'routes' => $routes->map(function ($r) {
                return ['id' => $r->id, 'name' => $r->name];
            })->values(),
            'selectedRoute' => $selectedRoute ? [
                'id' => $selectedRoute->id,
                'name' => $selectedRoute->name,
            ] : null,
            'performanceMetrics' => $performanceMetrics,
            'weeklyStats' => $weeklyStats,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function routeInformation(Request $request)
    {
        $driver = $request->user();
        $routeId = $request->input('route_id');
        
        // Get driver's assigned routes
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints', 'driver'])
            ->get();

        if ($routes->isEmpty()) {
            return Inertia::render('Driver/RouteInformation', [
                'routes' => [],
                'selectedRoute' => null,
            ]);
        }

        // If route_id is provided, use it; otherwise use the first route
        $route = $routeId 
            ? $routes->firstWhere('id', $routeId) 
            : $routes->first();

        if (!$route) {
            return Inertia::render('Driver/RouteInformation', [
                'routes' => $routes->map(function ($r) {
                    return ['id' => $r->id, 'name' => $r->name];
                })->values(),
                'selectedRoute' => null,
            ]);
        }

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
            'routes' => $routes->map(function ($r) {
                return ['id' => $r->id, 'name' => $r->name];
            })->values(),
            'selectedRoute' => [
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
}

