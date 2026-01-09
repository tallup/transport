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
        // Use ComprehensiveSeeder to seed all tables with proper relationships
        // This creates: 5 schools, 10 parents, 50 students, 8 vehicles, 8 drivers, 8 routes, etc.
        $this->call([
            ComprehensiveSeeder::class,
        ]);
        
        // Alternative: Use individual seeders if you need more control
        // Uncomment the lines below and comment out ComprehensiveSeeder if needed
        /*
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
        */
    }
}
