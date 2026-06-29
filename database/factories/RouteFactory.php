<?php

namespace Database\Factories;

use App\Models\Route;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class RouteFactory extends Factory
{
    protected $model = Route::class;

    public function definition(): array
    {
        return [
            'name' => 'Route '.$this->faker->unique()->numberBetween(1, 99999),
            'capacity' => 16,
            'active' => true,
            'vehicle_id' => Vehicle::factory(),
        ];
    }
}
