<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookingExpiringSoon;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendBookingExpiringNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:notify-expiring {--days=3 : Number of days before expiration to send notification}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to parents for bookings that are expiring soon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysBeforeExpiration = $this->option('days');
        $targetDate = Carbon::today()->addDays($daysBeforeExpiration);

        $this->info("Checking for bookings expiring on {$targetDate->format('Y-m-d')}...");

        // Find active bookings that will expire in X days
        $expiringBookings = Booking::where('status', 'active')
            ->whereNotNull('end_date')
            ->whereDate('end_date', $targetDate)
            ->with(['student.parent'])
            ->get();

        if ($expiringBookings->isEmpty()) {
            $this->info('No bookings expiring in ' . $daysBeforeExpiration . ' days.');
            return 0;
        }

        $notificationsSent = 0;

        foreach ($expiringBookings as $booking) {
            if ($booking->student && $booking->student->parent) {
                try {
                    $booking->student->parent->notify(new BookingExpiringSoon(
                        $booking,
                        $daysBeforeExpiration
                    ));
                    $notificationsSent++;
                    $this->info("Notification sent for booking #{$booking->id} - {$booking->student->name}");
                } catch (\Exception $e) {
                    $this->error("Failed to send notification for booking #{$booking->id}: {$e->getMessage()}");
                }
            }
        }

        $this->info("Successfully sent {$notificationsSent} expiring booking notifications.");
        return 0;
    }
}
