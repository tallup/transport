<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TripStarted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $route,
        public $period,
        public $startedAt
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
            ->subject('Trip Started - ' . strtoupper($this->period) . ' Service')
            ->view('emails.trip-started', [
                'booking' => $this->booking,
                'route' => $this->route,
                'period' => $this->period,
                'startedAt' => $this->startedAt,
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
            'route_id' => $this->route->id,
            'period' => $this->period,
            'started_at' => $this->startedAt,
        ];
    }
}
