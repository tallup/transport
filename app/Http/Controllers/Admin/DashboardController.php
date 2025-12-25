<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\Route;
use App\Models\Student;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Basic stats
            $stats = [
                'total_students' => Student::count(),
                'total_vehicles' => Vehicle::count(),
                'total_routes' => Route::where('active', true)->count(),
                'active_bookings' => Booking::where('status', 'active')->count(),
                'pending_bookings' => Booking::where('status', 'pending')->count(),
                'total_drivers' => User::where('role', 'driver')->count(),
                'total_parents' => User::where('role', 'parent')->count(),
                'total_revenue' => 0, // Price calculation would need to be done via pricing rules
            ];

            // Revenue trends (last 30 days)
            $revenueTrends = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $revenueTrends[] = [
                    'date' => $date->format('Y-m-d'),
                    'label' => $date->format('M d'),
                    'revenue' => 0, // Would need pricing calculation
                ];
            }

            // Booking status distribution
            $bookingStatusDistribution = [
                [
                    'name' => 'Active',
                    'value' => Booking::where('status', 'active')->count(),
                    'color' => '#10b981',
                ],
                [
                    'name' => 'Pending',
                    'value' => Booking::where('status', 'pending')->count(),
                    'color' => '#f59e0b',
                ],
                [
                    'name' => 'Cancelled',
                    'value' => Booking::where('status', 'cancelled')->count(),
                    'color' => '#ef4444',
                ],
            ];

            // Upcoming calendar events (next 7 days)
            $upcomingEvents = CalendarEvent::where('date', '>=', Carbon::today())
                ->where('date', '<=', Carbon::today()->addDays(7))
                ->orderBy('date')
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => $event->id,
                        'date' => $event->date->format('Y-m-d'),
                        'date_label' => $event->date->format('M d, Y'),
                        'type' => $event->type,
                        'description' => $event->description,
                    ];
                });

            // Active routes with details
            $activeRoutes = Route::where('active', true)
                ->with(['vehicle', 'driver', 'pickupPoints'])
                ->withCount('bookings')
                ->orderBy('name')
                ->get()
                ->map(function ($route) {
                    return [
                        'id' => $route->id,
                        'name' => $route->name,
                        'vehicle' => $route->vehicle ? "{$route->vehicle->make} {$route->vehicle->model}" : 'No vehicle',
                        'driver' => $route->driver ? $route->driver->name : 'No driver',
                        'capacity' => $route->capacity,
                        'bookings_count' => $route->bookings_count,
                        'pickup_points_count' => $route->pickupPoints->count(),
                    ];
                });

            // Recent bookings
            $recent_bookings = Booking::with(['student', 'route', 'pickupPoint'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            // Recent activity (simplified - could be enhanced with activity log)
            $recentActivity = [
                [
                    'type' => 'booking',
                    'message' => 'New booking created',
                    'time' => Carbon::now()->subMinutes(5)->diffForHumans(),
                ],
                [
                    'type' => 'student',
                    'message' => 'New student registered',
                    'time' => Carbon::now()->subHours(2)->diffForHumans(),
                ],
            ];

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentBookings' => $recent_bookings,
                'revenueTrends' => $revenueTrends,
                'bookingStatusDistribution' => $bookingStatusDistribution,
                'upcomingEvents' => $upcomingEvents,
                'activeRoutes' => $activeRoutes,
                'recentActivity' => $recentActivity,
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
                    'total_drivers' => 0,
                    'total_parents' => 0,
                    'total_revenue' => 0,
                ],
                'recentBookings' => [],
                'revenueTrends' => [],
                'bookingStatusDistribution' => [],
                'upcomingEvents' => [],
                'activeRoutes' => [],
                'recentActivity' => [],
            ]);
        }
    }
}
