<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
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
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Transport Booking Confirmed')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your transport booking has been confirmed.')
            ->line('Student: ' . $this->booking->student->name)
            ->line('Route: ' . $this->booking->route->name)
            ->line('Pickup Point: ' . $this->booking->pickupPoint->name)
            ->line('Plan: ' . ucfirst(str_replace('_', '-', $this->booking->plan_type)))
            ->action('View Booking', url('/parent/dashboard'))
            ->line('Thank you for using our transport service!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
