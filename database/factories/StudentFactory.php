<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'parent_id' => User::factory()->state(['role' => 'parent']),
            'name' => $this->faker->name(),
            'school_id' => School::factory(),
            'emergency_phone' => '0712345678',
            'emergency_contact_name' => $this->faker->name(),
        ];
    }
}
