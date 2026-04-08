<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use App\Models\Student;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['parent', 'school'])
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
        if (! $request->user()->can('create', Student::class)) {
            abort(403, 'Unauthorized to create students.');
        }

        $validated = $request->validate([
            'parent_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'required|date',
            'emergency_phone' => 'required|string|max:20',
            'emergency_contact_name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,heic,bmp,svg|max:10240', // 10MB max
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $ext = preg_replace('/[^a-z0-9]/', '', strtolower($file->getClientOriginalExtension())) ?: 'jpg';
            $filename = 'student_'.time().'_'.\Illuminate\Support\Str::random(10).'.'.$ext;
            $validated['profile_picture'] = $file->storeAs('profile-pictures', $filename, 'public');
        } else {
            unset($validated['profile_picture']);
        }

        Student::create($validated);

        return redirect()->route('admin.students.index')
            ->with('success', 'Student created successfully.');
    }

    public function show(Student $student)
    {
        $this->authorize('view', $student);

        $student->load([
            'parent',
            'school',
            'route',
            'pickupPoint',
            'bookings.route',
            'bookings.pickupPoint',
            'absences.booking',
        ]);

        $policies = Policy::active()
            ->ordered()
            ->get()
            ->groupBy('category')
            ->map(fn ($items) => $items->values()->all())
            ->all();

        return Inertia::render('Admin/Students/Show', [
            'student' => $student,
            'policies' => $policies,
        ]);
    }

    public function pdf(Student $student)
    {
        $this->authorize('view', $student);

        $student->load([
            'parent',
            'school',
            'route',
            'pickupPoint',
            'bookings.route',
            'bookings.pickupPoint',
            'absences.booking',
        ]);

        $logoPath = public_path('logo.png');
        $logoDataUri = null;
        if (is_file($logoPath)) {
            $logoDataUri = 'data:image/png;base64,'.base64_encode((string) file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('admin.students.pdf', [
            'student' => $student,
            'logoDataUri' => $logoDataUri,
            'appName' => config('app.name'),
        ]);

        $filename = 'student-'.$student->id.'-'.Str::slug($student->name).'.pdf';

        return $pdf->download($filename);
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
        if (! $request->user()->can('update', $student)) {
            abort(403, 'Unauthorized to update this student.');
        }

        $validated = $request->validate([
            'parent_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'required|date',
            'emergency_phone' => 'required|string|max:20',
            'emergency_contact_name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,heic,bmp,svg|max:10240', // 10MB max
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($student->profile_picture) {
                Storage::disk('public')->delete($student->profile_picture);
            }
            $file = $request->file('profile_picture');
            $ext = preg_replace('/[^a-z0-9]/', '', strtolower($file->getClientOriginalExtension())) ?: 'jpg';
            $filename = 'student_'.time().'_'.\Illuminate\Support\Str::random(10).'.'.$ext;
            $validated['profile_picture'] = $file->storeAs('profile-pictures', $filename, 'public');
        } else {
            unset($validated['profile_picture']);
        }

        $student->update($validated);

        return redirect()->route('admin.students.index')
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(Request $request, Student $student)
    {
        // Authorization check
        if (! $request->user()->can('delete', $student)) {
            abort(403, 'Unauthorized to delete this student.');
        }

        $student->delete();

        return redirect()->route('admin.students.index')
            ->with('success', 'Student deleted successfully.');
    }
}
