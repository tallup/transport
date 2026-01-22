<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BookingService;

class UpdateBookingStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update booking statuses: expire active bookings that have ended';

    /**
     * Execute the console command.
     */
    public function handle(BookingService $bookingService)
    {
        $this->info('Updating booking statuses...');
        
        $beforePending = \App\Models\Booking::where('status', 'pending')->count();
        $beforeAwaitingApproval = \App\Models\Booking::where('status', 'awaiting_approval')->count();
        $beforeActive = \App\Models\Booking::where('status', 'active')->count();
        
        $bookingService->updateBookingStatuses();
        
        $afterPending = \App\Models\Booking::where('status', 'pending')->count();
        $afterAwaitingApproval = \App\Models\Booking::where('status', 'awaiting_approval')->count();
        $afterActive = \App\Models\Booking::where('status', 'active')->count();
        $afterExpired = \App\Models\Booking::where('status', 'expired')->count();

        $expired = $afterExpired - (\App\Models\Booking::where('status', 'expired')->where('created_at', '<', now()->subMinute())->count() - $afterExpired);
        
        $this->info("✓ Updated booking statuses");
        $this->info("  - Expired: {$expired} active bookings");
        $this->info("  - Pending bookings remaining: {$afterPending}");
        $this->info("  - Awaiting approval bookings remaining: {$afterAwaitingApproval}");
        $this->info("  - Active bookings: {$afterActive}");
        
        return Command::SUCCESS;
    }
}

