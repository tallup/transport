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
        $carbonDate = Carbon::parse($date);

        // Get driver's route
        $route = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->with(['vehicle', 'pickupPoints'])
            ->first();

        if (!$route) {
            return Inertia::render('Driver/Roster', [
                'route' => null,
                'date' => $date,
                'isSchoolDay' => false,
                'groupedBookings' => [],
                'message' => 'No route assigned to you.',
            ]);
        }

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $carbonDate->format('Y-m-d'))
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        $groupedBookings = [];

        if ($isSchoolDay) {
            // Get active bookings for the date
            $bookings = Booking::where('route_id', $route->id)
                ->whereIn('status', ['pending', 'active'])
                ->where('start_date', '<=', $carbonDate)
                ->where(function ($query) use ($carbonDate) {
                    $query->whereNull('end_date')
                        ->orWhere('end_date', '>=', $carbonDate);
                })
                ->with(['student', 'pickupPoint'])
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
                                'student' => [
                                    'id' => $booking->student->id,
                                    'name' => $booking->student->name,
                                    'school' => $booking->student->school,
                                    'emergency_phone' => $booking->student->emergency_phone,
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
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'vehicle' => $route->vehicle ? [
                    'make' => $route->vehicle->make,
                    'model' => $route->vehicle->model,
                    'license_plate' => $route->vehicle->license_plate,
                ] : null,
            ],
            'date' => $date,
            'isSchoolDay' => $isSchoolDay,
            'groupedBookings' => $groupedBookings,
        ]);
    }
}




