<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\School;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    /**
     * Validate route assignment to ensure driver doesn't exceed limits.
     * 
     * @param array $validated
     * @param \App\Models\Route|null $existingRoute
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateRouteAssignment(array $validated, ?Route $existingRoute = null)
    {
        // Skip validation if no driver assigned
        if (empty($validated['driver_id'])) {
            return;
        }

        // Determine route period based on pickup_time
        // If pickup_time is not set, we can't determine period - skip validation
        if (empty($validated['pickup_time'])) {
            return;
        }

        $pickupTime = $validated['pickup_time'];
        // Extract hour from time (HH:mm format)
        $parts = explode(':', $pickupTime);
        $hour = (int) ($parts[0] ?? 0);
        $routePeriod = $hour < 12 ? 'am' : 'pm';

        // Get driver's existing active routes (excluding the current route being updated)
        $existingRoutes = Route::where('driver_id', $validated['driver_id'])
            ->where('active', true)
            ->when($existingRoute, function ($query) use ($existingRoute) {
                $query->where('id', '!=', $existingRoute->id);
            })
            ->get();

        // Check if driver already has a route of the same period
        foreach ($existingRoutes as $route) {
            if ($route->servicePeriod() === $routePeriod) {
                $periodLabel = strtoupper($routePeriod);
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'driver_id' => "This driver already has an active {$periodLabel} route assigned. A driver can have at most one AM route and one PM route.",
                ]);
            }
        }

        // Check total route limit (max 2 routes: 1 AM + 1 PM)
        if ($existingRoutes->count() >= 2) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'driver_id' => 'This driver already has the maximum number of routes assigned (2 routes: 1 AM + 1 PM).',
            ]);
        }
    }

    public function index()
    {
        $routes = Route::with(['driver', 'vehicle', 'schools'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

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
            if ($driver) {
                // Notify the driver about the new route assignment
                $driver->notifyNow(new \App\Notifications\DriverAssigned(null, $driver, $route));
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
            ->whereIn('status', ['active', 'pending', 'awaiting_approval'])
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

        // Get completion statistics (last 30 days)
        $completionStats = \App\Models\RouteCompletion::where('route_id', $route->id)
            ->where('completion_date', '>=', now()->subDays(30))
            ->selectRaw('
                COUNT(*) as total_completions,
                AVG(TIME_TO_SEC(TIMEDIFF(completed_at, completion_date))) as avg_completion_time
            ')
            ->first();

        // Get upcoming bookings (starting soon)
        $upcomingBookings = \App\Models\Booking::where('route_id', $route->id)
            ->whereIn('status', ['pending', 'awaiting_approval'])
            ->whereDate('start_date', '>', now())
            ->whereDate('start_date', '<=', now()->addDays(7))
            ->with(['student.parent'])
            ->get();

        // Get expired bookings (for reference)
        $recentExpired = \App\Models\Booking::where('route_id', $route->id)
            ->where('status', 'expired')
            ->whereDate('end_date', '>=', now()->subDays(7))
            ->with(['student'])
            ->get();

        $statistics = [
            'total_bookings' => $totalBookings,
            'capacity_utilization' => $capacityUtilization,
            'available_seats' => max(0, $route->capacity - $totalBookings),
            'total_completions' => $completionStats->total_completions ?? 0,
            'avg_completion_time_minutes' => $completionStats->avg_completion_time 
                ? round($completionStats->avg_completion_time / 60, 1) 
                : null,
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
        $route->load(['driver', 'vehicle', 'schools']);
        
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

        // Check if driver is being assigned or changed
        $oldDriverId = $route->driver_id;
        $newDriverId = $validated['driver_id'] ?? null;
        $driverChanged = $oldDriverId != $newDriverId && $newDriverId !== null;

        $route->update($validated);
        
        if (isset($schools)) {
            $route->schools()->sync($schools);
        }

        // Send driver assignment notification if driver was assigned or changed
        if ($driverChanged) {
            $driver = User::find($newDriverId);
            if ($driver) {
                // Notify the driver
                $driver->notifyNow(new \App\Notifications\DriverAssigned(null, $driver, $route));
                
                // Notify all parents with active bookings on this route
                $activeBookings = \App\Models\Booking::where('route_id', $route->id)
                    ->where('status', 'active')
                    ->whereDate('start_date', '<=', now())
                    ->where(function ($query) {
                        $query->whereNull('end_date')
                            ->orWhereDate('end_date', '>=', now());
                    })
                    ->with(['student.parent'])
                    ->get();

                foreach ($activeBookings as $booking) {
                    if ($booking->student && $booking->student->parent) {
                        $booking->student->parent->notifyNow(new \App\Notifications\DriverAssigned(
                            $booking,
                            $driver,
                            $route
                        ));
                    }
                }
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
