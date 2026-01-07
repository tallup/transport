<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('parent')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
        ]);
    }

    public function create()
    {
        $parents = User::where('role', 'parent')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        
        $schools = \App\Models\School::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Students/Create', [
            'parents' => $parents,
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        // Authorization check
        if (!$request->user()->can('create', Student::class)) {
            abort(403, 'Unauthorized to create students.');
        }
        
        $validated = $request->validate([
            'parent_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'required|date',
            'emergency_phone' => 'required|string|max:20',
            'emergency_contact_name' => 'required|string|max:255',
        ]);

        Student::create($validated);

        return redirect()->route('admin.students.index')
            ->with('success', 'Student created successfully.');
    }

    public function show(Student $student)
    {
        $student->load('parent', 'bookings.route', 'bookings.pickupPoint');

        return Inertia::render('Admin/Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        $student->load('school');
        
        $parents = User::where('role', 'parent')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        
        $schools = \App\Models\School::where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Students/Edit', [
            'student' => $student,
            'parents' => $parents,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        // Authorization check
        if (!$request->user()->can('update', $student)) {
            abort(403, 'Unauthorized to update this student.');
        }
        
        $validated = $request->validate([
            'parent_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'required|date',
            'emergency_phone' => 'required|string|max:20',
            'emergency_contact_name' => 'required|string|max:255',
        ]);

        $student->update($validated);

        return redirect()->route('admin.students.index')
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(Request $request, Student $student)
    {
        // Authorization check
        if (!$request->user()->can('delete', $student)) {
            abort(403, 'Unauthorized to delete this student.');
        }
        
        $student->delete();

        return redirect()->route('admin.students.index')
            ->with('success', 'Student deleted successfully.');
    }
}
