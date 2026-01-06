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
}

