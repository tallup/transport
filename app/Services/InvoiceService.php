<?php

namespace App\Services;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    /**
     * Generate PDF invoice for a booking.
     *
     * @param Booking $booking
     * @return string Path to the generated PDF file
     */
    public function generateInvoice(Booking $booking): string
    {
        $booking->load(['student', 'route', 'pickupPoint', 'student.school']);
        
        $pdf = Pdf::loadView('invoices.booking-invoice', [
            'booking' => $booking,
        ]);

        $filename = 'invoices/invoice-' . $booking->id . '-' . now()->format('Y-m-d') . '.pdf';
        $path = storage_path('app/public/' . $filename);
        
        // Ensure directory exists
        $directory = dirname($path);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $pdf->save($path);

        return $filename;
    }

    /**
     * Generate PDF receipt for a booking.
     *
     * @param Booking $booking
     * @return string Path to the generated PDF file
     */
    public function generateReceipt(Booking $booking): string
    {
        $booking->load(['student', 'route', 'pickupPoint', 'student.school']);
        
        $pdf = Pdf::loadView('invoices.booking-receipt', [
            'booking' => $booking,
        ]);

        $filename = 'invoices/receipt-' . $booking->id . '-' . now()->format('Y-m-d') . '.pdf';
        $path = storage_path('app/public/' . $filename);
        
        // Ensure directory exists
        $directory = dirname($path);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $pdf->save($path);

        return $filename;
    }

    /**
     * Get the public URL for an invoice/receipt file.
     *
     * @param string $filename
     * @return string
     */
    public function getPublicUrl(string $filename): string
    {
        return Storage::url($filename);
    }
}


