<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\DailyPickup;
use App\Models\Route;
use App\Models\RouteCompletion;
use App\Models\StudentAbsence;
use App\Services\DriverRouteService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RosterController extends Controller
{
    protected DriverRouteService $driverRouteService;

    public function __construct(DriverRouteService $driverRouteService)
    {
        $this->driverRouteService = $driverRouteService;
    }
    // All shared driver logic (getDriverRouteData, getActiveRoute, getRoutePeriod,
    // areAllBookingsCompleted) now lives in App\Services\DriverRouteService.

    public function index(Request $request)
    {
        $driver = $request->user();
        $today = Carbon::today();
        $todayFormatted = $today->format('Y-m-d');

        $requestedPeriod = $request->query('period');
        $routeData = $this->driverRouteService->getDriverRouteData($driver);

        // Get the active route (always use today's date)
        $selectedRoute = $this->driverRouteService->getActiveRoute($driver, $requestedPeriod, $routeData);

        if (!$selectedRoute) {
            return Inertia::render('Driver/Roster', [
                'route' => null,
                'date' => $todayFormatted,
                'isSchoolDay' => false,
                'groupedBookings' => [],
                'currentPeriod' => null,
                'availablePeriods' => [
                    'am' => false,
                    'pm' => false,
                ],
                'routeCompletion' => [
                    'am' => false,
                    'pm' => false,
                ],
                'canCompleteRoute' => false,
                'isRouteCompleted' => false,
                'message' => 'No active route assigned to you.',
            ]);
        }

        // Determine the period for this route
        $routePeriod = $this->driverRouteService->getRoutePeriod($selectedRoute);

        // Check if route is completed today for this period
        $isRouteCompleted = RouteCompletion::where('route_id', $selectedRoute->id)
            ->where('driver_id', $driver->id)
            ->whereDate('completion_date', $today)
            ->where('period', $routePeriod)
            ->exists();

        // Check if all bookings are completed for this period
        $canCompleteRoute = $this->driverRouteService->areAllBookingsCompleted($selectedRoute, $routePeriod) && !$isRouteCompleted;

        // Check if it's a school day
        $isSchoolDay = !CalendarEvent::where('date', $todayFormatted)
            ->whereIn('type', ['holiday', 'closure'])
            ->exists();

        $groupedBookings = [];

        if ($isSchoolDay) {
            // Get active bookings for today (within their booking period)
            // Only show 'active' bookings on routes (not 'pending' - those haven't been paid yet)
            // This ensures bookings are visible for the entire duration they're valid
            $bookings = Booking::where('route_id', $selectedRoute->id)
                ->where('status', \App\Models\Booking::STATUS_ACTIVE)
                ->whereDate('start_date', '<=', $today)
                ->where(function ($query) use ($today) {
                    $query->whereNull('end_date')
                        ->orWhereDate('end_date', '>=', $today);
                })
                ->with(['student.school', 'pickupPoint', 'dailyPickups' => function ($query) use ($today, $routePeriod) {
                    $query->whereDate('pickup_date', $today)
                        ->where('period', $routePeriod);
                }, 'absences' => function ($query) use ($today, $routePeriod) {
                    $query->whereDate('absence_date', $today)
                        ->whereIn('period', [$routePeriod, 'both']);
                }])
                ->get();

            // Group all active bookings by pickup address (custom address or legacy pickup point address)
            $groupedBookings = $bookings->filter(function ($booking) {
                return $booking->student !== null;
            })
            ->groupBy(function ($booking) {
                return trim($booking->pickup_address ?? $booking->pickupPoint?->address ?? '') ?: 'Address not set';
            })
            ->map(function ($bookings, $address) use ($selectedRoute, $today, $routePeriod) {
                return [
                    'pickup_point' => [
                        'id' => null,
                        'name' => 'Pickup Location',
                        'address' => $address,
                        'pickup_time' => $selectedRoute->pickup_time ? (is_string($selectedRoute->pickup_time) ? substr($selectedRoute->pickup_time, 0, 5) : $selectedRoute->pickup_time->format('H:i')) : 'TBD',
                        'dropoff_time' => $selectedRoute->dropoff_time ? (is_string($selectedRoute->dropoff_time) ? substr($selectedRoute->dropoff_time, 0, 5) : $selectedRoute->dropoff_time->format('H:i')) : null,
                        'sequence_order' => 999,
                    ],
                    'bookings' => $bookings->sortBy(function ($booking) {
                        return $booking->student ? $booking->student->name : '';
                    })->map(function ($booking) use ($today, $routePeriod) {
                        // Check if this booking has a daily pickup for today
                        $dailyPickup = $booking->dailyPickups->first();
                        $hasDailyPickup = $dailyPickup !== null;
                        
                        // Check for reported absence
                        $absence = $booking->absences->first();
                        
                        return [
                            'id' => $booking->id,
                            'status' => $booking->status,
                            'hasDailyPickup' => $hasDailyPickup,
                            'pickup_address' => $booking->pickup_address,
                            'pickupStatus' => $dailyPickup->status ?? ($absence ? 'absent' : null),
                            'arrivedAt' => $dailyPickup->arrived_at ?? null,
                            'completedAt' => $dailyPickup->completed_at ?? null,
                            'isAbsent' => $absence !== null,
                            'absenceId' => $absence?->id ?? null,
                            'absenceReason' => $absence?->reason ?? null,
                            'absenceAcknowledgedAt' => $absence?->acknowledged_at ?? null,
                            'student' => [
                                'id' => $booking->student->id,
                                'name' => $booking->student->name,
                                'school' => $booking->student->school->name ?? 'N/A',
                                'emergency_phone' => $booking->student->emergency_phone ?? null,
                                'grade' => $booking->student->grade ?? null,
                                'profile_picture_url' => $booking->student->profile_picture_url ?? null,
                            ],
                        ];
                    })->filter()->values(),
                ];
            })
            ->values()
            ->toArray();
        }

        return Inertia::render('Driver/Roster', [
            'route' => [
                'id' => $selectedRoute->id,
                'name' => $selectedRoute->name,
                'vehicle' => $selectedRoute->vehicle ? [
                    'make' => $selectedRoute->vehicle->make,
                    'model' => $selectedRoute->vehicle->model,
                    'license_plate' => $selectedRoute->vehicle->license_plate,
                ] : null,
            ],
            'date' => $todayFormatted,
            'isSchoolDay' => $isSchoolDay,
            'groupedBookings' => $groupedBookings,
            'currentPeriod' => $routePeriod,
            'availablePeriods' => [
                'am' => $routeData['amRoute'] ? true : false,
                'pm' => $routeData['pmRoute'] ? true : false,
            ],
            'routeCompletion' => [
                'am' => $routeData['amCompleted'],
                'pm' => $routeData['pmCompleted'],
            ],
            'canCompleteRoute' => $canCompleteRoute,
            'isRouteCompleted' => $isRouteCompleted,
        ]);
    }

    public function markComplete(Request $request, Booking $booking)
    {
        $driver = $request->user();
        $today = Carbon::today();

        // Verify the booking belongs to one of the driver's routes
        $driverRoutes = Route::where('driver_id', $driver->id)
            ->where('active', true)
            ->pluck('id')
            ->toArray();

        if (!in_array($booking->route_id, $driverRoutes)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This booking does not belong to your route.',
            ], 403);
        }

        // Verify booking is in a state that can be completed
        if (!in_array($booking->status, \App\Models\Booking::activeStatuses())) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending, awaiting approval, or active bookings can be marked as complete.',
            ], 400);
        }

        // Get the route to determine period
        $route = Route::find($booking->route_id);
        $period = $this->driverRouteService->getRoutePeriod($route);

        // Check if daily pickup already exists for today and period
        $existingPickup = DailyPickup::where('booking_id', $booking->id)
            ->whereDate('pickup_date', $today)
            ->where('period', $period)
            ->first();

        if ($existingPickup) {
            return response()->json([
                'success' => false,
                'message' => 'This pickup has already been marked as complete for today.',
            ], 400);
        }

        // Check if a record already exists for today and this period
        $dailyPickup = DailyPickup::where([
            'booking_id' => $booking->id,
            'pickup_date' => $today,
            'period' => $period,
        ])->first();

        $status = $request->input('status', DailyPickup::STATUS_COMPLETED);
        $action = $request->input('action'); // 'arrive', 'complete', 'no_show', etc.

        $data = [
            'booking_id' => $booking->id,
            'route_id' => $booking->route_id,
            'driver_id' => $driver->id,
            'pickup_date' => $today,
            'pickup_point_id' => $booking->pickup_point_id,
            'period' => $period,
            'status' => $status,
            'notes' => $request->input('notes'),
        ];

        if ($action === 'arrive') {
            $data['arrived_at'] = Carbon::now();
        } elseif ($action === 'complete' || !$action) {
            $data['completed_at'] = Carbon::now();
            if ($dailyPickup && !$dailyPickup->arrived_at) {
                // If they completed without marking arrival, maybe they arrived 1 min ago
                $data['arrived_at'] = Carbon::now()->subMinute();
            }
        }

        if ($dailyPickup) {
            $dailyPickup->update($data);
        } else {
            $dailyPickup = DailyPickup::create($data);
        }

        $pickupLocation = $booking->pickupPoint ? $booking->pickupPoint->name : ($booking->pickup_address ?? 'Custom Location');

        // Send notification only for actual completions
        if ($status === DailyPickup::STATUS_COMPLETED) {
            $parent = $booking->student?->parent;
            if ($parent && filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
                $parent->notify(new \App\Notifications\PickupCompleted(
                    $booking,
                    $pickupLocation,
                    $period,
                    $dailyPickup->completed_at
                ));
            }
            
            if ($parent) {
                $pushHelper = app(\App\Services\PushNotificationHelper::class);
                $title = $period === 'pm' ? 'Student Dropped Off' : 'Student Picked Up';
                $body = $period === 'pm' 
                    ? 'Your student has been safely dropped off at ' . $pickupLocation
                    : 'Your student has been picked up from ' . $pickupLocation;
                $pushHelper->sendIfSubscribed(
                    $parent,
                    $title,
                    $body,
                    ['type' => 'pickup_completed', 'booking_id' => $booking->id, 'period' => $period, 'url' => route('parent.bookings.show', $booking)]
                );
            }
        }

        // Notify admins of pickup/drop-off completion
        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\PickupCompletedAlert(
            $booking,
            $driver,
            $period,
            $dailyPickup->completed_at,
            $pickupLocation
        ));

        // Real-time: notify parent and admins
        $userIds = [];
        if ($parent) {
            $userIds[] = $parent->id;
        }
        $userIds = array_merge($userIds, $adminService->getAdmins()->pluck('id')->toArray());
        $userIds = array_unique(array_filter($userIds));
        if (!empty($userIds)) {
            event(new \App\Events\PortalUpdate(
                $userIds,
                'pickup_completed',
                $period === 'pm' ? 'Student dropped off.' : 'Student picked up.',
                ['booking_id' => $booking->id]
            ));
        }

        return response()->json([
            'success' => true,
            'message' => 'Pickup marked as complete successfully.',
        ]);
    }

    public function acknowledgeAbsence(Request $request, StudentAbsence $absence)
    {
        $driver = $request->user();
        
        // Verify authorship/authorization: absence booking route must belong to this driver
        if ($absence->booking->route->driver_id !== $driver->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $absence->update([
            'acknowledged_at' => now(),
        ]);

        // Notify parent
        $parent = $absence->student->parent;
        if ($parent) {
            try {
                $parent->notify(new \App\Notifications\Parent\AbsenceAcknowledged($absence));
            } catch (\Exception $e) {
                \Log::error('AbsenceAcknowledged notification failed', ['error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Absence acknowledged.',
            'acknowledged_at' => $absence->acknowledged_at->toIso8601String(),
        ]);
    }

    public function markPickupPointComplete(Request $request)
    {
        $driver = $request->user();
        
        $validated = $request->validate([
            'pickup_address' => 'required|string',
            'route_id' => 'required|exists:routes,id',
            'date' => 'required|date',
        ]);

        // Verify the route belongs to the driver
        $route = Route::where('id', $validated['route_id'])
            ->where('driver_id', $driver->id)
            ->where('active', true)
            ->first();

        if (!$route) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. This route does not belong to you.',
            ], 403);
        }

        // Get the period for this route
        $period = $this->driverRouteService->getRoutePeriod($route);

        // Get all active bookings for this pickup address on this date
        // Match either custom pickup_address or legacy pickupPoint->address
        $date = Carbon::parse($validated['date']);
        $address = $validated['pickup_address'];
        $bookings = Booking::where('route_id', $validated['route_id'])
            ->where('status', \App\Models\Booking::STATUS_ACTIVE)
            ->whereDate('start_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $date);
            })
            ->where(function ($query) use ($address) {
                $query->where('pickup_address', $address)
                    ->orWhereHas('pickupPoint', function ($q) use ($address) {
                        $q->where('address', $address);
                    });
            })
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active bookings found for this pickup location.',
            ], 404);
        }

        // Create daily pickup records for all bookings
        $createdCount = 0;
        $notifyUserIds = [];
        $adminService = app(\App\Services\AdminNotificationService::class);
        $bookings->each(function ($booking) use ($driver, $route, $date, $period, &$createdCount, &$notifyUserIds, $adminService) {
            // Check if daily pickup already exists
            $existingPickup = DailyPickup::where('booking_id', $booking->id)
                ->whereDate('pickup_date', $date)
                ->where('period', $period)
                ->first();

            if (!$existingPickup) {
                $dailyPickup = DailyPickup::create([
                    'booking_id' => $booking->id,
                    'route_id' => $booking->route_id,
                    'driver_id' => $driver->id,
                    'pickup_date' => $date,
                    'pickup_point_id' => $booking->pickup_point_id, // Still save this if it exists, though it likely won't
                    'period' => $period,
                    'completed_at' => Carbon::now(),
                ]);
                $createdCount++;

                // Send pickup completed notification to parent
                $pickupLocation = $booking->pickup_address ?? 'Custom Location';
                $parent = $booking->student?->parent;
                if ($parent) {
                    $notifyUserIds[] = $parent->id;
                    if (filter_var($parent->email, FILTER_VALIDATE_EMAIL)) {
                        $parent->notify(new \App\Notifications\PickupCompleted(
                            $booking,
                            $pickupLocation,
                            $period,
                            $dailyPickup->completed_at
                        ));
                    }
                }

                // Notify admins of pickup/drop-off completion
                $adminService->notifyAdmins(new \App\Notifications\Admin\PickupCompletedAlert(
                    $booking,
                    $driver,
                    $period,
                    $dailyPickup->completed_at,
                    $pickupLocation
                ));
            }
        });

        $notifyUserIds = array_unique(array_merge($notifyUserIds, $adminService->getAdmins()->pluck('id')->toArray()));
        if ($createdCount > 0 && !empty($notifyUserIds)) {
            event(new \App\Events\PortalUpdate(
                array_values($notifyUserIds),
                'pickup_completed',
                $period === 'pm' ? 'Student(s) dropped off.' : 'Student(s) picked up.',
                []
            ));
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully marked {$createdCount} pickup(s) as complete.",
            'count' => $createdCount,
        ]);
    }
}


