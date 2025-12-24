# Production Deployment Fix Guide

## 🔍 First: Check the Actual Error

**The most important step is to see what the actual error is:**

```bash
# SSH into your production server, then:
tail -100 storage/logs/laravel.log
```

This will show you the exact error causing the 500. Common errors include:
- Database connection issues
- Missing environment variables
- File permission problems
- Missing dependencies

## Common Issues and Fixes

### Issue 1: 500 Error - Missing Role Column

The `role` column is missing from the `users` table in production.

**Fix:**
```bash
php artisan migrate --force
```

### Issue 2: Vite Manifest Error - CSS/JS File Not Found

Vite assets haven't been built for production.

**Fix:**
```bash
npm install
npm run build
```

### Issue 3: Database Connection Error

Check your `.env` file has correct database credentials:
```bash
DB_CONNECTION=pgsql
DB_HOST=your-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

### Issue 4: File Permissions

Ensure Laravel can write to storage and cache:
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Issue 5: Missing Composer Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

## Complete Deployment Steps

1. **SSH into production server**

2. **Navigate to your project:**
   ```bash
   cd /home/forge/transport.on-forge.com/current
   # Or wherever your Laravel app is deployed
   ```

3. **Pull latest code:**
   ```bash
   git pull origin main
   ```

4. **Install PHP dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

5. **Install Node dependencies and build assets:**
   ```bash
   npm install
   npm run build
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

7. **Clear all caches:**
   ```bash
   php artisan optimize:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

8. **Optimize for production:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

9. **Check logs if still having issues:**
   ```bash
   tail -100 storage/logs/laravel.log
   ```

## Laravel Forge Specific

If using Laravel Forge, add this to your deployment script:

```bash
cd /home/forge/transport.on-forge.com
git pull origin main
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Still Not Working?

1. **Check PHP error logs:**
   ```bash
   tail -50 /var/log/nginx/error.log
   # Or wherever your web server logs are
   ```

2. **Verify environment file:**
   ```bash
   php artisan config:show
   ```

3. **Test database connection:**
   ```bash
   php artisan tinker
   # Then in tinker:
   DB::connection()->getPdo();
   ```

4. **Check file permissions:**
   ```bash
   ls -la storage/logs
   ls -la bootstrap/cache
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

