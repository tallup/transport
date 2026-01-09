<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Models\Policy;
use App\Models\School;
use App\Models\Student;
use App\Models\PickupPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $students = $user->students()
            ->with(['school'])
            ->orderBy('created_at', 'desc')
            ->get();

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
}
