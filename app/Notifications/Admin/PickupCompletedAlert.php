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

    public function toMail(object $notifiable): \Illuminate\Notifications\Messages\MailMessage
    {
        $subjectPrefix = $this->period === 'pm' ? 'Drop-off Completed' : 'Pickup Completed';
        
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject($subjectPrefix . ' - ' . strtoupper($this->period))
            ->view('emails.admin.pickup-completed-alert', [
                'booking' => $this->booking,
                'driver' => $this->driver,
                'period' => $this->period,
                'completedAt' => $this->completedAt,
                'pickupLocation' => $this->pickupLocation,
            ]);
    }
}

