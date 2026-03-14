<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentAbsence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    /**
     * Display a listing of the student absences.
     */
    public function index(Request $request)
    {
        $absences = StudentAbsence::with(['student.parent', 'booking.route'])
            ->orderBy('absence_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Absences/Index', [
            'absences' => $absences,
        ]);
    }

    /**
     * Remove the specified absence report.
     */
    public function destroy(StudentAbsence $absence)
    {
        $absence->delete();

        return redirect()->back()->with('success', 'Absence report deleted successfully.');
    }
}
