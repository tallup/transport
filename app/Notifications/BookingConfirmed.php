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
        public $booking,
        public ?float $amountPaid = null,
        public ?string $paymentMethod = null,
        public ?\DateTimeInterface $paymentDate = null,
        public ?string $paymentReference = null,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $this->booking->loadMissing(['student.parent', 'student.school', 'route.vehicle', 'pickupPoint']);

        $invoiceService = app(InvoiceService::class);

        $paymentDetails = [
            'amount_paid' => $this->amountPaid,
            'method' => $this->paymentMethod,
            'date' => $this->paymentDate,
            'reference' => $this->paymentReference,
        ];

        $invoicePath = $invoiceService->generateInvoice($this->booking);
        $receiptPath = $invoiceService->generateReceipt($this->booking, $paymentDetails);

        $invoiceFullPath = storage_path('app/public/' . $invoicePath);
        $receiptFullPath = storage_path('app/public/' . $receiptPath);

        $message = (new MailMessage)
            ->subject('Payment Received - Booking Confirmed')
            ->view('emails.booking-confirmed', [
                'booking' => $this->booking,
                'user' => $notifiable,
                'amountPaid' => $this->amountPaid,
                'paymentMethod' => $this->paymentMethod,
                'paymentDate' => $this->paymentDate,
                'paymentReference' => $this->paymentReference,
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
            'type' => 'success',
            'message' => 'Payment processed successfully. Your booking is now active.',
            'booking_id' => $this->booking->id,
        ];
    }
}
