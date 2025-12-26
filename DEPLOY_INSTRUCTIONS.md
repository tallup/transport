# Deploy Admin Route Fix to Production

## The Fix
The Filament admin panel path has been changed from `admin` to `filament-admin` to avoid conflict with React admin routes.

## Quick Deploy Steps

### If using Laravel Forge:
1. Go to your Forge dashboard
2. Click "Deploy Now" - it will automatically pull and deploy

OR manually SSH in:

```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current

# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
npm ci

# Build assets (CRITICAL)
npm run build

# Clear and recache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Or use the deployment script:

```bash
# Copy script to server or run commands directly
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
bash <(curl -s https://raw.githubusercontent.com/your-repo/transport/main/DEPLOY_TO_PRODUCTION.sh)
```

## What This Fixes

✅ **Before:** `/admin` → 500 error (Filament route conflict)  
✅ **After:** `/admin` → redirects to `/admin/dashboard` (React admin)

✅ **Before:** `/login` → 500 error  
✅ **After:** `/login` → works correctly

## Verify After Deployment

1. **Test login page:**
   - Go to: `https://transport.on-forge.com/login`
   - Should load without 500 error

2. **Test admin dashboard:**
   - Login with: `admin@transport.com` / `password`
   - Go to: `https://transport.on-forge.com/admin/dashboard`
   - Should show React admin interface

3. **Test redirect:**
   - Go to: `https://transport.on-forge.com/admin`
   - Should redirect to `/admin/dashboard`

## If You Still See 500 Error

Check Laravel logs:
```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com/current
tail -50 storage/logs/laravel.log
```

Common issues:
- **Old cached routes:** Run `php artisan route:clear && php artisan route:cache`
- **Assets not built:** Run `npm run build`
- **Config cached:** Run `php artisan config:clear && php artisan config:cache`

## Files Changed

1. `app/Providers/Filament/AdminPanelProvider.php` - Changed path from `admin` to `filament-admin`
2. `routes/web.php` - Added redirect from `/admin` to `/admin/dashboard`

Both changes are already committed and pushed to `origin/main`.



