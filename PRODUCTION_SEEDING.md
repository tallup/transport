# Production Seeding Guide

## ⚠️ CRITICAL WARNINGS

1. **BACKUP YOUR DATABASE FIRST!**
   ```bash
   # Example for PostgreSQL
   pg_dump -h localhost -U your_user -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Example for MySQL
   mysqldump -u your_user -p your_database > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **ALL SEEDED USERS HAVE PASSWORD: `password`**
   - You MUST change all passwords immediately after seeding!

3. **The seeder uses `firstOrCreate()`** - it's safe to run multiple times and won't create duplicates
   - Existing records with matching keys will be skipped
   - Only new records will be created

## What Will Be Created

The comprehensive seeder will create:

- **5 Schools**: Lincoln Elementary, Roosevelt Middle, Washington High, Jefferson Elementary, Madison Academy
- **10 Parent Users**: Each with email `[name]@example.com` and password `password`
- **50 Students**: 5 students per parent, distributed across schools, connected to routes and pickup points
- **8 Vehicles**: Mix of buses (50-seat capacity) and vans (15-seat capacity)
- **8 Driver Users**: Each with email `[name]@transport.com` and password `password`
- **8 Routes**: Connected to vehicles, drivers, and schools
- **55+ Pickup Points**: Distributed across all active routes
- **50 Pricing Rules**: Global, route-specific, and vehicle-type-specific pricing for all plan types
- **Calendar Events**: Sample holidays and closures
- **35 Bookings**: For approximately 60% of students

## Pre-Seeding Checklist

- [ ] Database backup created
- [ ] Environment is set to production (APP_ENV=production)
- [ ] You understand that default passwords are `password`
- [ ] You have a plan to change all passwords after seeding
- [ ] You've tested the seeder in staging/development first

## How to Run on Production

### Step 1: SSH into Production Server

```bash
ssh your-user@your-production-server.com
cd /path/to/your/application
```

### Step 2: Run the Seeder

**Option A: Run ComprehensiveSeeder directly (Recommended)**
```bash
php artisan db:seed --class=ComprehensiveSeeder --force
```

The `--force` flag is **required** in production to prevent accidental seeding.

**Option B: Run through DatabaseSeeder**
```bash
php artisan db:seed --force
```

This will use the `DatabaseSeeder` which calls `ComprehensiveSeeder`.

### Step 3: Verify the Seeding

```bash
php artisan tinker
```

Then check:
```php
// Check counts
echo "Schools: " . \App\Models\School::count() . "\n";
echo "Parents: " . \App\Models\User::where('role', 'parent')->count() . "\n";
echo "Students: " . \App\Models\Student::count() . "\n";
echo "Vehicles: " . \App\Models\Vehicle::count() . "\n";
echo "Drivers: " . \App\Models\User::where('role', 'driver')->count() . "\n";
echo "Routes: " . \App\Models\Route::count() . "\n";
echo "Pickup Points: " . \App\Models\PickupPoint::count() . "\n";
echo "Pricing Rules: " . \App\Models\PricingRule::count() . "\n";
echo "Bookings: " . \App\Models\Booking::count() . "\n";

// Check a sample student relationship
$student = \App\Models\Student::with(['parent', 'school', 'route.vehicle', 'pickupPoint'])->first();
echo "\nSample Student: " . $student->name . "\n";
echo "  Parent: " . $student->parent->name . " (" . $student->parent->email . ")\n";
echo "  School: " . $student->school->name . "\n";
echo "  Route: " . $student->route->name . "\n";
echo "  Vehicle: " . $student->route->vehicle->type . " - " . $student->route->vehicle->license_plate . "\n";
echo "  Pickup Point: " . $student->pickupPoint->name . "\n";
```

### Step 4: CHANGE ALL PASSWORDS IMMEDIATELY!

**⚠️ CRITICAL: All seeded users have password `password` - CHANGE THEM NOW!**

```bash
php artisan tinker
```

Then run:
```php
use Illuminate\Support\Facades\Hash;

