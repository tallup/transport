<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class DriverVehicleAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $route
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): \Illuminate\Notifications\Messages\MailMessage
    {
        $route = $this->route->loadMissing(['vehicle']);
        $vehicle = $route->vehicle;
        $vehicleLabel = $vehicle
            ? $vehicle->make . ' ' . $vehicle->model . ' (' . $vehicle->license_plate . ')'
            : 'N/A';

        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Vehicle assigned to your route - ' . $route->name)
            ->view('emails.driver-vehicle-assigned', [
                'driver' => $notifiable,
                'route' => $route,
                'vehicleLabel' => $vehicleLabel,
                'vehicle' => $vehicle,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'route_id' => $this->route->id,
            'vehicle_id' => $this->route->vehicle_id,
        ];
    }
}
