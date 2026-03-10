<?php

namespace App\Services;

use App\Exceptions\PricingNotFoundException;
use App\Models\Booking;
use App\Models\Discount;
use App\Models\PricingRule;
use App\Models\Route;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class PricingService
{
    /**
     * Calculate price for a booking based on plan type, trip type, route, and vehicle type.
     * Applies time-based discount when forDate is provided; optional booking for manual discount.
     *
     * @param string $planType
     * @param string $tripType 'one_way' or 'two_way'
     * @param Route $route
     * @param \Carbon\Carbon|null $forDate Date used to resolve time-based discounts (default: today)
     * @param Booking|null $booking When set and has manual discount, that overrides time-based
     * @return float
     * @throws \Exception
     */
    public function calculatePrice(string $planType, string $tripType, Route $route, ?Carbon $forDate = null, ?Booking $booking = null): float
    {
        $base = $this->getBasePrice($planType, $tripType, $route);

        if ($booking && $this->bookingHasManualDiscount($booking)) {
            return $this->applyDiscount($base, $booking->manual_discount_type, (float) $booking->manual_discount_value);
        }

        $discount = $this->getActiveTimeBasedDiscount($route->id, $planType, $forDate);
        if ($discount) {
            return $this->applyDiscount($base, $discount->type, (float) $discount->value);
        }

        return $base;
    }

    /**
     * Calculate final price for an existing booking (manual discount or time-based applied).
     */
    public function calculatePriceForBooking(Booking $booking): float
    {
        $booking->loadMissing('route.vehicle');
        $route = $booking->route;
        if (! $route) {
            throw new PricingNotFoundException($booking->plan_type ?? 'unknown');
        }

        $planType = $booking->plan_type;
        $tripType = $booking->trip_type ?? 'two_way';
        $forDate = $booking->start_date ? Carbon::parse($booking->start_date) : Carbon::today();

        return $this->calculatePrice($planType, $tripType, $route, $forDate, $booking);
    }

    /**
     * Base price from pricing rules only (no discounts).
     * Priority: route-specific > vehicle-type-specific > global pricing.
     *
     * @throws PricingNotFoundException
     */
    public function getBasePrice(string $planType, string $tripType, Route $route): float
    {
        $vehicleType = $route->vehicle->type;

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
     * Apply a single discount (percentage or fixed). Result is never below zero.
     */
    public function applyDiscount(float $base, string $type, float $value): float
    {
        if ($type === 'percentage') {
            $value = min(100, max(0, $value));
            $reduction = $base * ($value / 100);
        } else {
            $reduction = min($base, max(0, $value));
        }

        return max(0, round($base - $reduction, 2));
    }

    /**
     * Get one active time-based discount for the given route/plan and date (first matching by id).
     */
    protected function getActiveTimeBasedDiscount(int $routeId, string $planType, ?Carbon $forDate = null): ?Discount
    {
        $forDate = $forDate ?? Carbon::today();

        return Discount::activeForDate($forDate)
            ->forRoute($routeId)
            ->forPlanType($planType)
            ->orderBy('id')
            ->first();
    }

    protected function bookingHasManualDiscount(Booking $booking): bool
    {
        return $booking->manual_discount_type && $booking->manual_discount_value !== null;
    }

    /**
     * Get the first active multi-child discount where numberOfChildren >= min_children.
     */
    public function getActiveMultiChildDiscount(int $numberOfChildren, ?Carbon $forDate = null, ?int $routeId = null, ?string $planType = null): ?Discount
    {
        $forDate = $forDate ?? Carbon::today();

        $query = Discount::activeForDate($forDate)
            ->forMultiChild($numberOfChildren)
            ->orderBy('min_children', 'desc');

        return $query->first();
    }

    /**
     * Given price per booking (after time-based discount), apply multi-child discount if active.
     * Returns ['per_booking' => float, 'discount' => Discount|null, 'discount_label' => string].
     */
    public function getMultiChildDiscountedPerBooking(float $priceAfterTimeBased, int $numberOfChildren, ?Carbon $forDate = null, ?int $routeId = null, ?string $planType = null): array
    {
        $discount = $this->getActiveMultiChildDiscount($numberOfChildren, $forDate, $routeId, $planType);
        if (! $discount) {
            return [
                'per_booking' => $priceAfterTimeBased,
                'discount' => null,
                'discount_label' => null,
            ];
        }
        $perBooking = $this->applyDiscount($priceAfterTimeBased, $discount->type, (float) $discount->value);
        $label = $discount->name;
        if ($discount->type === 'percentage') {
            $label .= ' (' . (int) $discount->value . '%)';
        } else {
            $label .= ' ($' . number_format((float) $discount->value, 2) . ')';
        }

        return [
            'per_booking' => $perBooking,
            'discount' => $discount,
            'discount_label' => $label,
        ];
    }

    /**
     * Compute manual_discount type and value so that applyDiscount(basePrice, type, value) === targetPerBooking.
     * Returns ['manual_discount_type' => 'percentage'|'fixed', 'manual_discount_value' => float].
     */
    public function manualDiscountForTarget(float $basePrice, float $targetPerBooking): array
    {
        if ($basePrice <= 0 || $targetPerBooking >= $basePrice) {
            return ['manual_discount_type' => null, 'manual_discount_value' => null];
        }
        $targetPerBooking = max(0, round($targetPerBooking, 2));
        $reduction = $basePrice - $targetPerBooking;
        if ($reduction <= 0) {
            return ['manual_discount_type' => null, 'manual_discount_value' => null];
        }
        return [
            'manual_discount_type' => 'fixed',
            'manual_discount_value' => round($reduction, 2),
        ];
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

