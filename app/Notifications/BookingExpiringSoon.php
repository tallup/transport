<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class BookingExpiringSoon extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $daysRemaining
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return (new class($this->booking, $this->daysRemaining) extends Mailable {
            public $booking;
            public $daysRemaining;
            
            public function __construct($booking, $daysRemaining) {
                $this->booking = $booking;
                $this->daysRemaining = $daysRemaining;
            }
            
            public function build() {
                return $this->subject('Booking Expiring Soon - Renew Your Service')
                    ->view('emails.booking-expiring', [
                        'booking' => $this->booking,
                        'daysRemaining' => $this->daysRemaining,
                        'user' => $this->booking->student->parent,
                    ]);
            }
        });
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'days_remaining' => $this->daysRemaining,
            'end_date' => $this->booking->end_date,
        ];
    }
}



