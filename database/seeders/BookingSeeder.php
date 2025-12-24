<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Route;
use App\Models\Student;
use App\Services\BookingService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();
        $routes = Route::where('active', true)->with('pickupPoints')->get();

        if ($students->isEmpty() || $routes->isEmpty()) {
            $this->command->warn('No students or routes found. Please run StudentSeeder and RouteSeeder first.');
            return;
        }

        $bookingService = app(BookingService::class);
        $today = Carbon::today();

        // Create some active bookings
        $activeBookings = [
            [
                'student_id' => $students->first()->id,
                'route_id' => $routes->first()->id,
                'pickup_point_id' => $routes->first()->pickupPoints->first()->id,
                'plan_type' => 'monthly',
                'status' => 'active',
                'start_date' => $today->copy()->subDays(10),
            ],
            [
                'student_id' => $students->skip(1)->first()->id,
                'route_id' => $routes->first()->id,
                'pickup_point_id' => $routes->first()->pickupPoints->skip(1)->first()->id,
                'plan_type' => 'weekly',
                'status' => 'active',
                'start_date' => $today->copy()->subDays(5),
            ],
            [
                'student_id' => $students->skip(2)->first()->id,
                'route_id' => $routes->skip(1)->first()->id,
                'pickup_point_id' => $routes->skip(1)->first()->pickupPoints->first()->id,
                'plan_type' => 'semester',
                'status' => 'active',
                'start_date' => $today->copy()->subMonths(2),
            ],
        ];

        foreach ($activeBookings as $bookingData) {
            $startDate = Carbon::parse($bookingData['start_date']);
            $endDate = $bookingService->calculateEndDate($bookingData['plan_type'], $startDate);

            Booking::firstOrCreate(
                [
                    'student_id' => $bookingData['student_id'],
                    'route_id' => $bookingData['route_id'],
                    'status' => 'active',
                ],
                array_merge($bookingData, [
                    'end_date' => $endDate?->format('Y-m-d'),
                ])
            );
        }

        // Create a pending booking
        Booking::firstOrCreate(
            [
                'student_id' => $students->skip(3)->first()->id,
                'route_id' => $routes->first()->id,
                'status' => 'pending',
            ],
            [
                'pickup_point_id' => $routes->first()->pickupPoints->skip(2)->first()->id,
                'plan_type' => 'bi_weekly',
                'start_date' => $today->copy()->addDays(3),
                'end_date' => $bookingService->calculateEndDate('bi_weekly', $today->copy()->addDays(3))?->format('Y-m-d'),
            ]
        );
    }
}
