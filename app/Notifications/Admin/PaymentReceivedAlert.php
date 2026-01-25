<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class PaymentReceivedAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public $booking,
        public $amount,
        public $paymentMethod
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
            ->subject('Payment Received - Booking #' . $this->booking->id)
            ->view('emails.admin.payment-received-alert', [
                'booking' => $this->booking,
                'amount' => $this->amount,
                'paymentMethod' => $this->paymentMethod,
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
            'amount' => $this->amount,
            'payment_method' => $this->paymentMethod,
        ];
    }
}
