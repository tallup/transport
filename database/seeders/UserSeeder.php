<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::firstOrCreate(
            ['email' => 'admin@transport.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        // Transport Admin
        User::firstOrCreate(
            ['email' => 'transport@transport.com'],
            [
                'name' => 'Transport Admin',
                'password' => Hash::make('password'),
                'role' => 'transport_admin',
                'email_verified_at' => now(),
            ]
        );

        // Drivers
        $drivers = [
            ['name' => 'John Driver', 'email' => 'john.driver@transport.com'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@transport.com'],
            ['name' => 'Mike Johnson', 'email' => 'mike.johnson@transport.com'],
        ];

        foreach ($drivers as $driver) {
            User::firstOrCreate(
                ['email' => $driver['email']],
                [
                    'name' => $driver['name'],
                    'password' => Hash::make('password'),
                    'role' => 'driver',
                    'email_verified_at' => now(),
                ]
            );
        }

        // Parents
        $parents = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson@example.com'],
            ['name' => 'David Brown', 'email' => 'david.brown@example.com'],
            ['name' => 'Emily Davis', 'email' => 'emily.davis@example.com'],
            ['name' => 'Michael Wilson', 'email' => 'michael.wilson@example.com'],
            ['name' => 'Jessica Martinez', 'email' => 'jessica.martinez@example.com'],
        ];

        foreach ($parents as $parent) {
            User::firstOrCreate(
                ['email' => $parent['email']],
                [
                    'name' => $parent['name'],
                    'password' => Hash::make('password'),
                    'role' => 'parent',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
