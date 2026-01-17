<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class RouteChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $route,
        public $changes
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
        return (new class($this->booking, $this->route, $this->changes) extends Mailable {
            public $booking;
            public $route;
            public $changes;
            
            public function __construct($booking, $route, $changes) {
                $this->booking = $booking;
                $this->route = $route;
                $this->changes = $changes;
            }
            
            public function build() {
                return $this->subject('Route Information Updated')
                    ->view('emails.route-changed', [
                        'booking' => $this->booking,
                        'route' => $this->route,
                        'changes' => $this->changes,
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
            'changes' => $this->changes,
        ];
    }
}

