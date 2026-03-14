<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\StudentAbsence;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $studentIds = $user->students()->pluck('id');

        $absences = StudentAbsence::whereIn('student_id', $studentIds)
            ->with(['student', 'booking.route'])
            ->orderBy('absence_date', 'desc')
            ->paginate(15);

        return Inertia::render('Parent/Absences/Index', [
            'absences' => $absences,
        ]);
    }

    public function create(Request $request)
    {
        $user = auth()->user();
        $bookingId = $request->query('booking_id');
        
        $bookings = Booking::whereHas('student', function ($query) use ($user) {
                $query->where('parent_id', $user->id);
            })
            ->whereIn('status', Booking::activeStatuses())
            ->with(['student', 'route'])
            ->get();

        return Inertia::render('Parent/Absences/Create', [
            'bookings' => $bookings,
            'selectedBookingId' => $bookingId,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'absence_date' => 'required|date|after_or_equal:today',
            'period' => 'required|in:am,pm,both',
            'reason' => 'nullable|string|max:255',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);
        
        // Verify ownership
        if ($booking->student->parent_id !== auth()->id()) {
            abort(403);
        }

        $validated['student_id'] = $booking->student_id;
        $validated['reported_by'] = auth()->id();

        // Check for duplicate
        $exists = StudentAbsence::where('booking_id', $validated['booking_id'])
            ->where('absence_date', $validated['absence_date'])
            ->where('period', $validated['period'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['absence_date' => 'An absence report already exists for this date and period.']);
        }

        StudentAbsence::create($validated);

        return redirect()->route('parent.absences.index')
            ->with('success', 'Absence reported successfully. The driver will be notified.');
    }

    public function destroy(StudentAbsence $absence)
    {
        // Verify ownership
        if ($absence->student->parent_id !== auth()->id()) {
            abort(403);
        }

        // Only allow cancelling future absences
        if ($absence->absence_date->isPast() && !$absence->absence_date->isToday()) {
            return back()->withErrors(['error' => 'Cannot cancel past absence reports.']);
        }

        $absence->delete();

        return back()->with('success', 'Absence report cancelled.');
    }
}
