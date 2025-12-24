<?php

namespace Database\Seeders;

use App\Models\PricingRule;
use Illuminate\Database\Seeder;

class PricingRuleSeeder extends Seeder
{
    public function run(): void
    {
        // Global pricing rules (no route_id, no vehicle_type)
        $globalPricing = [
            ['plan_type' => 'weekly', 'amount' => 50.00],
            ['plan_type' => 'bi_weekly', 'amount' => 95.00],
            ['plan_type' => 'monthly', 'amount' => 180.00],
            ['plan_type' => 'semester', 'amount' => 800.00],
            ['plan_type' => 'annual', 'amount' => 1500.00],
        ];

        foreach ($globalPricing as $pricing) {
            PricingRule::firstOrCreate(
                [
                    'plan_type' => $pricing['plan_type'],
                    'route_id' => null,
                    'vehicle_type' => null,
                ],
                [
                    'amount' => $pricing['amount'],
                    'currency' => 'USD',
                    'active' => true,
                ]
            );
        }

        // Vehicle type specific pricing (bus vs van)
        $vehiclePricing = [
            ['vehicle_type' => 'bus', 'plan_type' => 'weekly', 'amount' => 55.00],
            ['vehicle_type' => 'bus', 'plan_type' => 'monthly', 'amount' => 200.00],
            ['vehicle_type' => 'van', 'plan_type' => 'weekly', 'amount' => 60.00],
            ['vehicle_type' => 'van', 'plan_type' => 'monthly', 'amount' => 220.00],
        ];

        foreach ($vehiclePricing as $pricing) {
            PricingRule::firstOrCreate(
                [
                    'plan_type' => $pricing['plan_type'],
                    'route_id' => null,
                    'vehicle_type' => $pricing['vehicle_type'],
                ],
                [
                    'amount' => $pricing['amount'],
                    'currency' => 'USD',
                    'active' => true,
                ]
            );
        }
    }
}
