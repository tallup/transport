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
        
        // Get driver's assigned route
        $route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->first();

        $stats = [
            'route_name' => $route?->name ?? 'No route assigned',
            'vehicle' => $route?->vehicle ? "{$route->vehicle->make} {$route->vehicle->model} ({$route->vehicle->license_plate})" : 'No vehicle assigned',
            'total_students' => $route ? Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'active'])
                ->distinct()
                ->count('student_id') : 0,
            'pickup_points' => $route?->pickupPoints->count() ?? 0,
        ];

        // Get today's bookings count
        $todayBookings = 0;
        if ($route) {
            $today = now()->format('Y-m-d');
            $todayBookings = Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->count();
        }
        
        $stats['today_bookings'] = $todayBookings;

        // Today's schedule timeline
        $todaySchedule = [];
        if ($route) {
            $today = Carbon::today();
            $todayBookingsList = Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->with(['student', 'pickupPoint'])
                ->get();

            // Group by pickup point and time
            $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();
            foreach ($pickupPoints as $pickupPoint) {
                $pointBookings = $todayBookingsList->where('pickup_point_id', $pickupPoint->id);
                if ($pointBookings->count() > 0) {
                    $todaySchedule[] = [
                        'time' => $pickupPoint->pickup_time,
                        'title' => $pickupPoint->name,
                        'description' => "Pickup {$pointBookings->count()} student(s)",
                        'students' => $pointBookings->map(function ($booking) {
                            return $booking->student->name;
                        })->toArray(),
                        'status' => 'upcoming',
                    ];
                }
            }
        }

        // Next 3 pickup points
        $nextPickupPoints = [];
        if ($route) {
            $nextPoints = $route->pickupPoints()
                ->orderBy('sequence_order')
                ->limit(3)
                ->get();
            
            foreach ($nextPoints as $point) {
                $nextPickupPoints[] = [
                    'id' => $point->id,
                    'name' => $point->name,
                    'address' => $point->address,
                    'pickup_time' => $point->pickup_time,
                    'dropoff_time' => $point->dropoff_time,
                    'sequence_order' => $point->sequence_order,
                ];
            }
        }

        // Route performance metrics
        $performanceMetrics = [
            'on_time_percentage' => 95, // Would need tracking data
            'total_trips' => $route ? Booking::where('route_id', $route->id)->count() : 0,
            'average_students_per_trip' => $route ? round(Booking::where('route_id', $route->id)->avg('id') ?? 0, 1) : 0,
        ];

        // Detailed student list with pickup points and times
        $studentsList = [];
        if ($route) {
            $today = Carbon::today();
            $activeBookings = Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $today);
                })
                ->with(['student', 'pickupPoint'])
                ->get();

            // Group by pickup point and sort by sequence order
            $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();
            
            foreach ($pickupPoints as $pickupPoint) {
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
                            'booking_id' => $booking->id,
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
        }

        return Inertia::render('Driver/Dashboard', [
            'route' => $route ? [
                'id' => $route->id,
                'name' => $route->name,
                'vehicle' => $route->vehicle ? [
                    'make' => $route->vehicle->make,
                    'model' => $route->vehicle->model,
                    'license_plate' => $route->vehicle->license_plate,
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
        
        // Get driver's assigned route
        $route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->first();

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
        
        // Get driver's assigned route
        $route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle'])
            ->first();

        if (!$route) {
            return Inertia::render('Driver/RoutePerformance', [
                'route' => null,
                'performanceMetrics' => [],
                'weeklyStats' => [],
                'monthlyStats' => [],
            ]);
        }

        $today = Carbon::today();
        $thisWeekStart = $today->copy()->startOfWeek();
        $thisMonthStart = $today->copy()->startOfMonth();

        // Overall performance metrics
        $totalBookings = Booking::where('route_id', $route->id)->count();
        $activeBookings = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->count();
        $completedBookings = Booking::where('route_id', $route->id)
            ->where('status', 'completed')
            ->count();

        // Weekly stats
        $weeklyBookings = Booking::where('route_id', $route->id)
            ->where('created_at', '>=', $thisWeekStart)
            ->count();
        $weeklyActive = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->where('start_date', '>=', $thisWeekStart)
            ->count();

        // Monthly stats
        $monthlyBookings = Booking::where('route_id', $route->id)
            ->where('created_at', '>=', $thisMonthStart)
            ->count();
        $monthlyActive = Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'active'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->where('start_date', '>=', $thisMonthStart)
            ->count();

        // Calculate average students per trip
        $totalStudents = Booking::where('route_id', $route->id)
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
        
        // Get driver's assigned route
        $route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints', 'driver'])
            ->first();

        if (!$route) {
            return Inertia::render('Driver/RouteInformation', [
                'route' => null,
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
}

