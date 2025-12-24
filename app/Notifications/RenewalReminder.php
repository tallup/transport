<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RenewalReminder extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public $booking
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Transport Renewal Reminder')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a reminder that your transport subscription will renew in 7 days.')
            ->line('Student: ' . $this->booking->student->name)
            ->line('Plan: ' . ucfirst(str_replace('_', '-', $this->booking->plan_type)))
            ->line('Please ensure your payment method is up to date.')
            ->action('Manage Booking', url('/parent/bookings'))
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
