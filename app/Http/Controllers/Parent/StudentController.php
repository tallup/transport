<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function create()
    {
        $schools = School::where('active', true)->orderBy('name')->get();
        return Inertia::render('Parent/Students/Create', [
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'nullable|date',
            'emergency_phone' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $student = $user->students()->create($validated);

        return redirect()->route('parent.dashboard')
            ->with('success', 'Student added successfully!');
    }
}
