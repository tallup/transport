<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $loginUrl = url('/login');

        return (new MailMessage)
            ->subject('Welcome to On-Time Transportation!')
            ->view('emails.welcome', [
                'user' => $notifiable,
                'loginUrl' => $loginUrl,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Welcome! Your account has been created.',
        ];
    }
}
