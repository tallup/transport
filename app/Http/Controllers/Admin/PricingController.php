<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function manage()
    {
        $pricingRules = PricingRule::with('route')
            ->orderBy('plan_type')
            ->orderBy('route_id')
            ->orderBy('vehicle_type')
            ->get()
            ->groupBy('plan_type')
            ->map(function ($rules) {
                return $rules->map(function ($rule) {
                    return [
                        'id' => $rule->id,
                        'plan_type' => $rule->plan_type,
                        'route_id' => $rule->route_id,
                        'route_name' => $rule->route?->name ?? 'Global',
                        'vehicle_type' => $rule->vehicle_type,
                        'amount' => $rule->amount,
                        'currency' => $rule->currency,
                        'active' => $rule->active,
                    ];
                });
            })
            ->toArray();

        $planTypes = [
            'weekly' => 'Weekly',
            'bi_weekly' => 'Bi-Weekly',
            'monthly' => 'Monthly',
            'semester' => 'Semester',
            'annual' => 'Annual',
        ];

        return Inertia::render('Admin/Pricing/Manage', [
            'pricingRules' => $pricingRules,
            'planTypes' => $planTypes,
        ]);
    }

    public function toggleActive(Request $request, PricingRule $pricingRule)
    {
        $pricingRule->update(['active' => !$pricingRule->active]);

        return back()->with('success', 'Pricing rule updated successfully.');
    }
}

