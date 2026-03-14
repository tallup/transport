<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookingStartingSoon;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendBookingReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders to parents for active bookings starting tomorrow.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        $bookings = Booking::where('status', Booking::STATUS_ACTIVE)
            ->whereDate('start_date', $tomorrow)
            ->with(['student.parent', 'route', 'pickupPoint'])
            ->get();

        $count = 0;

        foreach ($bookings as $booking) {
            $parent = $booking->student?->parent;

            if ($parent && filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
                try {
                    $parent->notify(new BookingStartingSoon($booking));
                    $count++;
                } catch (\Exception $e) {
                    Log::error("Failed to send booking reminder for booking #{$booking->id}: " . $e->getMessage());
                }
            }
        }

        $this->info("Successfully sent {$count} booking reminder(s) for {$tomorrow}.");
        Log::info("Booking Reminders: Sent {$count} reminders for bookings starting on {$tomorrow}.");
    }
}
