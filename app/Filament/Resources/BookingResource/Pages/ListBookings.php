<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Exports\BookingsExport;
use App\Filament\Resources\BookingResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Facades\Excel;

class ListBookings extends ListRecords
{
    protected static string $resource = BookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('export')
                ->label('Export')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn () => Excel::download(new BookingsExport, 'bookings-' . now()->format('Y-m-d') . '.xlsx')),
        ];
    }
}
