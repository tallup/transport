<?php

namespace App\Services;

use App\Models\PricingRule;
use App\Models\Route;

class PricingService
{
    /**
     * Calculate price for a booking based on plan type, route, and vehicle type.
     * Priority: route-specific > vehicle-type-specific > global pricing
     *
     * @param string $planType
     * @param Route $route
     * @return float
     * @throws \Exception
     */
    public function calculatePrice(string $planType, Route $route): float
    {
        $vehicleType = $route->vehicle->type;

        // Priority 1: Route-specific pricing
        $routePricing = PricingRule::where('plan_type', $planType)
            ->where('route_id', $route->id)
            ->where('active', true)
            ->first();

        if ($routePricing) {
            return (float) $routePricing->amount;
        }

        // Priority 2: Vehicle-type-specific pricing
        $vehiclePricing = PricingRule::where('plan_type', $planType)
            ->whereNull('route_id')
            ->where('vehicle_type', $vehicleType)
            ->where('active', true)
            ->first();

        if ($vehiclePricing) {
            return (float) $vehiclePricing->amount;
        }

        // Priority 3: Global pricing
        $globalPricing = PricingRule::where('plan_type', $planType)
            ->whereNull('route_id')
            ->whereNull('vehicle_type')
            ->where('active', true)
            ->first();

        if ($globalPricing) {
            return (float) $globalPricing->amount;
        }

        throw new \Exception("No pricing rule found for plan type: {$planType}");
    }

    /**
     * Format price with currency.
     *
     * @param float $amount
     * @param string $currency
     * @return string
     */
    public function formatPrice(float $amount, string $currency = 'USD'): string
    {
        return $currency . ' ' . number_format($amount, 2);
    }
}

