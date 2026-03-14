<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    protected ?string $status;
    protected ?string $routeId;
    protected ?string $schoolId;
    protected ?string $dateFrom;
    protected ?string $dateTo;

    public function __construct(
        ?string $status = null,
        ?string $routeId = null,
        ?string $schoolId = null,
        ?string $dateFrom = null,
        ?string $dateTo = null
    ) {
        $this->status = $status;
        $this->routeId = $routeId;
        $this->schoolId = $schoolId;
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
    }

    public function collection()
    {
        $query = Booking::with(['student.school', 'route', 'pickupPoint']);

        if ($this->status) {
            $query->where('status', $this->status);
        }

        if ($this->routeId) {
            $query->where('route_id', $this->routeId);
        }

        if ($this->schoolId) {
            $query->whereHas('student', function ($q) {
                $q->where('school_id', $this->schoolId);
            });
        }

        if ($this->dateFrom) {
            $query->whereDate('start_date', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $query->whereDate('end_date', '<=', $this->dateTo);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Student Name',
            'School',
            'Route Name',
            'Pickup Point',
            'Plan Type',
            'Trip Type',
            'Status',
            'Start Date',
            'End Date',
            'Payment Method',
            'Created At',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->student->name ?? 'N/A',
            $booking->student->school->name ?? 'N/A',
            $booking->route->name ?? 'N/A',
            $booking->pickupPoint->name ?? 'Custom Address',
            ucfirst(str_replace('_', ' ', $booking->plan_type)),
            ucfirst(str_replace('_', ' ', $booking->trip_type ?? 'N/A')),
            ucfirst($booking->status),
            $booking->start_date?->format('Y-m-d'),
            $booking->end_date?->format('Y-m-d'),
            ucfirst($booking->payment_method ?? 'N/A'),
            $booking->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
