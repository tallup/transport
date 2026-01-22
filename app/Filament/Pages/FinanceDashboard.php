<?php

namespace App\Filament\Pages;

use App\Models\Booking;
use App\Models\PricingRule;
use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;

class FinanceDashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationLabel = 'Finance Dashboard';

    protected static ?string $navigationGroup = 'Finance';

    protected static ?int $navigationSort = 0;

    protected static string $view = 'filament.pages.finance-dashboard';

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    public $revenueData = [];
    public $bookingStats = [];
    public $outstandingPayments = 0;

    public function mount(): void
    {
        $this->loadStats();
    }

    protected function loadStats(): void
    {
        // Revenue summary
        $activeBookings = Booking::whereIn('status', ['active', 'pending', 'awaiting_approval'])->count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();
        
        // Booking statistics by plan type
        $this->bookingStats = Booking::select('plan_type', DB::raw('count(*) as count'))
            ->groupBy('plan_type')
            ->get()
            ->mapWithKeys(fn($item) => [$item->plan_type => $item->count]);

        // Calculate estimated revenue (simplified - would need actual payment data)
        $totalRevenue = 0;
        foreach ($this->bookingStats as $planType => $count) {
            $avgPrice = PricingRule::where('plan_type', $planType)
                ->where('active', true)
                ->avg('amount') ?? 0;
            $totalRevenue += $avgPrice * $count;
        }

        $this->revenueData = [
            'total_revenue' => $totalRevenue,
            'active_bookings' => $activeBookings,
            'cancelled_bookings' => $cancelledBookings,
        ];
    }
}
