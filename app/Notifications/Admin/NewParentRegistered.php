<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewParentRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $parent
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Parent Registration - On-Time Transportation')
            ->view('emails.admin.new-parent-registered', [
                'parent' => $this->parent,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'parent_id' => $this->parent->id,
            'parent_name' => $this->parent->name,
            'parent_email' => $this->parent->email,
        ];
    }
}
