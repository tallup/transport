<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BookingCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking
    ) {}

    /**
     * No channels: parent only receives email after payment is complete (BookingConfirmed).
     */
    public function via(object $notifiable): array
    {
        return [];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
        ];
    }
}
