<?php

namespace App\Notifications;

use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class BookingConfirmed extends Notification implements ShouldQueue
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
        $invoiceService = app(InvoiceService::class);
        
        // Generate PDFs
        $invoicePath = $invoiceService->generateInvoice($this->booking);
        $receiptPath = $invoiceService->generateReceipt($this->booking);
        
        $invoiceFullPath = storage_path('app/public/' . $invoicePath);
        $receiptFullPath = storage_path('app/public/' . $receiptPath);
        
        $message = (new MailMessage)
            ->subject('Payment Received - Booking Pending Approval')
            ->view('emails.booking-confirmed', [
                'booking' => $this->booking,
                'user' => $notifiable,
            ]);

        // Attach PDFs if they exist
        if (file_exists($invoiceFullPath)) {
            $message->attach($invoiceFullPath, [
                'as' => 'invoice-' . $this->booking->id . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }
        
        if (file_exists($receiptFullPath)) {
            $message->attach($receiptFullPath, [
                'as' => 'receipt-' . $this->booking->id . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $message;
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
