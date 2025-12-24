<?php

namespace Database\Seeders;

use App\Models\Route;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class RouteSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('role', 'driver')->get();
        $vehicles = Vehicle::all();

        $routes = [
            [
                'name' => 'Route A - North District',
                'driver_id' => $drivers->first()?->id,
                'vehicle_id' => $vehicles->where('type', 'bus')->first()?->id,
                'capacity' => 50,
                'active' => true,
            ],
            [
                'name' => 'Route B - South District',
                'driver_id' => $drivers->skip(1)->first()?->id,
                'vehicle_id' => $vehicles->where('type', 'bus')->skip(1)->first()?->id,
                'capacity' => 48,
                'active' => true,
            ],
            [
                'name' => 'Route C - East District',
                'driver_id' => $drivers->skip(2)->first()?->id,
                'vehicle_id' => $vehicles->where('type', 'van')->first()?->id,
                'capacity' => 15,
                'active' => true,
            ],
            [
                'name' => 'Route D - West District',
                'driver_id' => null,
                'vehicle_id' => $vehicles->where('type', 'van')->skip(1)->first()?->id,
                'capacity' => 15,
                'active' => false,
            ],
        ];

        foreach ($routes as $route) {
            if ($route['vehicle_id']) {
                Route::firstOrCreate(
                    ['name' => $route['name']],
                    $route
                );
            }
        }
    }
}
