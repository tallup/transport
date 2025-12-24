# Database Seeders Summary

All seeders have been created and are ready to use. The database has been populated with test data.

## Seeder Files Created

1. **UserSeeder** - Creates users for all roles
2. **VehicleSeeder** - Creates vehicles (buses and vans)
3. **RouteSeeder** - Creates routes and assigns drivers/vehicles
4. **PickupPointSeeder** - Creates pickup points for each route
5. **PricingRuleSeeder** - Creates pricing rules (global and vehicle-specific)
6. **CalendarEventSeeder** - Creates calendar events (holidays and closures)
7. **StudentSeeder** - Creates students with parent associations
8. **BookingSeeder** - Creates sample bookings

## Test Accounts Created

### Super Admin
- **Email**: admin@transport.com
- **Password**: password

### Transport Admin
- **Email**: transport@transport.com
- **Password**: password

### Drivers (3)
- john.driver@transport.com
- jane.smith@transport.com
- mike.johnson@transport.com
- **Password**: password

### Parents (5)
- sarah.johnson@example.com
- david.brown@example.com
- emily.davis@example.com
- michael.wilson@example.com
- jessica.martinez@example.com
- **Password**: password

## Seed Data Created

- **5 Vehicles** (3 buses, 2 vans)
- **3 Active Routes** (1 inactive route)
- **12 Pickup Points** (4 per active route)
- **9 Pricing Rules** (global + vehicle-specific)
- **7 Students** (assigned to different parents)
- **4 Bookings** (3 active, 1 pending)
- **7 Calendar Events** (holidays + closures)

## Running Seeders

To run all seeders:
```bash
php artisan db:seed
```

To run a specific seeder:
```bash
php artisan db:seed --class=UserSeeder
```

To refresh and re-seed:
```bash
php artisan migrate:fresh --seed
```

## Amazon SES Configuration

To configure Amazon SES for email sending, add these to your `.env` file:

```env
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Student Transport System"

AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_DEFAULT_REGION=us-east-1
AWS_SES_CONFIGURATION_SET=your-config-set-name  # Optional
```

The AWS SDK has already been installed via Composer.

See `SES_SETUP.md` for more detailed configuration instructions.

