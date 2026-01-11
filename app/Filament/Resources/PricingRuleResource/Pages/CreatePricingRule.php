<?php

namespace App\Filament\Resources\PricingRuleResource\Pages;

use App\Filament\Resources\PricingRuleResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Validation\ValidationException;

class CreatePricingRule extends CreateRecord
{
    protected static string $resource = PricingRuleResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Check for duplicate pricing rule
        $exists = \App\Models\PricingRule::where('plan_type', $data['plan_type'])
            ->where('trip_type', $data['trip_type'] ?? 'two_way')
            ->where('route_id', $data['route_id'] ?? null)
            ->where('vehicle_type', $data['vehicle_type'] ?? null)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'plan_type' => 'A pricing rule with this combination of plan type, trip type, route, and vehicle type already exists.',
            ]);
        }

        return $data;
    }
}
