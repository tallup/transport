<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class NewBookingCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $parent
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
        return (new class($this->booking, $this->parent) extends Mailable {
            public $booking;
            public $parent;
            
            public function __construct($booking, $parent) {
                $this->booking = $booking;
                $this->parent = $parent;
            }
            
            public function build() {
                return $this->subject('New Booking Created - Action Required')
                    ->view('emails.admin.new-booking-created', [
                        'booking' => $this->booking,
                        'parent' => $this->parent,
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
            'parent_name' => $this->parent->name,
            'student_name' => $this->booking->student->name,
        ];
    }
}
