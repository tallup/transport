<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company().' School',
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'active' => true,
        ];
    }
}
