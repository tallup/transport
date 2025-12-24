<?php

namespace Database\Seeders;

use App\Models\PickupPoint;
use App\Models\Route;
use Illuminate\Database\Seeder;

class PickupPointSeeder extends Seeder
{
    public function run(): void
    {
        $routes = Route::where('active', true)->get();

        foreach ($routes as $index => $route) {
            $pickupPoints = [
                [
                    'route_id' => $route->id,
                    'name' => 'Main Street & Oak Avenue',
                    'address' => '123 Main Street, Intersection with Oak Avenue',
                    'latitude' => 40.7128 + ($index * 0.1),
                    'longitude' => -74.0060 + ($index * 0.1),
                    'sequence_order' => 1,
                    'pickup_time' => '07:00:00',
                    'dropoff_time' => '15:30:00',
                ],
                [
                    'route_id' => $route->id,
                    'name' => 'Park Plaza Shopping Center',
                    'address' => '456 Park Avenue, Near Shopping Center',
                    'latitude' => 40.7130 + ($index * 0.1),
                    'longitude' => -74.0062 + ($index * 0.1),
                    'sequence_order' => 2,
                    'pickup_time' => '07:15:00',
                    'dropoff_time' => '15:45:00',
                ],
                [
                    'route_id' => $route->id,
                    'name' => 'Community Center',
                    'address' => '789 Elm Street, Community Center Parking Lot',
                    'latitude' => 40.7132 + ($index * 0.1),
                    'longitude' => -74.0064 + ($index * 0.1),
                    'sequence_order' => 3,
                    'pickup_time' => '07:30:00',
                    'dropoff_time' => '16:00:00',
                ],
                [
                    'route_id' => $route->id,
                    'name' => 'Library Entrance',
                    'address' => '321 Maple Drive, Public Library Entrance',
                    'latitude' => 40.7134 + ($index * 0.1),
                    'longitude' => -74.0066 + ($index * 0.1),
                    'sequence_order' => 4,
                    'pickup_time' => '07:45:00',
                    'dropoff_time' => '16:15:00',
                ],
            ];

            foreach ($pickupPoints as $point) {
                PickupPoint::firstOrCreate(
                    [
                        'route_id' => $point['route_id'],
                        'name' => $point['name'],
                    ],
                    $point
                );
            }
        }
    }
}
