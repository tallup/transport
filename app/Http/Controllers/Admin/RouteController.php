<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::with(['driver', 'vehicle'])
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

        return Inertia::render('Admin/Routes/Create', [
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_id' => 'nullable|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'capacity' => 'required|integer|min:1',
            'active' => 'boolean',
        ]);

        Route::create($validated);

        return redirect()->route('admin.routes.index')
            ->with('success', 'Route created successfully.');
    }

    public function edit(Route $route)
    {
        $route->load(['driver', 'vehicle']);
        
        $drivers = User::where('role', 'driver')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        
        $vehicles = Vehicle::where('status', 'active')
            ->orderBy('license_plate')
            ->get(['id', 'license_plate', 'type', 'capacity']);

        return Inertia::render('Admin/Routes/Edit', [
            'route' => $route,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function update(Request $request, Route $route)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_id' => 'nullable|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'capacity' => 'required|integer|min:1',
            'active' => 'boolean',
        ]);

        $route->update($validated);

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
