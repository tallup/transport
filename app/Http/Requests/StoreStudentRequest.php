<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Basic Information
            'name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
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
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Student name is required.',
            'school_id.required' => 'Please select a school.',
            'school_id.exists' => 'The selected school is invalid.',
            'emergency_phone.required' => 'Emergency contact phone is required.',
            'emergency_contact_name.required' => 'Emergency contact name is required.',
            'authorized_pickup_persons.*.name.required_with' => 'Authorized pickup person name is required.',
        ];
    }
}
