<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class DriverStudentAdded extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking
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
        return (new class($this->booking) extends Mailable {
            public $booking;

            public function __construct($booking) {
                $this->booking = $booking;
            }

            public function build() {
                return $this->subject('New Student Added to Your Route')
                    ->view('emails.driver-student-added', [
                        'booking' => $this->booking,
                        'driver' => $this->booking->route?->driver,
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
            'student_name' => $this->booking->student?->name,
        ];
    }
}

