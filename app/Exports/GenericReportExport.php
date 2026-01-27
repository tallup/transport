<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class GenericReportExport implements FromArray, WithHeadings, WithTitle
{
    protected $report;

    public function __construct(array $report)
    {
        $this->report = $report;
    }

    public function array(): array
    {
        $data = $this->report['data'] ?? [];
        
        // Convert array of arrays to flat array format for Excel
        return array_map(function ($item) {
            return array_values($item);
        }, $data);
    }

    public function headings(): array
    {
        $data = $this->report['data'] ?? [];
        
        if (empty($data)) {
            return ['No Data'];
        }

        // Get keys from first item as headings
        return array_keys($data[0]);
    }

    public function title(): string
    {
        $type = $this->report['type'] ?? 'report';
        return ucfirst(str_replace('_', ' ', $type)) . ' Report';
    }
}




