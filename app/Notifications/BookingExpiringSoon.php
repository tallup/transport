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

    public function toMail(object $notifiable): \Illuminate\Notifications\Messages\MailMessage
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Booking Expiring Soon - Renew Your Service')
            ->view('emails.booking-expiring', [
                'booking' => $this->booking,
                'daysRemaining' => $this->daysRemaining,
                'user' => $notifiable,
            ]);
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



