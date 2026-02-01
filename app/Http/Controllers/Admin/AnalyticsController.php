<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Route;
use App\Services\AnalyticsService;
use App\Services\ReportExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    protected $analyticsService;
    protected $reportExportService;

    public function __construct(AnalyticsService $analyticsService, ReportExportService $reportExportService)
    {
        $this->analyticsService = $analyticsService;
        $this->reportExportService = $reportExportService;
    }

    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));

        $revenueTrends = $this->analyticsService->getRevenueTrends(
            Carbon::parse($startDate),
            Carbon::parse($endDate)
        );

        $revenueSummary = $this->analyticsService->getRevenueSummary(
            Carbon::parse($startDate),
            Carbon::parse($endDate)
        );

        $capacityUtilization = $this->analyticsService->getCapacityUtilization();
        $driverMetrics = $this->analyticsService->getDriverPerformanceMetrics();
        $routeMetrics = $this->analyticsService->getRouteEfficiencyMetrics();

        return Inertia::render('Admin/Analytics/Dashboard', [
            'revenueTrends' => $revenueTrends,
            'revenueSummary' => $revenueSummary,
            'capacityUtilization' => $capacityUtilization,
            'driverMetrics' => $driverMetrics,
            'routeMetrics' => $routeMetrics,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    /**
     * Get revenue metrics API endpoint.
     */
    public function revenueMetrics(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));
        $groupBy = $request->get('group_by', 'day');

        $trends = $this->analyticsService->getRevenueTrends(
            Carbon::parse($startDate),
            Carbon::parse($endDate),
            $groupBy
        );

        return response()->json([
            'success' => true,
            'data' => $trends,
        ]);
    }

    /**
     * Get capacity utilization metrics API endpoint.
     */
    public function capacityMetrics(Request $request)
    {
        $utilization = $this->analyticsService->getCapacityUtilization();

        return response()->json([
            'success' => true,
            'data' => $utilization,
        ]);
    }

    /**
     * Get driver performance metrics API endpoint.
     */
    public function driverMetrics(Request $request, ?User $driver = null)
    {
        $startDate = $request->get('start_date') 
            ? Carbon::parse($request->get('start_date')) 
            : Carbon::now()->subDays(30);
        
        $endDate = $request->get('end_date') 
            ? Carbon::parse($request->get('end_date')) 
            : Carbon::now();

        $driverId = $driver ? $driver->id : $request->get('driver_id');

        $metrics = $this->analyticsService->getDriverPerformanceMetrics(
            $driverId,
            $startDate,
            $endDate
        );

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }

    /**
     * Get route efficiency metrics API endpoint.
     */
    public function routeMetrics(Request $request, ?Route $route = null)
    {
        $routeId = $route ? $route->id : $request->get('route_id');

        $metrics = $this->analyticsService->getRouteEfficiencyMetrics($routeId);

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }

    /**
     * Export report.
     */
    public function exportReport(Request $request)
    {
        $request->validate([
            'type' => 'required|in:revenue,capacity,driver,route',
            'format' => 'required|in:pdf,excel',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'driver_id' => 'nullable|exists:users,id',
            'route_id' => 'nullable|exists:routes,id',
        ]);

        $filters = $request->only(['start_date', 'end_date', 'driver_id', 'route_id', 'group_by']);
        $type = $request->get('type');
        $format = $request->get('format');

        try {
            $filename = match ($type) {
                'revenue' => $this->reportExportService->exportRevenueReport($format, $filters),
                'capacity' => $this->reportExportService->exportCapacityReport($format),
                'driver' => $this->reportExportService->exportDriverPerformanceReport(
                    $filters['driver_id'] ?? null,
                    $format,
                    $filters
                ),
                'route' => $this->reportExportService->exportCustomReport($type, $filters, $format),
            };

            $url = Storage::url($filename);

            return response()->json([
                'success' => true,
                'url' => $url,
                'filename' => $filename,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export report: ' . $e->getMessage(),
            ], 500);
        }
    }
}
