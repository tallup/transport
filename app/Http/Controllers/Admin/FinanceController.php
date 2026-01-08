<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\PricingRule;
use App\Services\PricingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    protected $pricingService;

    public function __construct(PricingService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

    public function dashboard(Request $request)
    {
        try {
            // Calculate total revenue from active and pending bookings
            $totalRevenue = 0;
            $activeBookings = Booking::whereIn('status', ['active', 'pending'])
                ->with(['route.vehicle', 'student.parent'])
                ->get();
            
            foreach ($activeBookings as $booking) {
                try {
                    if ($booking->route) {
                        $price = $this->pricingService->calculatePrice($booking->plan_type, $booking->route);
                        $totalRevenue += $price;
                    }
                } catch (\Exception $e) {
                    // Skip bookings without valid pricing
                }
            }

            // Revenue by plan type
            $revenueByPlanType = [];
            $planTypes = ['weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual'];
            
            foreach ($planTypes as $planType) {
                $bookings = Booking::whereIn('status', ['active', 'pending'])
                    ->where('plan_type', $planType)
                    ->with(['route.vehicle', 'student.parent'])
                    ->get();
                
                $planRevenue = 0;
                foreach ($bookings as $booking) {
                    try {
                        if ($booking->route) {
                            $price = $this->pricingService->calculatePrice($booking->plan_type, $booking->route);
                            $planRevenue += $price;
                        }
                    } catch (\Exception $e) {
                        // Skip bookings without valid pricing
                    }
                }
                
                $revenueByPlanType[] = [
                    'plan_type' => $planType,
                    'label' => ucfirst(str_replace('_', '-', $planType)),
                    'revenue' => round($planRevenue, 2),
                    'count' => $bookings->count(),
                ];
            }

            // Revenue trends (last 30 days)
            $revenueTrends = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $dayStart = $date->copy()->startOfDay();
                $dayEnd = $date->copy()->endOfDay();
                
                $dayBookings = Booking::whereIn('status', ['active', 'pending'])
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->with(['route.vehicle', 'student.parent'])
                    ->get();
                
                $dayRevenue = 0;
                foreach ($dayBookings as $booking) {
                    try {
                        if ($booking->route) {
                            $price = $this->pricingService->calculatePrice($booking->plan_type, $booking->route);
                            $dayRevenue += $price;
                        }
                    } catch (\Exception $e) {
                        // Skip bookings without valid pricing
                    }
                }
                
                $revenueTrends[] = [
                    'date' => $date->format('Y-m-d'),
                    'label' => $date->format('M d'),
                    'revenue' => round($dayRevenue, 2),
                ];
            }

            // Booking statistics by plan type
            $bookingStats = Booking::select('plan_type', DB::raw('count(*) as count'))
                ->groupBy('plan_type')
                ->get()
                ->mapWithKeys(fn($item) => [
                    $item->plan_type => [
                        'count' => $item->count,
                        'label' => ucfirst(str_replace('_', '-', $item->plan_type)),
                    ]
                ])
                ->toArray();

            // Status summary
            $statusSummary = [
                'active' => Booking::where('status', 'active')->count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'cancelled' => Booking::where('status', 'cancelled')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
            ];

            // Monthly revenue (last 6 months)
            $monthlyRevenue = [];
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $monthStart = $month->copy()->startOfMonth();
                $monthEnd = $month->copy()->endOfMonth();
                
                $monthBookings = Booking::whereIn('status', ['active', 'pending'])
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->with(['route.vehicle', 'student.parent'])
                    ->get();
                
                $monthRev = 0;
                foreach ($monthBookings as $booking) {
                    try {
                        if ($booking->route) {
                            $price = $this->pricingService->calculatePrice($booking->plan_type, $booking->route);
                            $monthRev += $price;
                        }
                    } catch (\Exception $e) {
                        // Skip bookings without valid pricing
                    }
                }
                
                $monthlyRevenue[] = [
                    'month' => $month->format('Y-m'),
                    'label' => $month->format('M Y'),
                    'revenue' => round($monthRev, 2),
                ];
            }

            return Inertia::render('Admin/Finance/Dashboard', [
                'totalRevenue' => round($totalRevenue, 2),
                'activeBookings' => $activeBookings->count(),
                'cancelledBookings' => Booking::where('status', 'cancelled')->count(),
                'revenueByPlanType' => $revenueByPlanType,
                'revenueTrends' => $revenueTrends,
                'monthlyRevenue' => $monthlyRevenue,
                'bookingStats' => $bookingStats,
                'statusSummary' => $statusSummary,
            ]);
        } catch (\Exception $e) {
            // Return dashboard with empty data if there's an error
            return Inertia::render('Admin/Finance/Dashboard', [
                'totalRevenue' => 0,
                'activeBookings' => 0,
                'cancelledBookings' => 0,
                'revenueByPlanType' => [],
                'revenueTrends' => [],
                'monthlyRevenue' => [],
                'bookingStats' => [],
                'statusSummary' => [
                    'active' => 0,
                    'pending' => 0,
                    'cancelled' => 0,
                    'completed' => 0,
                ],
            ]);
        }
    }
}

