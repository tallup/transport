<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class DriverAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  \App\Models\Booking|null  $booking  Null when notifying the driver; set when notifying the parent.
     * @param  \App\Models\User  $driver
     * @param  \App\Models\Route  $route
     */
    public function __construct(
        public $booking,
        public $driver,
        public $route
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): \Illuminate\Notifications\Messages\MailMessage
    {
        $route = $this->route->loadMissing(['vehicle']);

        // Notifying the driver (no booking context)
        if ($this->booking === null) {
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('You\'ve been assigned to a route - ' . $route->name)
                ->view('emails.driver-route-assigned', [
                    'driver' => $this->driver,
                    'route' => $route,
                ]);
        }

        // Notifying the parent
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Driver assigned to your child\'s route')
            ->view('emails.driver-assigned', [
                'user' => $notifiable,
                'driver' => $this->driver,
                'booking' => $this->booking,
                'route' => $route,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'route_id' => $this->route->id,
            'route_name' => $this->route->name,
            'driver_id' => $this->driver->id,
        ];
    }
}
