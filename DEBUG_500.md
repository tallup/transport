# Debugging 500 Error After Successful Deployment

If your deployment succeeds but you're still seeing a 500 error, follow these steps:

## Step 1: Check Laravel Logs (MOST IMPORTANT)

SSH into your production server and check the actual error:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
tail -100 storage/logs/laravel.log
```

This will show you the EXACT error causing the 500. Common errors include:

### Common Issues and Fixes:

#### 1. Database Connection Error
**Error:** `SQLSTATE[HY000] [2002] Connection refused` or similar

**Fix:** Check your `.env` file has correct database credentials:
```bash
cat .env | grep DB_
```

Make sure:
- `DB_CONNECTION=pgsql` (or your database type)
- `DB_HOST=` is correct
- `DB_DATABASE=` exists
- `DB_USERNAME=` and `DB_PASSWORD=` are correct

#### 2. Missing APP_KEY
**Error:** `No application encryption key has been specified`

**Fix:**
```bash
php artisan key:generate
php artisan config:cache
```

#### 3. File Permissions
**Error:** `The stream or file could not be opened` or permission denied

**Fix:**
```bash
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

#### 4. Missing Vite Assets (Manifest Error)
**Error:** `Unable to locate file in Vite manifest`

**Fix:** Ensure assets were built:
```bash
ls -la public/build/manifest.json
# If missing or old:
npm run build
```

#### 5. Missing Environment Variables
**Error:** `Undefined array key` or `config()` returning null

**Check your `.env` file has all required variables:**
- `APP_NAME`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://transport.on-forge.com`
- `DB_*` variables
- `MAIL_*` variables (if using email)
- `STRIPE_KEY` and `STRIPE_SECRET` (if using Stripe)

#### 6. Schema/Migration Issues
**Error:** `Column not found` or `Table doesn't exist`

**Fix:**
```bash
php artisan migrate:status
# Check if all migrations have run
php artisan migrate --force
```

## Step 2: Check PHP Error Logs

```bash
tail -50 /var/log/nginx/error.log
# Or
tail -50 /var/log/php8.3-fpm.log
```

## Step 3: Verify Deployment Actually Succeeded

Check that the current release has the latest code:

```bash
cd /home/forge/transport.on-forge.com/current
git log -1
# Should show your latest commit
ls -la public/build/manifest.json
# Should exist and be recent
cat public/build/manifest.json | head -5
# Should show valid JSON
```

## Step 4: Quick Diagnostic Commands

Run these to check common issues:

```bash
cd /home/forge/transport.on-forge.com/current

# Check PHP version
php -v

# Check if .env exists and is readable
ls -la .env
cat .env | head -20

# Check database connection
php artisan tinker
# Then in tinker:
DB::connection()->getPdo();
# Should not throw an error

# Check file permissions
ls -la storage/logs
ls -la bootstrap/cache
ls -la public/build

# Check if routes are cached
php artisan route:list | head -20

# Clear everything and rebuild
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Step 5: Enable Debug Mode Temporarily

**WARNING: Only for debugging, disable after!**

```bash
# In .env file, change:
APP_DEBUG=true
APP_ENV=local

# Then clear config cache:
php artisan config:clear
php artisan config:cache
```

This will show you the full error page. **Remember to set it back to:**
```
APP_DEBUG=false
APP_ENV=production
```

## Step 6: Check Forge Deployment Logs

In Laravel Forge:
1. Go to your site → Deployments
2. Click on the latest deployment
3. Click "View Output" or "See issue"
4. Look for any errors in the deployment output

## Most Common Fix

If you're unsure, try this complete reset:

```bash
cd /home/forge/transport.on-forge.com/current

# Clear everything
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan view:clear

# Rebuild assets
npm run build

# Re-cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions
chmod -R 775 storage bootstrap/cache
```

## Still Not Working?

1. **Copy the exact error from `storage/logs/laravel.log`**
2. **Share it here** and I'll help you fix it specifically

