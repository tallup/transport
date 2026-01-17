<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class DriverAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $driver,
        public $route
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
        return (new class($this->booking, $this->driver, $this->route) extends Mailable {
            public $booking;
            public $driver;
            public $route;
            
            public function __construct($booking, $driver, $route) {
                $this->booking = $booking;
                $this->driver = $driver;
                $this->route = $route;
            }
            
            public function build() {
                return $this->subject('Driver Assigned to Your Route')
                    ->view('emails.driver-assigned', [
                        'booking' => $this->booking,
                        'driver' => $this->driver,
                        'route' => $this->route,
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
            'driver_id' => $this->driver->id,
            'driver_name' => $this->driver->name,
            'route_id' => $this->route->id,
        ];
    }
}

