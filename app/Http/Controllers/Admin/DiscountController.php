<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function index()
    {
        $discounts = Discount::with('route')
            ->orderBy('id', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Discounts/Index', [
            'discounts' => $discounts,
        ]);
    }

    public function create()
    {
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Discounts/Create', [
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'scope' => 'required|in:all,route,plan_type,multi_child',
            'route_id' => 'nullable|required_if:scope,route|exists:routes,id',
            'plan_type' => 'nullable|required_if:scope,plan_type|in:weekly,monthly,academic_term,annual',
            'min_children' => 'nullable|integer|min:2|max:255',
            'active' => 'nullable|boolean',
        ]);

        if ($validated['type'] === 'percentage') {
            $request->validate(['value' => 'numeric|min:0|max:100']);
        }
        if (($validated['scope'] ?? '') === 'multi_child') {
            $request->validate(['min_children' => 'required|integer|min:2|max:255']);
        }

        $validated['active'] = $request->boolean('active', true);
        if ($validated['scope'] !== 'route') {
            $validated['route_id'] = null;
        }
        if ($validated['scope'] !== 'plan_type') {
            $validated['plan_type'] = null;
        }
        if ($validated['scope'] !== 'multi_child') {
            $validated['min_children'] = null;
        } else {
            $validated['min_children'] = (int) ($validated['min_children'] ?? 2);
        }

        Discount::create($validated);

        return redirect()->route('admin.discounts.index')
            ->with('success', 'Discount created successfully.');
    }

    public function edit(Discount $discount)
    {
        $discount->load('route');
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Discounts/Edit', [
            'discount' => $discount,
            'routes' => $routes,
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'scope' => 'required|in:all,route,plan_type,multi_child',
            'route_id' => 'nullable|required_if:scope,route|exists:routes,id',
            'plan_type' => 'nullable|required_if:scope,plan_type|in:weekly,monthly,academic_term,annual',
            'min_children' => 'nullable|integer|min:2|max:255',
            'active' => 'nullable|boolean',
        ]);

        if ($validated['type'] === 'percentage') {
            $request->validate(['value' => 'numeric|min:0|max:100']);
        }
        if (($validated['scope'] ?? '') === 'multi_child') {
            $request->validate(['min_children' => 'required|integer|min:2|max:255']);
        }

        $validated['active'] = $request->boolean('active', true);
        if ($validated['scope'] !== 'route') {
            $validated['route_id'] = null;
        }
        if ($validated['scope'] !== 'plan_type') {
            $validated['plan_type'] = null;
        }
        if ($validated['scope'] !== 'multi_child') {
            $validated['min_children'] = null;
        } else {
            $validated['min_children'] = (int) ($validated['min_children'] ?? 2);
        }

        $discount->update($validated);

        return redirect()->route('admin.discounts.index')
            ->with('success', 'Discount updated successfully.');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();

        return redirect()->route('admin.discounts.index')
            ->with('success', 'Discount deleted successfully.');
    }
}
