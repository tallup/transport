<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
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
        ]);
    }
}

