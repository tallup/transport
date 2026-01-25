<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class DailyActivitySummary extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $date,
        public $stats
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
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Daily Activity Summary - ' . $this->date->format('F d, Y'))
            ->view('emails.admin.daily-activity-summary', [
                'date' => $this->date,
                'stats' => $this->stats,
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
            'date' => $this->date->toDateString(),
            'stats' => $this->stats,
        ];
    }
}
