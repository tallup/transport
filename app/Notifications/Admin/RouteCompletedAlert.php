<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class RouteCompletedAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $route,
        public $driver,
        public $period,
        public $completedAt,
        public $studentsCount
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
        return (new class($this->route, $this->driver, $this->period, $this->completedAt, $this->studentsCount) extends Mailable {
            public $route;
            public $driver;
            public $period;
            public $completedAt;
            public $studentsCount;
            
            public function __construct($route, $driver, $period, $completedAt, $studentsCount) {
                $this->route = $route;
                $this->driver = $driver;
                $this->period = $period;
                $this->completedAt = $completedAt;
                $this->studentsCount = $studentsCount;
            }
            
            public function build() {
                return $this->subject('Route Completed - ' . strtoupper($this->period) . ' - ' . $this->route->name)
                    ->view('emails.admin.route-completed-alert', [
                        'route' => $this->route,
                        'driver' => $this->driver,
                        'period' => $this->period,
                        'completedAt' => $this->completedAt,
                        'studentsCount' => $this->studentsCount,
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
            'route_id' => $this->route->id,
            'driver_id' => $this->driver->id,
            'period' => $this->period,
            'completed_at' => $this->completedAt,
            'students_count' => $this->studentsCount,
        ];
    }
}
