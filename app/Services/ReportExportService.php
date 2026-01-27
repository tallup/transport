<?php

namespace App\Services;

use App\Services\AnalyticsService;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class ReportExportService
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Export revenue report.
     *
     * @param string $format 'pdf' or 'excel'
     * @param array $filters
     * @return string Path to exported file
     */
    public function exportRevenueReport(string $format, array $filters = []): string
    {
        $report = $this->analyticsService->generateReport('revenue', $filters);

        if ($format === 'pdf') {
            return $this->exportToPdf('revenue', $report);
        } else {
            return $this->exportToExcel('revenue', $report);
        }
    }

    /**
     * Export driver performance report.
     *
     * @param int|null $driverId
     * @param string $format
     * @param array $filters
     * @return string
     */
    public function exportDriverPerformanceReport(?int $driverId, string $format, array $filters = []): string
    {
        if ($driverId) {
            $filters['driver_id'] = $driverId;
        }

        $report = $this->analyticsService->generateReport('driver', $filters);

        if ($format === 'pdf') {
            return $this->exportToPdf('driver', $report);
        } else {
            return $this->exportToExcel('driver', $report);
        }
    }

    /**
     * Export capacity utilization report.
     *
     * @param string $format
     * @return string
     */
    public function exportCapacityReport(string $format): string
    {
        $report = $this->analyticsService->generateReport('capacity');

        if ($format === 'pdf') {
            return $this->exportToPdf('capacity', $report);
        } else {
            return $this->exportToExcel('capacity', $report);
        }
    }

    /**
     * Export custom report.
     *
     * @param string $type
     * @param array $filters
     * @param string $format
     * @return string
     */
    public function exportCustomReport(string $type, array $filters, string $format): string
    {
        $report = $this->analyticsService->generateReport($type, $filters);

        if ($format === 'pdf') {
            return $this->exportToPdf($type, $report);
        } else {
            return $this->exportToExcel($type, $report);
        }
    }

    /**
     * Export report to PDF.
     *
     * @param string $type
     * @param array $report
     * @return string
     */
    protected function exportToPdf(string $type, array $report): string
    {
        $pdf = Pdf::loadView("reports.{$type}-pdf", [
            'report' => $report,
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ]);

        $filename = "reports/{$type}-report-" . now()->format('Y-m-d-His') . '.pdf';
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
     * Export report to Excel.
     *
     * @param string $type
     * @param array $report
     * @return string
     */
    protected function exportToExcel(string $type, array $report): string
    {
        $exportClass = "App\\Exports\\{$type}ReportExport";
        
        if (!class_exists($exportClass)) {
            // Create a generic export class
            $exportClass = GenericReportExport::class;
        }

        $filename = "reports/{$type}-report-" . now()->format('Y-m-d-His') . '.xlsx';
        $path = storage_path('app/public/' . $filename);

        // Ensure directory exists
        $directory = dirname($path);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        Excel::store(new $exportClass($report), $filename, 'public');

        return $filename;
    }
}




