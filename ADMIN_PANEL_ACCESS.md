# Admin Panel Access Guide

## ✅ Deployment is Working!

Great news - your deployment is now successful. Now let's get you into the admin panel.

## Step 1: Create Admin Users (If Not Already Done)

First, make sure you have admin users in your database. Run the seeder:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
php artisan db:seed --class=UserSeeder --force
```

This creates:
- **Super Admin**: `admin@transport.com` / `password`
- **Transport Admin**: `transport@transport.com` / `password`

## Step 2: Access the Admin Panel Login

The admin panel has its own login page. Go to:

```
https://transport.on-forge.com/admin/login
```

**NOT** `https://transport.on-forge.com/login` (that's for the parent portal)

## Step 3: Login Credentials

Use one of these accounts:

**Super Admin:**
- Email: `admin@transport.com`
- Password: `password`

**Transport Admin:**
- Email: `transport@transport.com`
- Password: `password`

## Step 4: If You Get 403 Forbidden

If you still get a 403 error after logging in, it means:
- Your user doesn't have the correct role
- OR you're logged in as a different user

**Fix:**
1. Log out completely
2. Go to `/admin/login` (not `/login`)
3. Login with admin credentials
4. You should now have access

## Step 5: Verify Your User's Role

If you're not sure what role your user has:

```bash
php artisan tinker
```

Then:
```php
$user = \App\Models\User::where('email', 'admin@transport.com')->first();
echo $user->role; // Should be 'super_admin'
```

Or check all users:
```php
\App\Models\User::select('id', 'name', 'email', 'role')->get();
```

## Step 6: Check Authorization

The admin panel authorization is working. Only users with these roles can access:

- **`super_admin`** → Can access `/admin`
- **`transport_admin`** → Can access `/admin`
- **`driver`** → Can access `/driver` (driver panel)
- **`parent`** → Can access `/parent/dashboard` (parent portal)

## Quick Checklist

- [ ] Ran `php artisan db:seed --class=UserSeeder --force`
- [ ] Going to `/admin/login` (not `/login`)
- [ ] Using email: `admin@transport.com`
- [ ] Using password: `password`
- [ ] Logged out from any other session first

## Troubleshooting

### "403 Forbidden" after login
- Make sure you're using the admin login page: `/admin/login`
- Verify your user has `super_admin` or `transport_admin` role
- Clear browser cache and cookies
- Try incognito/private window

### "User not found"
- Run the seeder: `php artisan db:seed --class=UserSeeder --force`
- Check if user exists: `php artisan tinker` → `\App\Models\User::where('email', 'admin@transport.com')->first()`

### Still can't access
- Check Laravel logs: `tail -50 storage/logs/laravel.log`
- Verify role: `php artisan tinker` → `$user->role`

## Security Reminder

**⚠️ CHANGE THE DEFAULT PASSWORDS IMMEDIATELY!**

All seeded users have the default password: `password`

Change them after first login or via tinker (see `SEED_PRODUCTION.md` for instructions).

