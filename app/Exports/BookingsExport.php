<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Booking::with(['student', 'route', 'pickupPoint'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Student Name',
            'Route Name',
            'Pickup Point',
            'Plan Type',
            'Status',
            'Start Date',
            'End Date',
            'Created At',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->student->name,
            $booking->route->name,
            $booking->pickupPoint->name,
            ucfirst(str_replace('_', '-', $booking->plan_type)),
            ucfirst($booking->status),
            $booking->start_date->format('Y-m-d'),
            $booking->end_date?->format('Y-m-d'),
            $booking->created_at->format('Y-m-d H:i:s'),
        ];
    }
}

