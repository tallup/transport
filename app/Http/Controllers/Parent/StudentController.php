<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function create()
    {
        return Inertia::render('Parent/Students/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'school' => 'required|string|max:255',
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
