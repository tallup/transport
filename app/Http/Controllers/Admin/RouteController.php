<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
use App\Models\School;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    /**
     * Validate route assignment.
     * 
     * The same driver is allowed on both AM and PM routes (no period/count restrictions).
     */
    private function validateRouteAssignment(array $validated, ?Route $existingRoute = null)
    {
        // No restrictions – a driver can be assigned to multiple routes.
    }

    public function index()
    {
        $today = now()->toDateString();
        $routes = Route::with(['driver', 'vehicle', 'schools'])
            ->withCount(['bookings as active_bookings_count' => function ($query) use ($today) {
                $query->whereIn('status', Booking::activeStatuses())
                    ->whereDate('start_date', '<=', $today)
                    ->where(function ($q) use ($today) {
                        $q->whereNull('end_date')
                            ->orWhereDate('end_date', '>=', $today);
                    });
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Add calculated occupancy for frontend
        $routes->getCollection()->transform(function ($route) {
            $route->occupancy_percentage = $route->capacity > 0 
                ? round(($route->active_bookings_count / $route->capacity) * 100, 1) 
                : 0;
            return $route;
        });

        return Inertia::render('Admin/Routes/Index', [
            'routes' => $routes,
        ]);
    }

    public function create()
    {
        $drivers = User::where('role', 'driver')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        
        $vehicles = Vehicle::where('status', 'active')
            ->orderBy('license_plate')
            ->get(['id', 'license_plate', 'type', 'capacity']);

        $schools = School::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Routes/Create', [
            'drivers' => $drivers,
            'vehicles' => $vehicles,
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_id' => 'nullable|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'capacity' => 'required|integer|min:1',
            'service_type' => 'required|in:am,pm,both',
            'pickup_time' => 'nullable|date_format:H:i',
            'dropoff_time' => 'nullable|date_format:H:i',
            'active' => 'nullable|boolean',
            'schools' => 'nullable|array',
            'schools.*' => 'exists:schools,id',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $schools = $validated['schools'] ?? [];
        unset($validated['schools']);

        // Handle empty driver_id - convert empty string to null
        if (isset($validated['driver_id']) && $validated['driver_id'] === '') {
            $validated['driver_id'] = null;
        }

        // Validate route assignment limits
        $this->validateRouteAssignment($validated);

        $route = Route::create($validated);
        
        if (!empty($schools)) {
            $route->schools()->sync($schools);
        }

        // Send driver assignment notification if driver was assigned during creation
        if (!empty($validated['driver_id'])) {
            $driver = User::find($validated['driver_id']);
            if ($driver && filter_var($driver->email, FILTER_VALIDATE_EMAIL)) {
                $driver->notify(new \App\Notifications\DriverAssigned(null, $driver, $route));
            }
        }

        return redirect()->route('admin.routes.index')
            ->with('success', 'Route created successfully.');
    }

    public function show(Route $route)
    {
        // Load all relationships
        $route->load([
            'driver', 
            'vehicle', 
            'schools',
            'pickupPoints' => function ($query) {
                $query->orderBy('sequence_order');
            },
            'completions' => function ($query) {
                $query->with('driver')->latest()->take(10);
            }
        ]);

        // Get active bookings with student details
        $activeBookings = \App\Models\Booking::where('route_id', $route->id)
            ->whereIn('status', \App\Models\Booking::activeStatuses())
            ->whereDate('start_date', '<=', now())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now());
            })
            ->with(['student.parent', 'pickupPoint'])
            ->get();

        // Calculate statistics
        $totalBookings = $activeBookings->count();
        $capacityUtilization = $route->capacity > 0 
            ? round(($totalBookings / $route->capacity) * 100, 1) 
            : 0;

        // Get completion statistics (last 30 days) - calculated in PHP for portability
        $completions = \App\Models\RouteCompletion::where('route_id', $route->id)
            ->where('completion_date', '>=', now()->subDays(30))
            ->get(['completed_at', 'completion_date']);

        $totalCompletions = $completions->count();
        $avgCompletionTimeMinutes = null;

        if ($totalCompletions > 0) {
            $totalSeconds = 0;
            foreach ($completions as $completion) {
                // completed_at is a timestamp, completion_date is a date
                $completedAt = \Carbon\Carbon::parse($completion->completed_at);
                $completionDate = \Carbon\Carbon::parse($completion->completion_date);
                $totalSeconds += $completedAt->diffInSeconds($completionDate->startOfDay());
            }
            $avgCompletionTimeMinutes = round(($totalSeconds / $totalCompletions) / 60, 1);
        }

        // Get upcoming bookings (starting soon)
        $upcomingBookings = \App\Models\Booking::where('route_id', $route->id)
            ->whereIn('status', [\App\Models\Booking::STATUS_PENDING, \App\Models\Booking::STATUS_AWAITING_APPROVAL])
            ->whereDate('start_date', '>', now())
            ->whereDate('start_date', '<=', now()->addDays(7))
            ->with(['student.parent'])
            ->get();

        // Get expired bookings (for reference)
        $recentExpired = \App\Models\Booking::where('route_id', $route->id)
            ->where('status', \App\Models\Booking::STATUS_EXPIRED)
            ->whereDate('end_date', '>=', now()->subDays(7))
            ->with(['student'])
            ->get();

        $statistics = [
            'total_bookings' => $totalBookings,
            'capacity_utilization' => $capacityUtilization,
            'available_seats' => max(0, $route->capacity - $totalBookings),
            'total_completions' => $totalCompletions,
            'avg_completion_time_minutes' => $avgCompletionTimeMinutes,
            'upcoming_bookings_count' => $upcomingBookings->count(),
            'recent_expired_count' => $recentExpired->count(),
        ];

        return Inertia::render('Admin/Routes/Show', [
            'route' => $route,
            'activeBookings' => $activeBookings,
            'upcomingBookings' => $upcomingBookings,
            'recentExpired' => $recentExpired,
            'statistics' => $statistics,
        ]);
    }

    public function edit(Route $route)
    {
        $today = now()->toDateString();
        $route->load(['driver', 'vehicle', 'schools'])
            ->loadCount(['bookings as active_bookings_count' => function ($query) use ($today) {
                $query->whereIn('status', Booking::activeStatuses())
                    ->whereDate('start_date', '<=', $today)
                    ->where(function ($q) use ($today) {
                        $q->whereNull('end_date')
                            ->orWhereDate('end_date', '>=', $today);
                    });
            }]);

        $route->occupancy_percentage = $route->capacity > 0 
            ? round(($route->active_bookings_count / $route->capacity) * 100, 1) 
            : 0;
        
        $drivers = User::where('role', 'driver')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        
        $vehicles = Vehicle::where('status', 'active')
            ->orderBy('license_plate')
            ->get(['id', 'license_plate', 'type', 'capacity']);

        $schools = School::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Routes/Edit', [
            'route' => $route,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Route $route)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_id' => 'nullable|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'capacity' => 'required|integer|min:1',
            'service_type' => 'required|in:am,pm,both',
            'pickup_time' => 'nullable|date_format:H:i',
            'dropoff_time' => 'nullable|date_format:H:i',
            'active' => 'nullable|boolean',
            'schools' => 'nullable|array',
            'schools.*' => 'exists:schools,id',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $schools = $validated['schools'] ?? [];
        unset($validated['schools']);

        // Handle empty driver_id - convert empty string to null
        if (isset($validated['driver_id']) && $validated['driver_id'] === '') {
            $validated['driver_id'] = null;
        }

        // Validate route assignment limits (pass existing route to exclude from check)
        $this->validateRouteAssignment($validated, $route);

        // Check if driver or vehicle is being assigned or changed
        $oldDriverId = $route->driver_id;
        $oldVehicleId = $route->vehicle_id;
        $newDriverId = $validated['driver_id'] ?? null;
        $newVehicleId = $validated['vehicle_id'] ?? null;
        $driverChanged = $oldDriverId != $newDriverId && $newDriverId !== null;
        $vehicleChanged = $oldVehicleId != $newVehicleId;

        $route->update($validated);
        
        if (isset($schools)) {
            $route->schools()->sync($schools);
        }

        // Send driver assignment notification if driver was assigned or changed
        if ($driverChanged) {
            $driver = User::find($newDriverId);
            if ($driver && filter_var($driver->email, FILTER_VALIDATE_EMAIL)) {
                $driver->notify(new \App\Notifications\DriverAssigned(null, $driver, $route));
                
                // Notify all parents with active bookings on this route
                $activeBookings = \App\Models\Booking::where('route_id', $route->id)
                    ->where('status', \App\Models\Booking::STATUS_ACTIVE)
                    ->whereDate('start_date', '<=', now())
                    ->where(function ($query) {
                        $query->whereNull('end_date')
                            ->orWhereDate('end_date', '>=', now());
                    })
                    ->with(['student.parent'])
                    ->get();

                foreach ($activeBookings as $booking) {
                    if ($booking->student && $booking->student->parent) {
                        $booking->student->parent->notify(new \App\Notifications\DriverAssigned(
                            $booking,
                            $driver,
                            $route
                        ));
                    }
                }
            }
        }

        // Notify driver when vehicle is assigned or changed on their route
        if ($vehicleChanged && $route->driver_id) {
            $driver = $route->driver;
            if ($driver && filter_var($driver->email, FILTER_VALIDATE_EMAIL)) {
                $driver->notify(new \App\Notifications\DriverVehicleAssigned($route));
            }
        }

        return redirect()->route('admin.routes.index')
            ->with('success', 'Route updated successfully.');
    }

    public function destroy(Route $route)
    {
        $route->delete();

        return redirect()->route('admin.routes.index')
            ->with('success', 'Route deleted successfully.');
    }
}
