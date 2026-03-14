<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookingStartingSoon;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class NotifyBookingsStartingSoon extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:notify-starting-soon';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to parents for bookings starting tomorrow';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = Carbon::tomorrow()->toDateString();
        
        $bookings = Booking::whereDate('start_date', $tomorrow)
            ->whereIn('status', [Booking::STATUS_ACTIVE, Booking::STATUS_AWAITING_APPROVAL])
            ->with(['student.parent', 'route', 'pickupPoint'])
            ->get();

        $this->info("Found {$bookings->count()} bookings starting tomorrow ({$tomorrow}).");

        foreach ($bookings as $booking) {
            $parent = $booking->student?->parent;
            
            if ($parent) {
                try {
                    $parent->notify(new BookingStartingSoon($booking));
                    $this->debug("Notified parent of {$booking->student->name} (Booking #{$booking->id})");
                } catch (\Exception $e) {
                    Log::error("Failed to send starting soon notification for booking #{$booking->id}: " . $e->getMessage());
                    $this->error("Failed to notify parent for booking #{$booking->id}");
                }
            }
        }

        $this->info('Completed sending notifications.');
    }
}
