# Debug Admin Panel Access Issue

## Current Issue

You can see the login page, but after entering credentials, you get "Forbidden". This means:
- ✅ Authentication is working (login succeeds)
- ❌ Authorization is failing (canAccessPanel returns false)

## Quick Debug Steps

SSH into production and run:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
php artisan tinker
```

Then check the admin user:

```php
// Check if admin user exists and has correct role
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();

// Check role from database directly
echo "Role from attributes: " . ($admin->attributes['role'] ?? 'NOT SET') . PHP_EOL;

// Check role via accessor
echo "Role via accessor: " . ($admin->role ?? 'NOT SET') . PHP_EOL;

// Test canAccessPanel directly
$panel = \Filament\Facades\Filament::getPanel('admin');
echo "Can access admin panel: " . ($admin->canAccessPanel($panel) ? 'YES' : 'NO') . PHP_EOL;
```

## Common Issues

### Issue 1: Role Not Set in Database

If the role is `null` or not set:

```php
// Update the user's role
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();
$admin->role = 'super_admin';
$admin->save();

// Verify
echo $admin->fresh()->role; // Should be 'super_admin'
```

### Issue 2: Role Column Doesn't Exist

Check if the role column exists:

```php
\Illuminate\Support\Facades\Schema::hasColumn('users', 'role');
// Should return true

// If false, run migration
// php artisan migrate --force
```

### Issue 3: User Doesn't Exist

If the user doesn't exist, run the seeder:

```bash
php artisan db:seed --class=UserSeeder --force
```

## Fix Applied

I've updated the `canAccessPanel` method to use `$this->attributes['role']` directly instead of the accessor, which should be more reliable.

## After Fix is Deployed

1. Pull the latest code
2. Run the seeder if needed: `php artisan db:seed --class=UserSeeder --force`
3. Verify the user's role in tinker
4. Try logging in again

