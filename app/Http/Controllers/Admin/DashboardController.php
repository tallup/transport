<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
use App\Models\Student;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_students' => Student::count(),
            'total_vehicles' => Vehicle::count(),
            'total_routes' => Route::where('active', true)->count(),
            'active_bookings' => Booking::where('status', 'active')->count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'total_revenue' => Booking::where('status', 'active')->sum('price') ?? 0,
        ];

        $recent_bookings = Booking::with(['student', 'route', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recent_bookings,
        ]);
    }
}
