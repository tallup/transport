<?php

namespace App\Services;

use App\Exceptions\PricingNotFoundException;
use App\Models\PricingRule;
use App\Models\Route;
use Illuminate\Support\Facades\Cache;

class PricingService
{
    /**
     * Calculate price for a booking based on plan type, trip type, route, and vehicle type.
     * Priority: route-specific > vehicle-type-specific > global pricing
     *
     * @param string $planType
     * @param string $tripType 'one_way' or 'two_way'
     * @param Route $route
     * @return float
     * @throws \Exception
     */
    public function calculatePrice(string $planType, string $tripType, Route $route): float
    {
        $vehicleType = $route->vehicle->type;

        // Cache key for route-specific pricing
        $routeCacheKey = "pricing_route_{$route->id}_{$planType}_{$tripType}";
        $routePricing = Cache::remember($routeCacheKey, 3600, function () use ($planType, $tripType, $route) {
            return PricingRule::where('plan_type', $planType)
                ->where('trip_type', $tripType)
                ->where('route_id', $route->id)
                ->where('active', true)
                ->first();
        });

        if ($routePricing) {
            return (float) $routePricing->amount;
        }

        // Cache key for vehicle-type-specific pricing
        $vehicleCacheKey = "pricing_vehicle_{$vehicleType}_{$planType}_{$tripType}";
        $vehiclePricing = Cache::remember($vehicleCacheKey, 3600, function () use ($planType, $tripType, $vehicleType) {
            return PricingRule::where('plan_type', $planType)
                ->where('trip_type', $tripType)
                ->whereNull('route_id')
                ->where('vehicle_type', $vehicleType)
                ->where('active', true)
                ->first();
        });

        if ($vehiclePricing) {
            return (float) $vehiclePricing->amount;
        }

        // Cache key for global pricing
        $globalCacheKey = "pricing_global_{$planType}_{$tripType}";
        $globalPricing = Cache::remember($globalCacheKey, 3600, function () use ($planType, $tripType) {
            return PricingRule::where('plan_type', $planType)
                ->where('trip_type', $tripType)
                ->whereNull('route_id')
                ->whereNull('vehicle_type')
                ->where('active', true)
                ->first();
        });

        if ($globalPricing) {
            return (float) $globalPricing->amount;
        }

        throw new PricingNotFoundException($planType);
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

