<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PickupPoint;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PickupPointController extends Controller
{
    public function index()
    {
        $pickupPoints = PickupPoint::with('route')
            ->orderBy('route_id')
            ->orderBy('sequence_order')
            ->paginate(15);

        return Inertia::render('Admin/PickupPoints/Index', [
            'pickupPoints' => $pickupPoints,
        ]);
    }

    public function create()
    {
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/PickupPoints/Create', [
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'sequence_order' => 'required|integer|min:0',
            'pickup_time' => 'required|date_format:H:i',
            'dropoff_time' => 'required|date_format:H:i',
        ]);

        PickupPoint::create($validated);

        return redirect()->route('admin.pickup-points.index')
            ->with('success', 'Pickup point created successfully.');
    }

    public function edit(PickupPoint $pickupPoint)
    {
        $pickupPoint->load('route');
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/PickupPoints/Edit', [
            'pickupPoint' => $pickupPoint,
            'routes' => $routes,
        ]);
    }

    public function update(Request $request, PickupPoint $pickupPoint)
    {
        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'sequence_order' => 'required|integer|min:0',
            'pickup_time' => 'required|date_format:H:i',
            'dropoff_time' => 'required|date_format:H:i',
        ]);

        $pickupPoint->update($validated);

        return redirect()->route('admin.pickup-points.index')
            ->with('success', 'Pickup point updated successfully.');
    }

    public function destroy(PickupPoint $pickupPoint)
    {
        $pickupPoint->delete();

        return redirect()->route('admin.pickup-points.index')
            ->with('success', 'Pickup point deleted successfully.');
    }
}
