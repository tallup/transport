<?php

namespace App\Filament\Pages;

use App\Models\PricingRule;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Livewire\Attributes\On;

class ManagePricing extends Page
{

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationLabel = 'Manage Pricing';

    protected static ?string $navigationGroup = 'Finance';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.manage-pricing';

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    public $pricingRules = [];
    public $planTypes = [
        'weekly' => 'Weekly',
        'monthly' => 'Monthly',
        'academic_term' => 'Academic Term',
        'annual' => 'Annual',
    ];

    public function mount(): void
    {
        $this->loadPricingRules();
    }

    protected function loadPricingRules(): void
    {
        $this->pricingRules = PricingRule::with('route')
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
    }

    public function toggleActive($ruleId): void
    {
        $rule = PricingRule::findOrFail($ruleId);
        $rule->update(['active' => !$rule->active]);
        
        $this->loadPricingRules();
        
        Notification::make()
            ->title('Pricing rule updated')
            ->success()
            ->send();
    }

    public function deleteRule($ruleId): void
    {
        $rule = PricingRule::findOrFail($ruleId);
        $ruleName = $rule->route?->name ?? ($rule->vehicle_type ? ucfirst($rule->vehicle_type) : 'Global');
        $rule->delete();
        
        $this->loadPricingRules();
        
        Notification::make()
            ->title('Pricing rule deleted')
            ->body("The pricing rule for {$ruleName} has been deleted.")
            ->success()
            ->send();
    }
}
