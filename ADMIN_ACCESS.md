# Admin Panel Access Guide

## The Issue

You were getting a 403 Forbidden error when trying to access `/admin`. This was because Filament requires explicit authorization to access panels.

## The Fix

I've added authorization to both panels:

1. **Admin Panel (`/admin`)** - Now allows only:
   - `super_admin` role
   - `transport_admin` role

2. **Driver Panel (`/driver`)** - Now allows only:
   - `driver` role

## How to Access the Admin Panel

### Option 1: Login Directly to Admin Panel

1. Go to: `https://transport.on-forge.com/admin/login`
2. Login with:
   - Email: `admin@transport.com`
   - Password: `password` (change this immediately after first login!)
3. You should now have access to the admin panel

### Option 2: If You're Already Logged In

If you're already logged in as a different user (like a parent), you need to:

1. **Log out** from the current session
2. Go to: `https://transport.on-forge.com/admin/login`
3. Login with super admin credentials:
   - Email: `admin@transport.com`
   - Password: `password`

## Creating Admin Users

If you haven't run the seeders yet, the admin user won't exist. Run:

```bash
php artisan db:seed --class=UserSeeder --force
```

This creates:
- Super Admin: `admin@transport.com` / `password`
- Transport Admin: `transport@transport.com` / `password`

## Verify Your User's Role

If you're not sure what role your current user has:

```bash
php artisan tinker
```

Then:
```php
$user = \App\Models\User::where('email', 'your-email@example.com')->first();
echo $user->role; // Should be 'super_admin' or 'transport_admin' for admin access
```

## Security Warning

**CHANGE DEFAULT PASSWORDS IMMEDIATELY!**

All seeded users have the default password: `password`

Change them after first login or via tinker (see `SEED_PRODUCTION.md` for details).

