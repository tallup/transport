<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller/policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => 'sometimes|required|exists:students,id',
            'route_id' => 'sometimes|required|exists:routes,id',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'pickup_address' => 'nullable|string|max:500',
            'pickup_latitude' => 'nullable|numeric|between:-90,90',
            'pickup_longitude' => 'nullable|numeric|between:-180,180',
            'plan_type' => 'sometimes|required|in:weekly,monthly,academic_term,annual',
            'trip_type' => 'sometimes|required|in:one_way,two_way',
            'status' => 'sometimes|required|in:pending,awaiting_approval,active,cancelled,expired,completed',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
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
            'student_id.exists' => 'The selected student is invalid.',
            'route_id.exists' => 'The selected route is invalid.',
            'pickup_point_id.exists' => 'The selected pickup point is invalid.',
            'plan_type.in' => 'The selected plan type is invalid.',
            'status.in' => 'The selected status is invalid.',
            'end_date.after' => 'The end date must be after the start date.',
        ];
    }
}
