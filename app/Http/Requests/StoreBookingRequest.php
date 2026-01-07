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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'pickup_address' => 'nullable|string|max:500',
            'pickup_latitude' => 'nullable|numeric|between:-90,90',
            'pickup_longitude' => 'nullable|numeric|between:-180,180',
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,semester,annual',
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
            'student_id.required' => 'Please select a student.',
            'student_id.exists' => 'The selected student is invalid.',
            'route_id.required' => 'Please select a route.',
            'route_id.exists' => 'The selected route is invalid.',
            'pickup_point_id.exists' => 'The selected pickup point is invalid.',
            'pickup_address.max' => 'The pickup address must not exceed 500 characters.',
            'pickup_latitude.between' => 'The pickup latitude must be between -90 and 90.',
            'pickup_longitude.between' => 'The pickup longitude must be between -180 and 180.',
            'plan_type.required' => 'Please select a plan type.',
            'plan_type.in' => 'The selected plan type is invalid.',
            'start_date.required' => 'Please select a start date.',
            'start_date.date' => 'The start date must be a valid date.',
            'start_date.after_or_equal' => 'The start date must be today or in the future.',
        ];
    }
}
