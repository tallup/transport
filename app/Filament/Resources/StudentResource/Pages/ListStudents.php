<?php

namespace App\Filament\Resources\StudentResource\Pages;

use App\Exports\StudentsExport;
use App\Filament\Resources\StudentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;

class ListStudents extends ListRecords
{
    protected static string $resource = StudentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('export')
                ->label('Export')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn () => Excel::download(new StudentsExport, 'students-' . now()->format('Y-m-d') . '.xlsx')),
        ];
    }

    protected function getTableQuery(): Builder
    {
        return parent::getTableQuery()->with(['parent', 'school']);
    }
}
