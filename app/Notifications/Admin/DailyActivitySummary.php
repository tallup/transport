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

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return (new class($this->date, $this->stats) extends Mailable {
            public $date;
            public $stats;
            
            public function __construct($date, $stats) {
                $this->date = $date;
                $this->stats = $stats;
            }
            
            public function build() {
                return $this->subject('Daily Activity Summary - ' . $this->date->format('F d, Y'))
                    ->view('emails.admin.daily-activity-summary', [
                        'date' => $this->date,
                        'stats' => $this->stats,
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
            'date' => $this->date->toDateString(),
            'stats' => $this->stats,
        ];
    }
}
