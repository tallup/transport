<?php

namespace App\Filament\Resources\StudentAbsenceResource\Pages;

use App\Filament\Resources\StudentAbsenceResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageStudentAbsences extends ManageRecords
{
    protected static string $resource = StudentAbsenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
