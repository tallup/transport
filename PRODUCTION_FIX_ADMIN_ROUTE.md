# Production Fix: Admin Route Conflict

## Issue
Production is showing a 500 error because Filament's admin panel is conflicting with React admin routes at `/admin`.

## Fix Applied
1. Changed Filament admin panel path from `admin` to `filament-admin` in `app/Providers/Filament/AdminPanelProvider.php`
2. Added redirect from `/admin` to `/admin/dashboard` in `routes/web.php`

## Deployment Steps

### 1. Pull Latest Code
```bash
ssh forge@transport.on-forge.com
cd /home/forge/transport.on-forge.com
git pull origin main  # or your branch name
```

### 2. Install Dependencies (if needed)
```bash
composer install --no-dev --optimize-autoloader
npm ci
```

### 3. Build Assets
```bash
npm run build
```

### 4. Clear All Caches
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear
```

### 5. Optimize for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6. Verify Routes
```bash
php artisan route:list --path=admin | head -20
```

You should see:
- `admin.dashboard` → `/admin/dashboard`
- `admin.students.index` → `/admin/students`
- etc.

And Filament routes should be under `/filament-admin/*`

## Quick Deploy Script

If you have a deployment script, make sure it includes:

```bash
# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build frontend assets
npm run build

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services if needed
sudo supervisorctl restart laravel-worker:*
```

## Verify Fix

After deployment, test:

1. **Login Page:** `https://transport.on-forge.com/login` should work (no 500 error)
2. **Admin Dashboard:** After login, go to `https://transport.on-forge.com/admin/dashboard` - should show React admin interface
3. **Admin Redirect:** `https://transport.on-forge.com/admin` should redirect to `/admin/dashboard`

## If Still Getting 500 Error

Check Laravel logs:
```bash
tail -f storage/logs/laravel.log
```

Common issues:
- Old cached routes: Run `php artisan route:clear && php artisan route:cache`
- Old cached config: Run `php artisan config:clear && php artisan config:cache`
- Missing assets: Run `npm run build`
- Permission issues: Check `storage/` and `bootstrap/cache/` permissions

## Notes

- Filament admin panel (if needed) is now at `/filament-admin`
- React admin interface is at `/admin/*` routes
- Make sure you're logged in before accessing `/admin/dashboard`

