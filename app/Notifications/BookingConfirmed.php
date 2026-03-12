<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class BookingConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    /** @var array<Booking> */
    public array $bookings;

    public function __construct(
        Booking|array|Collection $bookingOrBookings,
        public ?float $amountPaid = null,
        public ?string $paymentMethod = null,
        public ?\DateTimeInterface $paymentDate = null,
        public ?string $paymentReference = null,
    ) {
        $this->bookings = collect($bookingOrBookings)->values()->all();
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        foreach ($this->bookings as $b) {
            $b->loadMissing(['student.parent', 'student.school', 'route.vehicle', 'pickupPoint']);
        }

        $attachments = [];
        try {
            $invoiceService = app(InvoiceService::class);
            $paymentDetails = [
                'amount_paid' => $this->amountPaid,
                'method' => $this->paymentMethod,
                'date' => $this->paymentDate,
                'reference' => $this->paymentReference,
            ];
            foreach ($this->bookings as $booking) {
                $invoicePath = $invoiceService->generateInvoice($booking);
                $receiptPath = $invoiceService->generateReceipt($booking, $paymentDetails);
                $invPath = storage_path('app/public/' . $invoicePath);
                $recPath = storage_path('app/public/' . $receiptPath);
                if (file_exists($invPath)) {
                    $attachments[] = ['path' => $invPath, 'as' => 'invoice-' . $booking->id . '.pdf'];
                }
                if (file_exists($recPath)) {
                    $attachments[] = ['path' => $recPath, 'as' => 'receipt-' . $booking->id . '.pdf'];
                }
            }
        } catch (\Throwable $e) {
            \Log::warning('BookingConfirmed: PDF generation failed', [
                'booking_ids' => array_map(fn ($b) => $b->id, $this->bookings),
                'error' => $e->getMessage(),
            ]);
        }

        $subject = count($this->bookings) > 1
            ? 'Payment Received - ' . count($this->bookings) . ' Bookings Confirmed'
            : 'Payment Received - Booking Confirmed';

        $message = (new MailMessage)
            ->subject($subject)
            ->view('emails.booking-confirmed', [
                'bookings' => $this->bookings,
                'user' => $notifiable,
                'amountPaid' => $this->amountPaid,
                'paymentMethod' => $this->paymentMethod,
                'paymentDate' => $this->paymentDate,
                'paymentReference' => $this->paymentReference,
            ]);

        foreach ($attachments as $att) {
            $message->attach($att['path'], ['as' => $att['as'], 'mime' => 'application/pdf']);
        }

        return $message;
    }

    public function toArray(object $notifiable): array
    {
        $n = count($this->bookings);
        return [
            'type' => 'success',
            'message' => $n > 1
                ? "Payment processed successfully. Your {$n} bookings are now active."
                : 'Payment processed successfully. Your booking is now active.',
            'booking_id' => $this->bookings[0]->id ?? null,
            'booking_ids' => array_map(fn ($b) => $b->id, $this->bookings),
        ];
    }
}
