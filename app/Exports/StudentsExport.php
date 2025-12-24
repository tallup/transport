<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Student::with('parent')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'School',
            'Date of Birth',
            'Emergency Contact Name',
            'Emergency Phone',
            'Parent Name',
            'Parent Email',
            'Created At',
        ];
    }

    public function map($student): array
    {
        return [
            $student->id,
            $student->name,
            $student->school,
            $student->date_of_birth?->format('Y-m-d'),
            $student->emergency_contact_name,
            $student->emergency_phone,
            $student->parent->name,
            $student->parent->email,
            $student->created_at->format('Y-m-d H:i:s'),
        ];
    }
}

