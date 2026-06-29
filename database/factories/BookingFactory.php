<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\PickupPoint;
use App\Models\Route;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $route = Route::factory();

        return [
            'student_id' => Student::factory(),
            'route_id' => $route,
            'pickup_point_id' => PickupPoint::factory()->for($route, 'route'),
            'plan_type' => 'monthly',
            'status' => Booking::STATUS_ACTIVE,
            'start_date' => now()->subMonth()->toDateString(),
            'end_date' => now()->addMonth()->toDateString(),
        ];
    }

    public function expiredByDate(): static
    {
        return $this->state(fn () => [
            'status' => Booking::STATUS_ACTIVE,
            'start_date' => now()->subMonths(2)->toDateString(),
            'end_date' => now()->subDay()->toDateString(),
        ]);
    }
}
