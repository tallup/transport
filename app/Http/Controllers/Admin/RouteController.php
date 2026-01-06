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

        $route = Route::create($validated);
        
        if (!empty($schools)) {
            $route->schools()->sync($schools);
        }

        return redirect()->route('admin.routes.index')
            ->with('success', 'Route created successfully.');
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

        $route->update($validated);
        
        if (isset($schools)) {
            $route->schools()->sync($schools);
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
