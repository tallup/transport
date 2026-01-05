<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Policy;
use App\Models\School;
use App\Models\Student;
use App\Models\Route as TransportRoute;
use App\Models\PickupPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function create()
    {
        // Redirect to complete enrollment form
        return redirect()->route('parent.students.enroll');
    }

    public function enroll()
    {
        $schools = School::where('active', true)->orderBy('name')->get();
        $policies = Policy::active()->ordered()->get()->groupBy('category');
        
        // Load active routes with their pickup points and associated schools
        $routes = TransportRoute::with(['pickupPoints', 'schools'])->where('active', true)->get();

        return Inertia::render('Parent/Students/Enroll', [
            'schools' => $schools,
            'policies' => $policies,
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Basic Information
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'date_of_birth' => 'nullable|date',
            'home_address' => 'nullable|string',
            'grade' => 'nullable|string|max:50',
            
            // Emergency Contacts
            'emergency_phone' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_2_name' => 'nullable|string|max:255',
            'emergency_contact_2_phone' => 'nullable|string|max:255',
            'emergency_contact_2_relationship' => 'nullable|string|max:255',
            
            // Medical Information
            'doctor_name' => 'nullable|string|max:255',
            'doctor_phone' => 'nullable|string|max:255',
            'medical_notes' => 'nullable|string',
            
            // Authorized Pickup Persons
            'authorized_pickup_persons' => 'nullable|array',
            'authorized_pickup_persons.*.name' => 'required_with:authorized_pickup_persons|string|max:255',
            'authorized_pickup_persons.*.relationship' => 'nullable|string|max:255',
            'authorized_pickup_persons.*.phone' => 'nullable|string|max:255',
            
            // Additional Information
            'special_instructions' => 'nullable|string',
            
            // Signatures
            'authorization_to_transport_signature' => 'nullable|string|max:255',
            'payment_agreement_signature' => 'nullable|string|max:255',
            'liability_waiver_signature' => 'nullable|string|max:255',
            // Optional transport assignment
            'route_id' => 'nullable|exists:routes,id',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'policies_acknowledged' => 'nullable|boolean',
        ]);

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
