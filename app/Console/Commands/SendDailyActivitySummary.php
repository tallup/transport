<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\DailyPickup;
use App\Models\RouteCompletion;
use App\Models\Route;
use App\Models\Student;
use App\Models\User;
use App\Notifications\Admin\DailyActivitySummary;
use App\Services\AdminNotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendDailyActivitySummary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:daily-summary {--date= : Date for the summary (Y-m-d format)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily activity summary to all administrators';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->option('date') ? Carbon::parse($this->option('date')) : Carbon::yesterday();
        
        $this->info("Generating daily summary for {$date->format('Y-m-d')}...");

        // Gather statistics
        $stats = [
            // New bookings created on this date
            'new_bookings' => Booking::whereDate('created_at', $date)->count(),
            
            // Cancelled bookings on this date
            'cancelled_bookings' => Booking::where('status', 'cancelled')
                ->whereDate('updated_at', $date)
                ->count(),
            
            // Completed pickups on this date
            'completed_pickups' => DailyPickup::whereDate('pickup_date', $date)->count(),
            
            // Revenue from payments on this date
            'revenue' => Booking::where('status', 'active')
                ->whereDate('updated_at', $date)
                ->whereNotNull('stripe_customer_id')
                ->count() * 100, // Simplified - you may want to calculate actual amounts
            
            // Route completions with details
            'route_completions' => RouteCompletion::whereDate('completion_date', $date)
                ->with(['route', 'driver'])
                ->get()
                ->map(function ($completion) {
                    return [
                        'route_name' => $completion->route->name,
                        'period' => $completion->period,
                        'driver_name' => $completion->driver->name,
                        'time' => $completion->completed_at->format('g:i A'),
                    ];
                })
                ->toArray(),
            
            // System overview
            'active_bookings_count' => Booking::where('status', 'active')
                ->whereDate('start_date', '<=', now())
                ->where(function ($query) {
                    $query->whereNull('end_date')
                        ->orWhereDate('end_date', '>=', now());
                })
                ->count(),
            
            'active_routes_count' => Route::where('active', true)->count(),
            'total_students' => Student::count(),
            'total_parents' => User::where('role', 'parent')->count(),
            
            // Pending actions
            'pending_actions' => $this->getPendingActions(),
        ];

        // Send to all admins
        $adminService = new AdminNotificationService();
        $admins = $adminService->getAdmins();
        
        if ($admins->isEmpty()) {
            $this->error('No admin users found!');
            return 1;
        }

        foreach ($admins as $admin) {
            try {
                $admin->notify(new DailyActivitySummary($date, $stats));
                $this->info("Summary sent to: {$admin->email}");
            } catch (\Exception $e) {
                $this->error("Failed to send to {$admin->email}: {$e->getMessage()}");
            }
        }

        $this->info("Daily summary sent successfully to {$admins->count()} admin(s).");
        return 0;
    }

    /**
     * Get list of pending actions that require attention
     */
    private function getPendingActions()
    {
        $actions = [];

        // Check for pending bookings (awaiting payment)
        $pendingBookings = Booking::where('status', 'pending')->count();
        if ($pendingBookings > 0) {
            $actions[] = "{$pendingBookings} pending booking(s) awaiting payment";
        }

        // Check for bookings awaiting admin approval
        $awaitingApproval = Booking::where('status', 'awaiting_approval')->count();
        if ($awaitingApproval > 0) {
            $actions[] = "{$awaitingApproval} booking(s) awaiting admin approval";
        }

        // Check for routes without drivers
        $routesWithoutDrivers = Route::where('active', true)
            ->whereNull('driver_id')
            ->count();
        if ($routesWithoutDrivers > 0) {
            $actions[] = "{$routesWithoutDrivers} active route(s) without assigned driver";
        }

        // Check for bookings expiring in next 3 days
        $expiringBookings = Booking::where('status', 'active')
            ->whereNotNull('end_date')
            ->whereDate('end_date', '>=', now())
            ->whereDate('end_date', '<=', now()->addDays(3))
            ->count();
        if ($expiringBookings > 0) {
            $actions[] = "{$expiringBookings} booking(s) expiring in next 3 days";
        }

        return $actions;
    }
}
