<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Vehicles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:bus,van',
            'license_plate' => 'required|string|max:255|unique:vehicles,license_plate',
            'registration_number' => 'required|string|max:255|unique:vehicles,registration_number',
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'capacity' => 'required|integer|min:1',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'status' => 'required|in:active,maintenance,retired',
        ]);

        Vehicle::create($validated);

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle created successfully.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('Admin/Vehicles/Edit', [
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'type' => 'required|in:bus,van',
            'license_plate' => 'required|string|max:255|unique:vehicles,license_plate,' . $vehicle->id,
            'registration_number' => 'required|string|max:255|unique:vehicles,registration_number,' . $vehicle->id,
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'capacity' => 'required|integer|min:1',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'status' => 'required|in:active,maintenance,retired',
        ]);

        $vehicle->update($validated);

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return redirect()->route('admin.vehicles.index')
            ->with('success', 'Vehicle deleted successfully.');
    }
}
