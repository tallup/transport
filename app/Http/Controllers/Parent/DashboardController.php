<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Student;
use App\Services\BookingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Auto-update booking statuses (activate pending bookings that have started)
        $bookingService = app(BookingService::class);
        $bookingService->updateBookingStatuses();
        
        $students = Student::where('parent_id', $user->id)->get();
            
        $bookings = Booking::whereIn('student_id', $students->pluck('id'))
            ->with(['student', 'route', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Active bookings: Include both 'pending' and 'active' status
        // Count all pending and active bookings regardless of date (parent wants to see all their active/pending bookings)
        $today = Carbon::today();
        $activeBookings = $bookings->filter(function ($booking) use ($today) {
            // Must be pending or active status
            if (!in_array($booking->status, ['pending', 'active'])) {
                return false;
            }
            
            // For pending bookings: include all pending bookings (they're waiting for payment or to start)
            // Don't filter by date - parent wants to see all pending bookings
            if ($booking->status === 'pending') {
                return true;
            }
            
            // For active bookings: include if not ended yet
            if ($booking->status === 'active') {
                $endDate = $booking->end_date ? Carbon::parse($booking->end_date) : null;
                // Only exclude if booking has a definite end date and it has passed
                if ($endDate && $today->gt($endDate)) {
                    return false; // Active booking has ended
                }
                return true; // Active booking is still valid
            }
            
            return false;
        });

        // Upcoming pickups calendar (next 14 days)
        $upcomingPickups = [];
        foreach ($activeBookings as $booking) {
            $startDate = Carbon::parse($booking->start_date);
            $endDate = $booking->end_date ? Carbon::parse($booking->end_date) : $today->copy()->addMonths(6);
            
            for ($date = $today->copy(); $date <= $today->copy()->addDays(14) && $date <= $endDate; $date->addDay()) {
                if ($date >= $startDate) {
                    $upcomingPickups[] = [
                        'date' => $date->format('Y-m-d'),
                        'date_label' => $date->format('M d'),
                        'student' => $booking->student->name,
                        'route' => $booking->route->name ?? 'N/A',
                        'pickup_point' => $booking->pickupPoint->name ?? 'N/A',
                        'pickup_time' => $booking->pickupPoint->pickup_time ?? 'N/A',
                    ];
                }
            }
        }
        usort($upcomingPickups, function ($a, $b) {
            return strcmp($a['date'], $b['date']);
        });
        $upcomingPickups = array_slice($upcomingPickups, 0, 10); // Limit to 10

        // Payment history (simplified - would need actual payment data)
        $paymentHistory = [
            [
                'date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'amount' => 150.00,
                'status' => 'paid',
                'description' => 'Monthly subscription',
            ],
            [
                'date' => Carbon::now()->subDays(35)->format('Y-m-d'),
                'amount' => 150.00,
                'status' => 'paid',
                'description' => 'Monthly subscription',
            ],
        ];

        // Transport history
        $transportHistory = $bookings->take(10)->map(function ($booking) {
            return [
                'id' => $booking->id,
                'student' => $booking->student->name,
                'route' => $booking->route->name ?? 'N/A',
                'status' => $booking->status,
                'start_date' => $booking->start_date ? Carbon::parse($booking->start_date)->format('M d, Y') : 'N/A',
                'end_date' => $booking->end_date ? Carbon::parse($booking->end_date)->format('M d, Y') : 'Ongoing',
            ];
        });

        // Notifications
        $notifications = [
            [
                'type' => 'info',
                'message' => 'Your booking is active',
                'time' => Carbon::now()->subHours(2)->diffForHumans(),
            ],
            [
                'type' => 'success',
                'message' => 'Payment processed successfully',
                'time' => Carbon::now()->subDays(5)->diffForHumans(),
            ],
        ];

        return Inertia::render('Parent/Dashboard', [
            'students' => $students,
            'bookings' => $bookings,
            'activeBookings' => $activeBookings->values()->all(), // Convert to array for Inertia
            'activeBookingsCount' => $activeBookings->count(), // Explicit count for frontend
            'upcomingPickups' => $upcomingPickups,
            'paymentHistory' => $paymentHistory,
            'transportHistory' => $transportHistory,
            'notifications' => $notifications,
        ]);
    }
}
