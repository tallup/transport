<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            [
                'type' => 'bus',
                'license_plate' => 'BUS-001',
                'registration_number' => 'REG-BUS-001',
                'make' => 'Blue Bird',
                'model' => 'All American',
                'year' => 2020,
                'capacity' => 50,
                'last_maintenance_date' => now()->subMonths(1),
                'next_maintenance_date' => now()->addMonths(2),
                'status' => 'active',
            ],
            [
                'type' => 'bus',
                'license_plate' => 'BUS-002',
                'registration_number' => 'REG-BUS-002',
                'make' => 'Thomas',
                'model' => 'Saf-T-Liner',
                'year' => 2021,
                'capacity' => 48,
                'last_maintenance_date' => now()->subWeeks(2),
                'next_maintenance_date' => now()->addMonths(3),
                'status' => 'active',
            ],
            [
                'type' => 'van',
                'license_plate' => 'VAN-001',
                'registration_number' => 'REG-VAN-001',
                'make' => 'Ford',
                'model' => 'Transit',
                'year' => 2022,
                'capacity' => 15,
                'last_maintenance_date' => now()->subMonths(2),
                'next_maintenance_date' => now()->addMonths(1),
                'status' => 'active',
            ],
            [
                'type' => 'van',
                'license_plate' => 'VAN-002',
                'registration_number' => 'REG-VAN-002',
                'make' => 'Chevrolet',
                'model' => 'Express',
                'year' => 2021,
                'capacity' => 15,
                'last_maintenance_date' => now()->subDays(10),
                'next_maintenance_date' => now()->addMonths(2),
                'status' => 'active',
            ],
            [
                'type' => 'bus',
                'license_plate' => 'BUS-003',
                'registration_number' => 'REG-BUS-003',
                'make' => 'IC Bus',
                'model' => 'CE Series',
                'year' => 2019,
                'capacity' => 52,
                'last_maintenance_date' => now()->subDays(5),
                'next_maintenance_date' => now()->addMonths(1),
                'status' => 'maintenance',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::firstOrCreate(
                ['license_plate' => $vehicle['license_plate']],
                $vehicle
            );
        }
    }
}
