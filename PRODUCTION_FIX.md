# Production Deployment Fix Guide

## Common Issues and Fixes

### Issue 1: 500 Error - Missing Role Column

The `role` column is missing from the `users` table in production.

**Fix:**
```bash
php artisan migrate --force
```

### Issue 2: Vite Manifest Error - CSS File Not Found

Vite assets haven't been built for production.

**Fix:**
```bash
npm install
npm run build
```

### Complete Deployment Steps

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Install dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install
   ```

3. **Build assets:**
   ```bash
   npm run build
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

5. **Clear all caches:**
   ```bash
   php artisan optimize:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

6. **Optimize for production:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
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

