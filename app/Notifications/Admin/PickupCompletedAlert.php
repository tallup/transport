<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class PickupCompletedAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $driver,
        public $period,
        public $completedAt,
        public $pickupLocation
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
        return (new class($this->booking, $this->driver, $this->period, $this->completedAt, $this->pickupLocation) extends Mailable {
            public $booking;
            public $driver;
            public $period;
            public $completedAt;
            public $pickupLocation;

            public function __construct($booking, $driver, $period, $completedAt, $pickupLocation) {
                $this->booking = $booking;
                $this->driver = $driver;
                $this->period = $period;
                $this->completedAt = $completedAt;
                $this->pickupLocation = $pickupLocation;
            }

            public function build() {
                $subjectPrefix = $this->period === 'pm' ? 'Drop-off Completed' : 'Pickup Completed';
                return $this->subject($subjectPrefix . ' - ' . strtoupper($this->period))
                    ->view('emails.admin.pickup-completed-alert', [
                        'booking' => $this->booking,
                        'driver' => $this->driver,
                        'period' => $this->period,
                        'completedAt' => $this->completedAt,
                        'pickupLocation' => $this->pickupLocation,
                    ]);
            }
        });
    }
}

