<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\CalendarEvent;
use App\Models\PickupPoint;
use App\Models\PricingRule;
use App\Models\Route;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ComprehensiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Production safety check
        if (app()->environment('production')) {
            $this->command->warn('⚠️  WARNING: Running seeder in PRODUCTION environment!');
            $this->command->warn('⚠️  Make sure you have a database backup before proceeding!');
            
            if (!$this->command->confirm('Do you want to continue?', true)) {
                $this->command->info('Seeding cancelled.');
                return;
            }
            
            $this->command->warn('⚠️  ALL SEEDED USERS WILL HAVE PASSWORD: "password"');
            $this->command->warn('⚠️  CHANGE ALL PASSWORDS IMMEDIATELY AFTER SEEDING!');
        }
        
        $this->command->info('Starting comprehensive database seeding...');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // $this->truncateTables();

        // Seed in order of dependencies
        $schools = $this->seedSchools();
        $parents = $this->seedParents();
        $vehicles = $this->seedVehicles();
        $drivers = $this->seedDrivers();
        $routes = $this->seedRoutes($vehicles, $drivers, $schools);
        $pickupPoints = $this->seedPickupPoints($routes);
        $students = $this->seedStudents($parents, $schools, $routes, $pickupPoints);
        $this->seedPricingRules($routes, $vehicles);
        $this->seedCalendarEvents();
        $this->seedBookings($students, $routes, $pickupPoints);

        $this->command->info('✅ Comprehensive seeding completed successfully!');
        $this->command->info("Created: 5 schools, {$parents->count()} parents, {$students->count()} students, {$vehicles->count()} vehicles, {$drivers->count()} drivers, {$routes->count()} routes");
    }

    /**
     * Seed 5 schools
     */
    private function seedSchools()
    {
        $this->command->info('Seeding schools...');
        
        $schools = [
            [
                'name' => 'Lincoln Elementary School',
                'address' => '123 Education Avenue, Springfield',
                'phone' => '555-1001',
                'active' => true,
            ],
            [
                'name' => 'Roosevelt Middle School',
                'address' => '456 Learning Boulevard, Springfield',
                'phone' => '555-1002',
                'active' => true,
            ],
            [
                'name' => 'Washington High School',
                'address' => '789 Knowledge Street, Springfield',
                'phone' => '555-1003',
                'active' => true,
            ],
            [
                'name' => 'Jefferson Elementary School',
                'address' => '321 Wisdom Lane, Springfield',
                'phone' => '555-1004',
                'active' => true,
            ],
            [
                'name' => 'Madison Academy',
                'address' => '654 Scholar Drive, Springfield',
                'phone' => '555-1005',
                'active' => true,
            ],
        ];

        $createdSchools = collect();
        foreach ($schools as $school) {
            $createdSchools->push(School::firstOrCreate(
                ['name' => $school['name']],
                $school
            ));
        }

        return $createdSchools;
    }

    /**
     * Seed 10 parents
     */
    private function seedParents()
    {
        $this->command->info('Seeding parents...');
        
        $parents = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson@example.com', 'phone' => '555-2001'],
            ['name' => 'David Brown', 'email' => 'david.brown@example.com', 'phone' => '555-2002'],
            ['name' => 'Emily Davis', 'email' => 'emily.davis@example.com', 'phone' => '555-2003'],
            ['name' => 'Michael Wilson', 'email' => 'michael.wilson@example.com', 'phone' => '555-2004'],
            ['name' => 'Jessica Martinez', 'email' => 'jessica.martinez@example.com', 'phone' => '555-2005'],
            ['name' => 'Robert Taylor', 'email' => 'robert.taylor@example.com', 'phone' => '555-2006'],
            ['name' => 'Amanda Anderson', 'email' => 'amanda.anderson@example.com', 'phone' => '555-2007'],
            ['name' => 'Christopher Thomas', 'email' => 'christopher.thomas@example.com', 'phone' => '555-2008'],
            ['name' => 'Jennifer Jackson', 'email' => 'jennifer.jackson@example.com', 'phone' => '555-2009'],
            ['name' => 'Daniel White', 'email' => 'daniel.white@example.com', 'phone' => '555-2010'],
        ];

        $createdParents = collect();
        foreach ($parents as $parent) {
            $createdParents->push(User::firstOrCreate(
                ['email' => $parent['email']],
                [
                    'name' => $parent['name'],
                    'password' => Hash::make('password'),
                    'role' => 'parent',
                    'phone_numbers' => [$parent['phone']],
                    'email_verified_at' => now(),
                ]
            ));
        }

        return $createdParents;
    }

    /**
     * Seed vehicles (buses and vans)
     */
    private function seedVehicles()
    {
        $this->command->info('Seeding vehicles...');
        
        $vehicles = [
            ['type' => 'bus', 'license_plate' => 'BUS-001', 'make' => 'Blue Bird', 'model' => 'All American', 'year' => 2020, 'capacity' => 50],
            ['type' => 'bus', 'license_plate' => 'BUS-002', 'make' => 'Thomas', 'model' => 'Saf-T-Liner', 'year' => 2021, 'capacity' => 48],
            ['type' => 'bus', 'license_plate' => 'BUS-003', 'make' => 'IC Bus', 'model' => 'CE Series', 'year' => 2019, 'capacity' => 52],
            ['type' => 'van', 'license_plate' => 'VAN-001', 'make' => 'Ford', 'model' => 'Transit', 'year' => 2022, 'capacity' => 15],
            ['type' => 'van', 'license_plate' => 'VAN-002', 'make' => 'Chevrolet', 'model' => 'Express', 'year' => 2021, 'capacity' => 15],
            ['type' => 'van', 'license_plate' => 'VAN-003', 'make' => 'Mercedes', 'model' => 'Sprinter', 'year' => 2023, 'capacity' => 15],
            ['type' => 'bus', 'license_plate' => 'BUS-004', 'make' => 'Blue Bird', 'model' => 'Vision', 'year' => 2022, 'capacity' => 48],
            ['type' => 'bus', 'license_plate' => 'BUS-005', 'make' => 'Thomas', 'model' => 'HDX', 'year' => 2020, 'capacity' => 50],
        ];

        $createdVehicles = collect();
        foreach ($vehicles as $vehicle) {
            $createdVehicles->push(Vehicle::firstOrCreate(
                ['license_plate' => $vehicle['license_plate']],
                array_merge($vehicle, [
                    'registration_number' => 'REG-' . $vehicle['license_plate'],
                    'last_maintenance_date' => now()->subMonths(rand(1, 3)),
                    'next_maintenance_date' => now()->addMonths(rand(1, 3)),
                    'status' => 'active',
                ])
            ));
        }

        return $createdVehicles;
    }

    /**
     * Seed drivers
     */
    private function seedDrivers()
    {
        $this->command->info('Seeding drivers...');
        
        $drivers = [
            ['name' => 'John Driver', 'email' => 'john.driver@transport.com'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@transport.com'],
            ['name' => 'Mike Johnson', 'email' => 'mike.johnson@transport.com'],
            ['name' => 'Lisa Williams', 'email' => 'lisa.williams@transport.com'],
            ['name' => 'Tom Anderson', 'email' => 'tom.anderson@transport.com'],
            ['name' => 'Patricia Brown', 'email' => 'patricia.brown@transport.com'],
            ['name' => 'James Davis', 'email' => 'james.davis@transport.com'],
            ['name' => 'Mary Miller', 'email' => 'mary.miller@transport.com'],
        ];

        $createdDrivers = collect();
        foreach ($drivers as $driver) {
            $createdDrivers->push(User::firstOrCreate(
                ['email' => $driver['email']],
                [
                    'name' => $driver['name'],
                    'password' => Hash::make('password'),
                    'role' => 'driver',
                    'phone_numbers' => ['555-' . rand(3000, 3999)],
                    'email_verified_at' => now(),
                ]
            ));
        }

        return $createdDrivers;
    }

    /**
     * Seed routes connected to vehicles, drivers, and schools
     */
    private function seedRoutes($vehicles, $drivers, $schools)
    {
        $this->command->info('Seeding routes...');
        
        // Convert to values() to ensure proper sequential indexing
        $buses = $vehicles->where('type', 'bus')->values();
        $vans = $vehicles->where('type', 'van')->values();
        
        // Ensure we have enough vehicles and drivers
        if ($buses->count() < 5 || $vans->count() < 3 || $drivers->count() < 8) {
            $this->command->error('Not enough vehicles or drivers. Buses: ' . $buses->count() . ', Vans: ' . $vans->count() . ', Drivers: ' . $drivers->count());
            return collect();
        }
        
        $routes = [
            [
                'name' => 'Route A - North District',
                'driver_id' => $drivers->get(0)?->id,
                'vehicle_id' => $buses->get(0)?->id ?? null,
                'capacity' => 50,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:00:00',
                'dropoff_time' => '15:30:00',
                'schools' => [$schools->get(0)?->id, $schools->get(1)?->id], // Lincoln Elementary, Roosevelt Middle
            ],
            [
                'name' => 'Route B - South District',
                'driver_id' => $drivers->get(1)?->id,
                'vehicle_id' => $buses->get(1)?->id ?? null,
                'capacity' => 48,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:15:00',
                'dropoff_time' => '15:45:00',
                'schools' => [$schools->get(2)?->id], // Washington High
            ],
            [
                'name' => 'Route C - East District',
                'driver_id' => $drivers->get(2)?->id,
                'vehicle_id' => $vans->get(0)?->id ?? null,
                'capacity' => 15,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:30:00',
                'dropoff_time' => '16:00:00',
                'schools' => [$schools->get(3)?->id], // Jefferson Elementary
            ],
            [
                'name' => 'Route D - West District',
                'driver_id' => $drivers->get(3)?->id,
                'vehicle_id' => $vans->get(1)?->id ?? null,
                'capacity' => 15,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:45:00',
                'dropoff_time' => '16:15:00',
                'schools' => [$schools->get(4)?->id], // Madison Academy
            ],
            [
                'name' => 'Route E - Central District',
                'driver_id' => $drivers->get(4)?->id,
                'vehicle_id' => $buses->get(2)?->id ?? null,
                'capacity' => 52,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '08:00:00',
                'dropoff_time' => '16:30:00',
                'schools' => [$schools->get(0)?->id, $schools->get(2)?->id], // Lincoln Elementary, Washington High
            ],
            [
                'name' => 'Route F - Northeast District',
                'driver_id' => $drivers->get(5)?->id,
                'vehicle_id' => $vans->get(2)?->id ?? null,
                'capacity' => 15,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:00:00',
                'dropoff_time' => '15:30:00',
                'schools' => [$schools->get(1)?->id, $schools->get(3)?->id], // Roosevelt Middle, Jefferson Elementary
            ],
            [
                'name' => 'Route G - Southwest District',
                'driver_id' => $drivers->get(6)?->id,
                'vehicle_id' => $buses->get(3)?->id ?? null,
                'capacity' => 48,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:20:00',
                'dropoff_time' => '16:00:00',
                'schools' => [$schools->get(2)?->id, $schools->get(4)?->id], // Washington High, Madison Academy
            ],
            [
                'name' => 'Route H - Northwest District',
                'driver_id' => $drivers->get(7)?->id,
                'vehicle_id' => $buses->get(4)?->id ?? null,
                'capacity' => 50,
                'active' => true,
                'service_type' => 'both',
                'pickup_time' => '07:10:00',
                'dropoff_time' => '15:40:00',
                'schools' => [$schools->get(0)?->id, $schools->get(4)?->id], // Lincoln Elementary, Madison Academy
            ],
        ];

        $createdRoutes = collect();
        foreach ($routes as $routeData) {
            $schoolIds = $routeData['schools'];
            unset($routeData['schools']);
            
            // Skip if vehicle_id is null
            if (empty($routeData['vehicle_id'])) {
                $this->command->warn("Skipping route {$routeData['name']} - no vehicle assigned");
                continue;
            }
            
            $route = Route::firstOrCreate(
                ['name' => $routeData['name']],
                $routeData
            );
            
            // Attach schools to route
            if ($route && !empty($schoolIds)) {
                $route->schools()->sync($schoolIds);
            }
            
            $createdRoutes->push($route);
        }

        return $createdRoutes;
    }

    /**
     * Seed pickup points for routes
     */
    private function seedPickupPoints($routes)
    {
        $this->command->info('Seeding pickup points...');
        
        $pickupPointNames = [
            ['Main Street & Oak Avenue', '123 Main Street, Intersection with Oak Avenue'],
            ['Park Plaza Shopping Center', '456 Park Avenue, Near Shopping Center'],
            ['Community Center', '789 Elm Street, Community Center Parking Lot'],
            ['Library Entrance', '321 Maple Drive, Public Library Entrance'],
            ['City Hall', '654 Government Boulevard, City Hall Parking'],
            ['Sports Complex', '987 Athletic Way, Sports Complex Entrance'],
            ['Residential Complex A', '111 Housing Lane, Building A Entrance'],
            ['Residential Complex B', '222 Housing Lane, Building B Entrance'],
        ];

        $createdPickupPoints = collect();
        foreach ($routes->where('active', true) as $routeIndex => $route) {
            $numPoints = rand(4, 6); // 4-6 pickup points per route
            $selectedPoints = collect($pickupPointNames)->shuffle()->take($numPoints);
            
            foreach ($selectedPoints as $index => $point) {
                $latitude = 40.7128 + ($routeIndex * 0.1) + ($index * 0.01);
                $longitude = -74.0060 + ($routeIndex * 0.1) + ($index * 0.01);
                
                $pickupPoint = PickupPoint::firstOrCreate(
                    [
                        'route_id' => $route->id,
                        'name' => $point[0],
                    ],
                    [
                        'address' => $point[1],
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'sequence_order' => $index + 1,
                        'pickup_time' => Carbon::createFromTime(7, 0)->addMinutes($index * 15)->format('H:i:s'),
                        'dropoff_time' => Carbon::createFromTime(15, 30)->addMinutes($index * 15)->format('H:i:s'),
                    ]
                );
                
                $createdPickupPoints->push($pickupPoint);
            }
        }

        return $createdPickupPoints;
    }

    /**
     * Seed 50 students (5 per parent), connected to schools, routes, and pickup points
     */
    private function seedStudents($parents, $schools, $routes, $pickupPoints)
    {
        $this->command->info('Seeding students...');
        
        $firstNames = ['Emma', 'Noah', 'Olivia', 'Liam', 'Sophia', 'Mason', 'Ava', 'Ethan', 'Isabella', 'James', 
                      'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Michael',
                      'Abigail', 'Daniel', 'Emily', 'Matthew', 'Elizabeth', 'David', 'Sofia', 'Joseph', 'Avery', 'Jackson',
                      'Ella', 'Samuel', 'Madison', 'Sebastian', 'Scarlett', 'Aiden', 'Victoria', 'Owen', 'Aria', 'Wyatt',
                      'Grace', 'Carter', 'Chloe', 'Julian', 'Penelope', 'Luke', 'Layla', 'Grayson', 'Riley', 'Leo'];
        
        $lastNames = ['Johnson', 'Brown', 'Davis', 'Wilson', 'Martinez', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White',
                     'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
                     'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill'];
        
        $grades = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', 
                  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
        
        $createdStudents = collect();
        $studentCounter = 0;
        
        // Distribute students: 5 per parent = 50 total
        foreach ($parents as $parentIndex => $parent) {
            for ($i = 0; $i < 5; $i++) {
                $studentCounter++;
                $firstName = $firstNames[($parentIndex * 5 + $i) % count($firstNames)];
                $lastName = $lastNames[$parentIndex % count($lastNames)];
                $fullName = $firstName . ' ' . $lastName;
                
                // Distribute students across schools (10 per school)
                $school = $schools->get(($parentIndex * 5 + $i) % $schools->count());
                
                // Assign to a route that serves this school
                // Get routes that serve this school from the pivot table
                $schoolRouteIds = DB::table('route_school')
                    ->where('school_id', $school->id)
                    ->pluck('route_id')
                    ->toArray();
                
                $availableRoutes = $routes->filter(function($route) use ($schoolRouteIds) {
                    return in_array($route->id, $schoolRouteIds);
                });
                
                // Fallback to any active route if no routes serve this school yet
                $route = $availableRoutes->isNotEmpty() 
                    ? $availableRoutes->random() 
                    : $routes->where('active', true)->random() ?? $routes->first();
                
                // Get pickup points for this route
                $routePickupPoints = $pickupPoints->where('route_id', $route->id);
                $pickupPoint = $routePickupPoints->isNotEmpty() ? $routePickupPoints->random() : null;
                
                // Calculate date of birth (ages 5-18)
                $age = rand(5, 18);
                $dateOfBirth = now()->subYears($age)->subDays(rand(0, 365));
                
                $student = Student::firstOrCreate(
                    [
                        'parent_id' => $parent->id,
                        'name' => $fullName,
                    ],
                    [
                        'school_id' => $school->id,
                        'route_id' => $route->id,
                        'pickup_point_id' => $pickupPoint?->id,
                        'date_of_birth' => $dateOfBirth,
                        'grade' => $grades[min($age - 5, count($grades) - 1)],
                        'home_address' => rand(100, 9999) . ' ' . ['Main St', 'Oak Ave', 'Elm St', 'Maple Dr', 'Park Blvd'][rand(0, 4)] . ', Springfield',
                        'emergency_phone' => $parent->phone_numbers[0] ?? '555-' . rand(2000, 2999),
                        'emergency_contact_name' => $parent->name,
                        'emergency_contact_2_name' => rand(0, 1) ? ['Grandma ' . $lastName, 'Grandpa ' . $lastName, 'Aunt ' . $firstName][rand(0, 2)] : null,
                        'emergency_contact_2_phone' => rand(0, 1) ? '555-' . rand(3000, 3999) : null,
                        'emergency_contact_2_relationship' => rand(0, 1) ? ['Grandparent', 'Aunt', 'Uncle'][rand(0, 2)] : null,
                        'doctor_name' => rand(0, 1) ? 'Dr. ' . ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][rand(0, 4)] : null,
                        'doctor_phone' => rand(0, 1) ? '555-' . rand(4000, 4999) : null,
                        'medical_notes' => rand(0, 1) ? ['Allergic to peanuts', 'Asthma - uses inhaler', 'No known allergies', null][rand(0, 3)] : null,
                        'authorized_pickup_persons' => [
                            ['name' => 'Grandma ' . $lastName, 'relationship' => 'Grandmother', 'phone' => '555-' . rand(5000, 5999)],
                            ['name' => 'Uncle ' . $firstName, 'relationship' => 'Uncle', 'phone' => '555-' . rand(5000, 5999)],
                        ],
                        'special_instructions' => rand(0, 1) ? ['Please wait for parent at pickup', 'Student has special needs', null][rand(0, 2)] : null,
                        'authorization_to_transport_signed_at' => now()->subDays(rand(1, 30)),
                        'authorization_to_transport_signature' => $parent->name,
                        'payment_agreement_signed_at' => now()->subDays(rand(1, 30)),
                        'payment_agreement_signature' => $parent->name,
                        'liability_waiver_signed_at' => now()->subDays(rand(1, 30)),
                        'liability_waiver_signature' => $parent->name,
                    ]
                );
                
                $createdStudents->push($student);
            }
        }

        return $createdStudents;
    }

    /**
     * Seed pricing rules for routes and vehicle types
     */
    private function seedPricingRules($routes, $vehicles)
    {
        $this->command->info('Seeding pricing rules...');
        
        // Check database driver - SQLite might still use 'semester' instead of 'academic_term'
        $driverName = DB::connection()->getDriverName();
        $termPlanType = ($driverName === 'sqlite') ? 'semester' : 'academic_term';
        
        $planTypes = ['weekly', 'bi_weekly', 'monthly', $termPlanType, 'annual'];
        $basePrices = [
            'weekly' => 50,
            'bi_weekly' => 90,
            'monthly' => 180,
            $termPlanType => 500,
            'annual' => 1800,
        ];
        
        $vehicleTypeMultipliers = [
            'bus' => 1.0,
            'van' => 1.2, // Vans are slightly more expensive
        ];
        
        // Create global pricing rules (no route_id, no vehicle_type)
        foreach ($planTypes as $planType) {
            PricingRule::firstOrCreate(
                [
                    'plan_type' => $planType,
                    'route_id' => null,
                    'vehicle_type' => null,
                ],
                [
                    'amount' => $basePrices[$planType],
                    'currency' => 'USD',
                    'active' => true,
                ]
            );
        }
        
        // Create route-specific pricing rules
        foreach ($routes->where('active', true) as $route) {
            $vehicle = $vehicles->firstWhere('id', $route->vehicle_id);
            if (!$vehicle) continue;
            
            foreach ($planTypes as $planType) {
                $multiplier = $vehicleTypeMultipliers[$vehicle->type] ?? 1.0;
                $amount = $basePrices[$planType] * $multiplier;
                
                PricingRule::firstOrCreate(
                    [
                        'plan_type' => $planType,
                        'route_id' => $route->id,
                        'vehicle_type' => null,
                    ],
                    [
                        'amount' => round($amount, 2),
                        'currency' => 'USD',
                        'active' => true,
                    ]
                );
            }
        }
        
        // Create vehicle-type-specific pricing rules
        foreach (['bus', 'van'] as $vehicleType) {
            foreach ($planTypes as $planType) {
                $multiplier = $vehicleTypeMultipliers[$vehicleType] ?? 1.0;
                $amount = $basePrices[$planType] * $multiplier;
                
                PricingRule::firstOrCreate(
                    [
                        'plan_type' => $planType,
                        'route_id' => null,
                        'vehicle_type' => $vehicleType,
                    ],
                    [
                        'amount' => round($amount, 2),
                        'currency' => 'USD',
                        'active' => true,
                    ]
                );
            }
        }
    }

    /**
     * Seed calendar events (holidays, closures)
     */
    private function seedCalendarEvents()
    {
        $this->command->info('Seeding calendar events...');
        
        $currentYear = now()->year;
        $events = [
            ['date' => Carbon::create($currentYear, 1, 1), 'type' => 'holiday', 'description' => 'New Year\'s Day'],
            ['date' => Carbon::create($currentYear, 7, 4), 'type' => 'holiday', 'description' => 'Independence Day'],
            ['date' => Carbon::create($currentYear, 12, 25), 'type' => 'holiday', 'description' => 'Christmas Day'],
            ['date' => Carbon::create($currentYear, 12, 31), 'type' => 'holiday', 'description' => 'New Year\'s Eve'],
            ['date' => now()->addDays(rand(10, 30)), 'type' => 'closure', 'description' => 'School Maintenance Day'],
        ];
        
        foreach ($events as $event) {
            CalendarEvent::firstOrCreate(
                [
                    'date' => $event['date'],
                    'type' => $event['type'],
                ],
                [
                    'description' => $event['description'],
                ]
            );
        }
    }

    /**
     * Seed some bookings for students
     */
    private function seedBookings($students, $routes, $pickupPoints)
    {
        $this->command->info('Seeding bookings...');
        
        // Check database driver - SQLite might still use 'semester' instead of 'academic_term'
        $driverName = DB::connection()->getDriverName();
        $termPlanType = ($driverName === 'sqlite') ? 'semester' : 'academic_term';
        
        $planTypes = ['weekly', 'bi_weekly', 'monthly', $termPlanType, 'annual'];
        $statuses = ['pending', 'active', 'active', 'active', 'completed']; // More active than others
        
        // Create bookings for about 60% of students
        $studentsWithBookings = $students->random((int)($students->count() * 0.6));
        
        foreach ($studentsWithBookings as $student) {
            $planType = $planTypes[array_rand($planTypes)];
            $status = $statuses[array_rand($statuses)];
            $startDate = now()->subDays(rand(0, 90));
            
            // Calculate end date based on plan type
            $endDate = match($planType) {
                'weekly' => $startDate->copy()->addWeek(),
                'bi_weekly' => $startDate->copy()->addWeeks(2),
                'monthly' => $startDate->copy()->addMonth(),
                'semester', 'academic_term' => $startDate->copy()->addMonths(4),
                'annual' => $startDate->copy()->addYear(),
                default => $startDate->copy()->addMonth(),
            };
            
            $route = $student->route ?? $routes->random();
            $pickupPoint = $student->pickup_point_id 
                ? $pickupPoints->where('id', $student->pickup_point_id)->first() 
                : $pickupPoints->where('route_id', $route->id)->first();
            
            Booking::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'route_id' => $route->id,
                    'start_date' => $startDate,
                ],
                [
                    'pickup_point_id' => $pickupPoint?->id,
                    'dropoff_point_id' => $pickupPoint?->id, // Same as pickup for simplicity
                    'plan_type' => $planType,
                    'trip_type' => 'two_way',
                    'status' => $status,
                    'end_date' => $endDate,
                ]
            );
        }
    }

    /**
     * Truncate all tables (optional - use with caution)
     */
    private function truncateTables()
    {
        $this->command->warn('Truncating all tables...');
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        Booking::truncate();
        Student::truncate();
        PickupPoint::truncate();
        Route::truncate();
        Vehicle::truncate();
        School::truncate();
        PricingRule::truncate();
        CalendarEvent::truncate();
        User::where('role', '!=', 'super_admin')->where('role', '!=', 'transport_admin')->delete();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}


