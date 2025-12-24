<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Route;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['student.parent', 'route', 'pickupPoint'])
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
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'required|exists:pickup_points,id',
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,semester,annual',
            'status' => 'required|in:pending,active,expired,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        Booking::create($validated);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    public function edit(Booking $booking)
    {
        $booking->load(['student.parent', 'route.pickupPoints', 'pickupPoint']);
        
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
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'required|exists:pickup_points,id',
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,semester,annual',
            'status' => 'required|in:pending,active,expired,cancelled',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }
}
