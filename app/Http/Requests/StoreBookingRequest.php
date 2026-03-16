<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Two way = both; one way requires pickup_only or dropoff_only.
     */
    protected function prepareForValidation(): void
    {
        if ($this->trip_type === 'two_way') {
            $this->merge(['trip_direction' => 'both']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => 'required_without:student_ids|exists:students,id',
            'student_ids' => 'required_without:student_id|array',
            'student_ids.*' => 'exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'pickup_address' => 'required|string|max:500',
            'pickup_latitude' => 'nullable|numeric|between:-90,90',
            'pickup_longitude' => 'nullable|numeric|between:-180,180',
            'plan_type' => 'required|in:weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
            'trip_direction' => 'required|in:pickup_only,dropoff_only,both',
            'start_date' => 'required|date|after_or_equal:today',
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
            'student_id.required_without' => 'Please select at least one student.',
            'student_id.exists' => 'The selected student is invalid.',
            'student_ids.required_without' => 'Please select at least one student.',
            'student_ids.array' => 'Selected students must be provided as a list.',
            'student_ids.*.exists' => 'One or more selected students are invalid.',
            'route_id.required' => 'Please select a route.',
            'route_id.exists' => 'The selected route is invalid.',
            'pickup_point_id.exists' => 'The selected pickup point is invalid.',
            'pickup_address.required' => 'Please enter the pickup address.',
            'pickup_address.max' => 'The pickup address must not exceed 500 characters.',
            'pickup_latitude.between' => 'The pickup latitude must be between -90 and 90.',
            'pickup_longitude.between' => 'The pickup longitude must be between -180 and 180.',
            'plan_type.required' => 'Please select a plan type.',
            'plan_type.in' => 'The selected plan type is invalid.',
            'trip_type.required' => 'Please select a trip type.',
            'trip_type.in' => 'The selected trip type is invalid.',
            'trip_direction.required' => 'Please select pickup only, dropoff only, or both.',
            'trip_direction.in' => 'The selected service type is invalid.',
            'start_date.required' => 'Please select a start date.',
            'start_date.date' => 'The start date must be a valid date.',
            'start_date.after_or_equal' => 'The start date must be today or in the future.',
        ];
    }
}
