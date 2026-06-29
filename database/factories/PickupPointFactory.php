<?php

namespace Database\Factories;

use App\Models\PickupPoint;
use App\Models\Route;
use Illuminate\Database\Eloquent\Factories\Factory;

class PickupPointFactory extends Factory
{
    protected $model = PickupPoint::class;

    public function definition(): array
    {
        return [
            'route_id' => Route::factory(),
            'name' => $this->faker->streetName(),
            'address' => $this->faker->address(),
            'sequence_order' => 1,
            'pickup_time' => '07:00:00',
            'dropoff_time' => '15:00:00',
        ];
    }
}
