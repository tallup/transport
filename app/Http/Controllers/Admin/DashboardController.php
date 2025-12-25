<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
use App\Models\Student;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $stats = [
                'total_students' => Student::count(),
                'total_vehicles' => Vehicle::count(),
                'total_routes' => Route::where('active', true)->count(),
                'active_bookings' => Booking::where('status', 'active')->count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
                'total_revenue' => 0, // Price calculation would need to be done via pricing rules
            ];

            $recent_bookings = Booking::with(['student', 'route', 'pickupPoint'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentBookings' => $recent_bookings,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Dashboard Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Return dashboard with empty data if there's an error
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_students' => 0,
                    'total_vehicles' => 0,
                    'total_routes' => 0,
                    'active_bookings' => 0,
                    'pending_bookings' => 0,
                    'total_revenue' => 0,
                ],
                'recentBookings' => [],
            ]);
        }
    }
}
