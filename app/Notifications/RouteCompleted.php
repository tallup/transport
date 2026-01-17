<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class RouteCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $route,
        public $period,
        public $completedAt
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
        return (new class($this->booking, $this->route, $this->period, $this->completedAt) extends Mailable {
            public $booking;
            public $route;
            public $period;
            public $completedAt;
            
            public function __construct($booking, $route, $period, $completedAt) {
                $this->booking = $booking;
                $this->route = $route;
                $this->period = $period;
                $this->completedAt = $completedAt;
            }
            
            public function build() {
                return $this->subject('Route Completed - ' . strtoupper($this->period) . ' Service')
                    ->view('emails.route-completed', [
                        'booking' => $this->booking,
                        'route' => $this->route,
                        'period' => $this->period,
                        'completedAt' => $this->completedAt,
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
            'route_id' => $this->route->id,
            'period' => $this->period,
            'completed_at' => $this->completedAt,
        ];
    }
}

