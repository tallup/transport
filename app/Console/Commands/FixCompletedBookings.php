<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Console\Command;

class FixCompletedBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:fix-completed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix bookings marked as completed - set them back to active if their plan period has not ended';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing completed bookings...');
        
        $today = Carbon::today();
        
        // Find all bookings with status 'completed'
        $completedBookings = Booking::where('status', 'completed')->get();
        
        $this->info("Found {$completedBookings->count()} bookings with 'completed' status");
        
        $fixedCount = 0;
        $expiredCount = 0;
        
        foreach ($completedBookings as $booking) {
            $endDate = $booking->end_date ? Carbon::parse($booking->end_date) : null;
            
            // If booking has an end_date and it has passed, mark as expired
            if ($endDate && $today->gt($endDate)) {
                $booking->update(['status' => 'expired']);
                $expiredCount++;
                $this->line("  - Booking #{$booking->id} (Student: {$booking->student->name}): Changed to 'expired' (end_date: {$booking->end_date})");
            } 
            // If booking has no end_date or end_date hasn't passed, mark as active
            else {
                $booking->update(['status' => 'active']);
                $fixedCount++;
                $endDateStr = $endDate ? $endDate->format('Y-m-d') : 'no end date';
                $this->line("  - Booking #{$booking->id} (Student: {$booking->student->name}): Changed to 'active' (end_date: {$endDateStr})");
            }
        }
        
        $this->info("✓ Fixed booking statuses");
        $this->info("  - Changed to 'active': {$fixedCount}");
        $this->info("  - Changed to 'expired': {$expiredCount}");
        
        return Command::SUCCESS;
    }
}
