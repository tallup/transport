<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingRule;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingRuleController extends Controller
{
    public function index()
    {
        $pricingRules = PricingRule::with('route')
            ->orderBy('plan_type')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/PricingRules/Index', [
            'pricingRules' => $pricingRules,
        ]);
    }

    public function create()
    {
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/PricingRules/Create', [
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
            'route_id' => 'nullable|exists:routes,id',
            'vehicle_type' => 'nullable|in:bus,van',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'active' => 'nullable|boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        PricingRule::create($validated);

        return redirect()->route('admin.pricing-rules.index')
            ->with('success', 'Pricing rule created successfully.');
    }

    public function edit(PricingRule $pricingRule)
    {
        $pricingRule->load('route');
        $routes = Route::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/PricingRules/Edit', [
            'pricingRule' => $pricingRule,
            'routes' => $routes,
        ]);
    }

    public function update(Request $request, PricingRule $pricingRule)
    {
        $validated = $request->validate([
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
            'route_id' => 'nullable|exists:routes,id',
            'vehicle_type' => 'nullable|in:bus,van',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'active' => 'nullable|boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $pricingRule->update($validated);

        return redirect()->route('admin.pricing-rules.index')
            ->with('success', 'Pricing rule updated successfully.');
    }

    public function destroy(PricingRule $pricingRule)
    {
        $pricingRule->delete();

        return redirect()->route('admin.pricing-rules.index')
            ->with('success', 'Pricing rule deleted successfully.');
    }
}
