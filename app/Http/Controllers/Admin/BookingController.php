<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
use App\Models\Student;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['student.parent', 'route', 'pickupPoint', 'dropoffPoint'])
            ->select([
                'id', 'student_id', 'route_id', 'pickup_point_id', 'dropoff_point_id',
                'pickup_address', 'plan_type', 'trip_type',
                'status', 'start_date', 'end_date', 'created_at', 'updated_at'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create()
    {
        $students = Student::with('parent')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);
        
        $routes = Route::where('active', true)
            ->with('pickupPoints')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Bookings/Create', [
            'students' => $students,
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        // Authorization check
        if (!$request->user()->can('create', Booking::class)) {
            abort(403, 'Unauthorized to create bookings.');
        }
        
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'required|exists:pickup_points,id',
            'dropoff_point_id' => 'nullable|exists:pickup_points,id',
            'plan_type' => 'required|in:weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
            'status' => 'required|in:pending,active,completed,expired,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        // Auto-calculate end date if not provided
        if (empty($validated['end_date']) && !empty($validated['start_date']) && !empty($validated['plan_type'])) {
            $bookingService = app(BookingService::class);
            $endDate = $bookingService->calculateEndDate(
                $validated['plan_type'],
                \Carbon\Carbon::parse($validated['start_date'])
            );
            $validated['end_date'] = $endDate?->format('Y-m-d');
        }

        Booking::create($validated);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    public function edit(Booking $booking)
    {
        $booking->load(['student.parent', 'route.pickupPoints', 'pickupPoint', 'dropoffPoint']);
        
        $students = Student::with('parent')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);
        
        $routes = Route::where('active', true)
            ->with('pickupPoints')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'students' => $students,
            'routes' => $routes,
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        // Authorization check
        if (!$request->user()->can('update', $booking)) {
            abort(403, 'Unauthorized to update this booking.');
        }
        
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'required|exists:pickup_points,id',
            'dropoff_point_id' => 'nullable|exists:pickup_points,id',
            'plan_type' => 'required|in:weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
            'status' => 'required|in:pending,active,completed,expired,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        // Auto-calculate end date if not provided
        if (empty($validated['end_date']) && !empty($validated['start_date']) && !empty($validated['plan_type'])) {
            $bookingService = app(BookingService::class);
            $endDate = $bookingService->calculateEndDate(
                $validated['plan_type'],
                \Carbon\Carbon::parse($validated['start_date'])
            );
            $validated['end_date'] = $endDate?->format('Y-m-d');
        }

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        // Authorization check
        if (!$request->user()->can('delete', $booking)) {
            abort(403, 'Unauthorized to delete this booking.');
        }
        
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }
}
