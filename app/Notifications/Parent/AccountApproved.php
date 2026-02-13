<?php

namespace App\Notifications\Parent;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $user
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $loginUrl = url('/login');

        return (new MailMessage)
            ->subject('Your Account Has Been Approved - On-Time Transportation')
            ->greeting('Hello ' . $this->user->name . ',')
            ->line('Your parent account has been approved by an administrator.')
            ->line('You can now log in to access the school transport system and manage your children\'s transportation.')
            ->action('Log In', $loginUrl)
            ->line('Thank you for registering!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your account has been approved.',
        ];
    }
}
