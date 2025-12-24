# Deployment Troubleshooting Guide

## Current Issue

Production is still using an old release and showing Ziggy errors. The deployment needs to succeed first.

## Step 1: Check Deployment Logs

In Laravel Forge:
1. Go to your site → Deployments
2. Click on the latest (failed) deployment
3. Click "View Output" or check the error details
4. Look for the specific error message

## Step 2: Common Deployment Failures

### Error: "Method Filament\Panel::canAccess does not exist"
**Status:** ✅ FIXED - We're now using `canAccessPanel` on the User model

### Error: "Class Tightenco\Ziggy\Ziggy not found"
**Status:** ✅ FIXED - We're now using `Tighten\Ziggy\Ziggy` and handling errors gracefully

### Error: Composer install fails
**Fix:**
```bash
composer install --no-dev --optimize-autoloader
```

### Error: npm build fails
**Fix:**
```bash
npm ci
npm run build
```

## Step 3: Manual Deployment Check

SSH into your production server and manually check:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current

# Check current code version
git log -1

# Check if files are correct
grep -n "Tighten\\\\Ziggy" app/Http/Middleware/HandleInertiaRequests.php
# Should show: Tighten\Ziggy\Ziggy (v2 namespace)

# Check if User model has canAccessPanel
grep -n "canAccessPanel" app/Models/User.php
# Should show the method exists

# Clear caches
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Try package discovery manually
php artisan package:discover
# Should complete without errors
```

## Step 4: Force a Fresh Deployment

If deployments keep failing, try:

1. **Clear Forge deployment cache:**
   - In Forge, go to your site
   - Try deploying again after the latest code is pushed

2. **Manual deployment steps:**
   ```bash
   cd /home/forge/transport.on-forge.com/current
   git pull origin main
   composer install --no-dev --optimize-autoloader
   npm ci
   npm run build
   php artisan migrate --force
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Step 5: Verify the Fix

After successful deployment, check the logs:

```bash
tail -50 storage/logs/laravel.log
```

The Ziggy error should be gone.

## Current Fixes Applied

✅ **Ziggy Namespace:** Changed from `Tightenco\Ziggy\Ziggy` to `Tighten\Ziggy\Ziggy`
✅ **Filament Authorization:** Using `canAccessPanel` method on User model (not `canAccess` closure)
✅ **Error Handling:** Added try-catch for Ziggy route generation
✅ **Robust Checks:** Only try Ziggy v2 namespace, catch all errors gracefully

## If Still Failing

1. **Check PHP version:**
   ```bash
   php -v
   # Should be PHP 8.2 or higher
   ```

2. **Check composer version:**
   ```bash
   composer --version
   ```

3. **Check npm/node version:**
   ```bash
   node -v
   npm -v
   ```

4. **Verify all dependencies:**
   ```bash
   composer show | grep filament
   composer show | grep ziggy
   ```

5. **Check file permissions:**
   ```bash
   ls -la storage/logs
   ls -la bootstrap/cache
   chmod -R 775 storage bootstrap/cache
   ```

