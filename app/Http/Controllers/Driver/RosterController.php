<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\Route;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RosterController extends Controller
{
    public function index(Request $request)
    {
        $driver = $request->user();
        $date = $request->input('date', Carbon::today()->format('Y-m-d'));
        $routeId = $request->input('route_id');
        $carbonDate = Carbon::parse($date);

        // Get driver's routes (multiple routes support)
        $routes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->get();

        if ($routes->isEmpty()) {
            return Inertia::render('Driver/Roster', [
                'routes' => [],
                'selectedRoute' => null,
                'date' => $date,
                'isSchoolDay' => false,
                'groupedBookings' => [],
                'message' => 'No routes assigned to you.',
            ]);
        }

        // If route_id is provided, use it; otherwise use the first route
        $selectedRoute = $routeId 
            ? $routes->firstWhere('id', $routeId) 
            : $routes->first();

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $carbonDate->format('Y-m-d'))
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        $groupedBookings = [];

        if ($isSchoolDay && $selectedRoute) {
            // Get active bookings for the date
            $bookings = Booking::where('route_id', $selectedRoute->id)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $carbonDate)
                ->where(function ($query) use ($carbonDate) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $carbonDate);
                })
                ->with(['student.school', 'pickupPoint'])
                ->get();

            // Group by pickup point
            $groupedBookings = $bookings
                ->groupBy('pickup_point_id')
                ->map(function ($bookings) {
                    $pickupPoint = $bookings->first()->pickupPoint;
                    return [
                        'pickup_point' => [
                            'id' => $pickupPoint->id,
                            'name' => $pickupPoint->name,
                            'address' => $pickupPoint->address,
                            'pickup_time' => $pickupPoint->pickup_time,
                            'dropoff_time' => $pickupPoint->dropoff_time,
                            'sequence_order' => $pickupPoint->sequence_order,
                        ],
                        'bookings' => $bookings->sortBy('student.name')->map(function ($booking) {
                            return [
                                'id' => $booking->id,
                                'status' => $booking->status,
                                'student' => [
                                    'id' => $booking->student->id,
                                    'name' => $booking->student->name,
                                    'school' => $booking->student->school->name ?? 'N/A',
                                    'emergency_phone' => $booking->student->emergency_phone,
                                    'grade' => $booking->student->grade,
                                ],
                            ];
                        })->values(),
                    ];
                })
                ->sortBy('pickup_point.sequence_order')
                ->values()
                ->toArray();
        }

        return Inertia::render('Driver/Roster', [
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
            'selectedRoute' => $selectedRoute ? [
                'id' => $selectedRoute->id,
                'name' => $selectedRoute->name,
                'vehicle' => $selectedRoute->vehicle ? [
                    'make' => $selectedRoute->vehicle->make,
                    'model' => $selectedRoute->vehicle->model,
                    'license_plate' => $selectedRoute->vehicle->license_plate,
                ] : null,
            ] : null,
            'date' => $date,
            'isSchoolDay' => $isSchoolDay,
            'groupedBookings' => $groupedBookings,
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