// Change super admin password
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();
if ($admin) {
    $admin->password = Hash::make('YOUR_SECURE_ADMIN_PASSWORD');
    $admin->save();
    echo "Admin password changed\n";
}

// Change transport admin password
$transportAdmin = \App\Models\User::where('email', 'transport@transport.com')->first();
if ($transportAdmin) {
    $transportAdmin->password = Hash::make('YOUR_SECURE_TRANSPORT_ADMIN_PASSWORD');
    $transportAdmin->save();
    echo "Transport admin password changed\n";
}

// Change ALL driver passwords
\App\Models\User::where('role', 'driver')->get()->each(function($driver) {
    $driver->password = Hash::make('YOUR_SECURE_DRIVER_PASSWORD');
    $driver->save();
    echo "Driver {$driver->email} password changed\n";
});

// Change ALL parent passwords (optional - parents can change their own via password reset)
// Or notify them to reset their passwords via email
\App\Models\User::where('role', 'parent')->get()->each(function($parent) {
    // Option 1: Set a temporary password and force reset
    $parent->password = Hash::make('TempPassword' . rand(1000, 9999));
    $parent->save();
    echo "Parent {$parent->email} password set to temporary password\n";
    // Option 2: Send password reset email (implement if you have password reset functionality)
});
```

## Default User Credentials (CHANGE THESE!)

After seeding, these users will exist with password `password`:

### Admin Users
- **Super Admin**: `admin@transport.com` / `password`
- **Transport Admin**: `transport@transport.com` / `password`

### Driver Users (8 total)
- `john.driver@transport.com` / `password`
- `jane.smith@transport.com` / `password`
- `mike.johnson@transport.com` / `password`
- `lisa.williams@transport.com` / `password`
- `tom.anderson@transport.com` / `password`
- `patricia.brown@transport.com` / `password`
- `james.davis@transport.com` / `password`
- `mary.miller@transport.com` / `password`

### Parent Users (10 total)
- `sarah.johnson@example.com` / `password`
- `david.brown@example.com` / `password`
- `emily.davis@example.com` / `password`
- `michael.wilson@example.com` / `password`
- `jessica.martinez@example.com` / `password`
- `robert.taylor@example.com` / `password`
- `amanda.anderson@example.com` / `password`
- `christopher.thomas@example.com` / `password`
- `jennifer.jackson@example.com` / `password`
- `daniel.white@example.com` / `password`

## Troubleshooting

### Error: "The --force option does not exist"
- Make sure you're using Laravel 8+ (the `--force` flag was added in Laravel 8)
- If using Laravel 7 or below, the confirmation prompt will appear automatically

### Error: "NOT NULL constraint failed"
- Check that all migrations have been run: `php artisan migrate --force`
- Verify that foreign key relationships are correct

### Error: "SQLSTATE[23000]: Integrity constraint violation"
- This usually means a duplicate key violation
- The seeder uses `firstOrCreate()` so this should be rare
- Check if the data already exists and the unique constraint is being violated

### Students not connecting to routes/schools
- Verify that routes and schools were created successfully
- Check that routes are properly attached to schools in the `route_school` pivot table

## Post-Seeding Tasks

1. ✅ Change all admin passwords
2. ✅ Change all driver passwords
3. ✅ Set up password reset for parents (or manually change parent passwords)
4. ✅ Verify all relationships are correct
5. ✅ Test login with new admin credentials
6. ✅ Review and update pricing rules if needed
7. ✅ Review and update calendar events (holidays/closures)
8. ✅ Test booking creation flow
9. ✅ Verify routes are properly configured
10. ✅ Set up email notifications if not already configured

## Safety Features

The seeder includes these safety features:

1. **`firstOrCreate()`**: Prevents duplicate records
2. **Production confirmation**: Prompts for confirmation when running in production
3. **No data deletion**: Truncate method is commented out by default
4. **Relationship validation**: Checks for required relationships before creating records

## Re-running the Seeder

You can safely re-run the seeder multiple times:
- Existing records will be skipped (using `firstOrCreate`)
- Only new records will be created
- Relationships will be updated if they've changed

**Note**: If you want to update existing records, you'll need to manually update them or create a separate update seeder.






