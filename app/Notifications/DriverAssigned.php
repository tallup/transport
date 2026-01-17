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
        return (new class($this->booking, $this->driver, $this->route, $notifiable) extends Mailable {
            public $booking;
            public $driver;
            public $route;
            public $notifiable;
            
            public function __construct($booking, $driver, $route, $notifiable) {
                $this->booking = $booking;
                $this->driver = $driver;
                $this->route = $route;
                $this->notifiable = $notifiable;
            }
            
            public function build() {
                // Check if notifiable is a driver (no booking) or parent (has booking)
                $isDriver = $this->notifiable->role === 'driver';
                
                if ($isDriver) {
                    // Email for driver
                    return $this->subject('Route Assignment - You've Been Assigned')
                        ->view('emails.driver-route-assigned', [
                            'driver' => $this->driver,
                            'route' => $this->route,
                        ]);
                } else {
                    // Email for parent
                    return $this->subject('Driver Assigned to Your Route')
                        ->view('emails.driver-assigned', [
                            'booking' => $this->booking,
                            'driver' => $this->driver,
                            'route' => $this->route,
                            'user' => $this->booking->student->parent,
                        ]);
                }
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

