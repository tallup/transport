<?php

namespace Database\Seeders;

use App\Models\PricingRule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddOneWayPricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder creates one-way pricing rules based on existing two-way pricing rules.
     */
    public function run(): void
    {
        $this->command->info('Creating one-way pricing rules from existing two-way rules...');
        
        // Get all existing two-way pricing rules
        $twoWayRules = PricingRule::where('trip_type', 'two_way')->get();
        
        $created = 0;
        $skipped = 0;
        
        foreach ($twoWayRules as $twoWayRule) {
            // Check if one-way rule already exists
            $exists = PricingRule::where('plan_type', $twoWayRule->plan_type)
                ->where('trip_type', 'one_way')
                ->where('route_id', $twoWayRule->route_id)
                ->where('vehicle_type', $twoWayRule->vehicle_type)
                ->exists();
            
            if ($exists) {
                $skipped++;
                continue;
            }
            
            // Create one-way pricing rule (60% of two-way price)
            PricingRule::create([
                'plan_type' => $twoWayRule->plan_type,
                'trip_type' => 'one_way',
                'route_id' => $twoWayRule->route_id,
                'vehicle_type' => $twoWayRule->vehicle_type,
                'amount' => round($twoWayRule->amount * 0.6, 2),
                'currency' => $twoWayRule->currency,
                'active' => $twoWayRule->active,
            ]);
            
            $created++;
        }
        
        $this->command->info("✅ Created {$created} one-way pricing rules");
        if ($skipped > 0) {
            $this->command->info("⏭️  Skipped {$skipped} (already exist)");
        }
    }
}

