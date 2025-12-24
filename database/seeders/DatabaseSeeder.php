<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            VehicleSeeder::class,
            RouteSeeder::class,
            PickupPointSeeder::class,
            PricingRuleSeeder::class,
            CalendarEventSeeder::class,
            StudentSeeder::class,
            BookingSeeder::class,
        ]);
    }
}
