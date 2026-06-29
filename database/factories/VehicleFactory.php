<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'type' => 'van',
            'license_plate' => 'PL-'.$this->faker->unique()->numberBetween(1000, 999999),
            'registration_number' => 'REG-'.$this->faker->unique()->numberBetween(1000, 999999),
            'make' => 'Toyota',
            'model' => 'Hiace',
            'year' => 2022,
            'capacity' => 16,
            'status' => 'active',
        ];
    }
}
