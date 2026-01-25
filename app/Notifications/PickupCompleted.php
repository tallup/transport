<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class PickupCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $pickupLocation,
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

    public function toMail(object $notifiable): \Illuminate\Notifications\Messages\MailMessage
    {
        $subjectPrefix = $this->period === 'pm' ? 'Student Drop-off Completed' : 'Student Picked Up';
        
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject($subjectPrefix . ' - ' . strtoupper($this->period) . ' Service')
            ->view('emails.pickup-completed', [
                'booking' => $this->booking,
                'pickupLocation' => $this->pickupLocation,
                'period' => $this->period,
                'completedAt' => $this->completedAt,
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
            'student_name' => $this->booking->student->name,
            'pickup_location' => $this->pickupLocation,
            'period' => $this->period,
            'completed_at' => $this->completedAt,
        ];
    }
}



