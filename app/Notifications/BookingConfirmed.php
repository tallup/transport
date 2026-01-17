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
    public function toMail(object $notifiable): Mailable
    {
        $invoiceService = app(InvoiceService::class);
        
        // Generate PDFs
        $invoicePath = $invoiceService->generateInvoice($this->booking);
        $receiptPath = $invoiceService->generateReceipt($this->booking);
        
        $invoiceFullPath = storage_path('app/public/' . $invoicePath);
        $receiptFullPath = storage_path('app/public/' . $receiptPath);
        
        return (new class($this->booking, $invoiceFullPath, $receiptFullPath) extends Mailable {
            public $booking;
            public $invoicePath;
            public $receiptPath;
            
            public function __construct($booking, $invoicePath, $receiptPath) {
                $this->booking = $booking;
                $this->invoicePath = $invoicePath;
                $this->receiptPath = $receiptPath;
            }
            
            public function build() {
                $mail = $this->subject('Transport Booking Confirmed')
                    ->view('emails.booking-confirmed', [
                        'booking' => $this->booking,
                        'user' => $this->booking->student->parent,
                    ]);
                
                // Attach PDFs if they exist
                if (file_exists($this->invoicePath)) {
                    $mail->attach($this->invoicePath, [
                        'as' => 'invoice-' . $this->booking->id . '.pdf',
                        'mime' => 'application/pdf',
                    ]);
                }
                
                if (file_exists($this->receiptPath)) {
                    $mail->attach($this->receiptPath, [
                        'as' => 'receipt-' . $this->booking->id . '.pdf',
                        'mime' => 'application/pdf',
                    ]);
                }
                
                return $mail;
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
            //
        ];
    }
}
