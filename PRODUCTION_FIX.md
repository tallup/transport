# Production 500 Error Fix Guide

## The Problem

The 500 error is caused by the `role` column missing from the `users` table in production.

## Quick Fix Steps

### 1. Run Migrations

```bash
php artisan migrate --force
```

This will add the `role` column to the `users` table if it doesn't exist.

### 2. Clear All Caches

```bash
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 3. Verify Database

Check if the role column exists:

```bash
php artisan tinker
```

Then run:
```php
\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')
```

Should return `true`.

### 4. Check Recent Logs

```bash
tail -50 storage/logs/laravel.log
```

## What Was Fixed

✅ **HandleInertiaRequests** - Now safely handles missing role column
✅ **User Model** - Added safe role accessor
✅ **Registration Controllers** - Check for role column before using it
✅ **Migrations** - Made idempotent (safe to run multiple times)

## After Running Migrations

The application should work immediately. The code is now safe and will:
- Default to 'parent' role if column doesn't exist
- Work properly once the migration runs
- Not create duplicate errors

## If Still Getting 500 Errors

1. Check Laravel logs: `tail -100 storage/logs/laravel.log`
2. Check PHP error logs
3. Verify database connection in `.env`
4. Ensure all migrations have run: `php artisan migrate:status`

