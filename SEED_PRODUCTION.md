# Running Seeders in Production

## Quick Command

To run all seeders in production:

```bash
php artisan db:seed --force
```

The `--force` flag is required when running seeders in production to prevent accidental execution.

## Safety Notes

✅ **All seeders are safe to run multiple times** - They use `firstOrCreate()` which means:
- Records are only created if they don't already exist
- No duplicates will be created
- Safe to run after deployments or migrations

## What Gets Created

The seeders will create:

1. **Users** (UserSeeder)
   - Super Admin: `admin@transport.com` / `password`
   - Transport Admin: `transport@transport.com` / `password`
   - 3 Drivers (john.driver@transport.com, etc.)
   - 5 Parents (sarah.johnson@example.com, etc.)

2. **Vehicles** (VehicleSeeder)
   - 5 vehicles (3 buses, 2 vans)

3. **Routes** (RouteSeeder)
   - 4 routes (3 active, 1 inactive)

4. **Pickup Points** (PickupPointSeeder)
   - 12 pickup points (4 per active route)

5. **Pricing Rules** (PricingRuleSeeder)
   - 9 pricing rules (global + vehicle-specific)

6. **Calendar Events** (CalendarEventSeeder)
   - Holidays and closures for the current year

7. **Students** (StudentSeeder)
   - 7 students assigned to different parents

8. **Bookings** (BookingSeeder)
   - 4 bookings (3 active, 1 pending)

## Running Individual Seeders

If you need to run specific seeders:

```bash
# Users only
php artisan db:seed --class=UserSeeder --force

# Vehicles only
php artisan db:seed --class=VehicleSeeder --force

# Routes (requires vehicles first)
php artisan db:seed --class=RouteSeeder --force

# All others follow the same pattern
```

## ⚠️ IMPORTANT: Change Default Passwords

After running seeders, **immediately change all default passwords**, especially admin accounts:

```bash
php artisan tinker
```

Then update passwords:
```php
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();
$admin->password = \Hash::make('your-secure-password-here');
$admin->save();
```

## Recommended Production Workflow

1. Run migrations: `php artisan migrate --force`
2. Run seeders: `php artisan db:seed --force`
3. Change all default passwords
4. Configure environment variables (SES, Stripe, etc.)
5. Test the application
