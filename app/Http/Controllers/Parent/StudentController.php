<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Models\Booking;
use App\Models\Policy;
use App\Models\School;
use App\Models\Student;
use App\Models\PickupPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $students = $user->students()
            ->with(['school', 'route', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Load active bookings for all students in one query to avoid N+1
        $studentIds = $students->pluck('id');
        $activeBookings = collect();
        
        if ($studentIds->isNotEmpty()) {
            $activeBookings = Booking::whereIn('student_id', $studentIds)
                ->where('status', 'active')
                ->with(['route', 'pickupPoint', 'dropoffPoint'])
                ->orderBy('start_date', 'desc')
                ->get()
                ->groupBy('student_id');
        }

        // Map active bookings to students
        $students = $students->map(function ($student) use ($activeBookings) {
            $student->active_booking = $activeBookings->get($student->id)?->first();
            return $student;
        });

        return Inertia::render('Parent/Students/Index', [
            'students' => $students,
        ]);
    }

    public function create()
    {
        // Redirect to complete enrollment form
        return redirect()->route('parent.students.enroll');
    }

    public function enroll()
    {
        $schools = School::where('active', true)->orderBy('name')->get();
        $policies = Policy::active()->ordered()->get()->groupBy('category');

        return Inertia::render('Parent/Students/Enroll', [
            'schools' => $schools,
            'policies' => $policies,
        ]);
    }

    public function store(StoreStudentRequest $request)
    {
        $validated = $request->validated();
        
        // Sanitize text inputs to prevent XSS
        $textFields = ['name', 'home_address', 'grade', 'emergency_phone', 'emergency_contact_name', 
                      'emergency_contact_2_name', 'emergency_contact_2_phone', 'emergency_contact_2_relationship',
                      'doctor_name', 'doctor_phone', 'medical_notes', 'special_instructions'];
        
        foreach ($textFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = strip_tags($validated[$field]);
            }
        }
        
        // Sanitize authorized pickup persons
        if (isset($validated['authorized_pickup_persons']) && is_array($validated['authorized_pickup_persons'])) {
            foreach ($validated['authorized_pickup_persons'] as &$person) {
                if (isset($person['name'])) {
                    $person['name'] = strip_tags($person['name']);
                }
                if (isset($person['relationship'])) {
                    $person['relationship'] = strip_tags($person['relationship']);
                }
                if (isset($person['phone'])) {
                    $person['phone'] = strip_tags($person['phone']);
                }
            }
        }

        $user = $request->user();

        // Handle signature timestamps
        if (!empty($validated['authorization_to_transport_signature'])) {
            $validated['authorization_to_transport_signed_at'] = now();
        }
        if (!empty($validated['payment_agreement_signature'])) {
            $validated['payment_agreement_signed_at'] = now();
        }
        if (!empty($validated['liability_waiver_signature'])) {
            $validated['liability_waiver_signed_at'] = now();
        }

        // Ensure authorized_pickup_persons is properly formatted as JSON
        if (isset($validated['authorized_pickup_persons']) && is_array($validated['authorized_pickup_persons'])) {
            $validated['authorized_pickup_persons'] = array_values(array_filter($validated['authorized_pickup_persons'], function($person) {
                return !empty($person['name']);
            }));
        }

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = 'student_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $validated['profile_picture'] = $file->storeAs('profile-pictures', $filename, 'public');
        } else {
            unset($validated['profile_picture']);
        }

        $student = $user->students()->create($validated);

        // If route & pickup point provided ensure consistency
        if (!empty($validated['route_id']) && !empty($validated['pickup_point_id'])) {
            $pp = PickupPoint::find($validated['pickup_point_id']);
            if ($pp && $pp->route_id != $validated['route_id']) {
                // rollback created student and return error
                $student->delete();
                return redirect()->back()->withInput()->withErrors(['pickup_point_id' => 'Selected pickup point does not belong to the selected route.']);
            }
        }

        return redirect()->route('parent.dashboard')
            ->with('success', 'Student enrolled successfully!');
    }

    public function edit(Request $request, Student $student)
    {
        $user = $request->user();

        // Ensure the student belongs to this parent
        if ($student->parent_id !== $user->id) {
            abort(403, 'You do not have permission to edit this student.');
        }

        $student->load('school');
        $schools = School::where('active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Parent/Students/Edit', [
            'student' => $student,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $user = $request->user();

        // Ensure the student belongs to this parent
        if ($student->parent_id !== $user->id) {
            abort(403, 'You do not have permission to edit this student.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'nullable|date',
            'home_address' => 'nullable|string',
            'grade' => 'nullable|string|max:50',
            'emergency_phone' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_2_name' => 'nullable|string|max:255',
            'emergency_contact_2_phone' => 'nullable|string|max:255',
            'emergency_contact_2_relationship' => 'nullable|string|max:255',
            'doctor_name' => 'nullable|string|max:255',
            'doctor_phone' => 'nullable|string|max:255',
            'medical_notes' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'authorized_pickup_persons' => 'nullable|array',
            'authorized_pickup_persons.*.name' => 'required_with:authorized_pickup_persons|string|max:255',
            'authorized_pickup_persons.*.relationship' => 'nullable|string|max:255',
            'authorized_pickup_persons.*.phone' => 'nullable|string|max:255',
        ]);

        // Sanitize text inputs
        $textFields = ['name', 'home_address', 'grade', 'emergency_phone', 'emergency_contact_name',
            'emergency_contact_2_name', 'emergency_contact_2_phone', 'emergency_contact_2_relationship',
            'doctor_name', 'doctor_phone', 'medical_notes', 'special_instructions'];
        foreach ($textFields as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = strip_tags($validated[$field]);
            }
        }
        if (isset($validated['authorized_pickup_persons']) && is_array($validated['authorized_pickup_persons'])) {
            foreach ($validated['authorized_pickup_persons'] as &$person) {
                if (isset($person['name'])) $person['name'] = strip_tags($person['name']);
                if (isset($person['relationship'])) $person['relationship'] = strip_tags($person['relationship']);
                if (isset($person['phone'])) $person['phone'] = strip_tags($person['phone']);
            }
            $validated['authorized_pickup_persons'] = array_values(array_filter($validated['authorized_pickup_persons'], fn($p) => !empty($p['name'])));
        }

        if ($request->hasFile('profile_picture')) {
            if ($student->profile_picture) {
                Storage::disk('public')->delete($student->profile_picture);
            }
            $file = $request->file('profile_picture');
            $filename = 'student_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $validated['profile_picture'] = $file->storeAs('profile-pictures', $filename, 'public');
        } else {
            unset($validated['profile_picture']);
        }

        $student->update($validated);

        return redirect()->route('parent.students.index')
            ->with('success', 'Student details updated successfully.');
    }
}
