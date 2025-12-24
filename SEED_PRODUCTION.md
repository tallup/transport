# Running Seeders on Production

## ⚠️ Important Notes

The seeders are **idempotent** (safe to run multiple times) because they use `firstOrCreate()`. This means:
- They won't create duplicate records if they already exist
- They're safe to run on production
- You can re-run them without issues

## What Will Be Seeded

The seeders will create:

1. **Users:**
   - Super Admin: `admin@transport.com` / `password`
   - Transport Admin: `transport@transport.com` / `password`
   - 3 Drivers (john.driver@transport.com, jane.smith@transport.com, mike.johnson@transport.com)
   - 5 Parent users

2. **Vehicles:** Multiple buses and vans

3. **Routes:** 4 routes (3 active, 1 inactive)

4. **Pickup Points:** Multiple pickup points for each route

5. **Pricing Rules:** Pricing rules for different plan types

6. **Calendar Events:** Sample holidays and school days

7. **Students:** 5 students linked to parent users

8. **Bookings:** Sample bookings (only if students and routes exist)

## ⚠️ Security Warning

**ALL SEEDED USERS HAVE THE PASSWORD: `password`**

**IMPORTANT:** After seeding, **immediately change all passwords** on production:

```bash
php artisan tinker
```

Then in tinker:
```php
// Change super admin password
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();
$admin->password = \Illuminate\Support\Facades\Hash::make('YOUR_SECURE_PASSWORD');
$admin->save();

// Change transport admin password
$transportAdmin = \App\Models\User::where('email', 'transport@transport.com')->first();
$transportAdmin->password = \Illuminate\Support\Facades\Hash::make('YOUR_SECURE_PASSWORD');
$transportAdmin->save();

// Change all driver passwords
\App\Models\User::where('role', 'driver')->get()->each(function($driver) {
    $driver->password = \Illuminate\Support\Facades\Hash::make('YOUR_SECURE_PASSWORD');
    $driver->save();
});

// Change all parent passwords
\App\Models\User::where('role', 'parent')->get()->each(function($parent) {
    $parent->password = \Illuminate\Support\Facades\Hash::make('YOUR_SECURE_PASSWORD');
    $parent->save();
});
```

## How to Run Seeders on Production

### Option 1: Run All Seeders (Recommended)

SSH into your production server:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
php artisan db:seed --force
```

### Option 2: Run Specific Seeder

To run only one seeder:

```bash
php artisan db:seed --class=UserSeeder --force
php artisan db:seed --class=VehicleSeeder --force
php artisan db:seed --class=RouteSeeder --force
# ... etc
```

### Option 3: Run Seeders in Order (If you want more control)

Run them in the correct order:

```bash
php artisan db:seed --class=UserSeeder --force
php artisan db:seed --class=VehicleSeeder --force
php artisan db:seed --class=RouteSeeder --force
php artisan db:seed --class=PickupPointSeeder --force
php artisan db:seed --class=PricingRuleSeeder --force
php artisan db:seed --class=CalendarEventSeeder --force
php artisan db:seed --class=StudentSeeder --force
php artisan db:seed --class=BookingSeeder --force
```

## Verify Seeding Worked

After seeding, verify the data was created:

```bash
php artisan tinker
```

In tinker, check:

```php
// Check users
\App\Models\User::count(); // Should be > 0
\App\Models\User::where('role', 'super_admin')->count(); // Should be 1
\App\Models\User::where('role', 'driver')->count(); // Should be 3

// Check vehicles
\App\Models\Vehicle::count(); // Should be > 0

// Check routes
\App\Models\Route::count(); // Should be 4

// Check students
\App\Models\Student::count(); // Should be 5

// Check bookings
\App\Models\Booking::count(); // Should be > 0
```

## Troubleshooting

### Error: "No parent users found"
- Run `UserSeeder` first before `StudentSeeder`

### Error: "No students or routes found"
- Run `StudentSeeder` and `RouteSeeder` before `BookingSeeder`

### If seeders fail partway:
- No problem! Just run them again. They use `firstOrCreate()` so they won't create duplicates.

## Quick Commands Reference

```bash
# Run all seeders
php artisan db:seed --force

# Run specific seeder
php artisan db:seed --class=UserSeeder --force

# Check if users exist
php artisan tinker
> \App\Models\User::count();
```
