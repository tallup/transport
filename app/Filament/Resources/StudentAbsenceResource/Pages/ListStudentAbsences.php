<?php

namespace App\Filament\Resources\StudentAbsenceResource\Pages;

use App\Filament\Resources\StudentAbsenceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStudentAbsences extends ListRecords
{
    protected static string $resource = StudentAbsenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
