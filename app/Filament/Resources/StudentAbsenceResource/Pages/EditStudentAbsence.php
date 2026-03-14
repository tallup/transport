<?php

namespace App\Filament\Resources\StudentAbsenceResource\Pages;

use App\Filament\Resources\StudentAbsenceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStudentAbsence extends EditRecord
{
    protected static string $resource = StudentAbsenceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
