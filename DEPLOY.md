# Production Deployment Instructions

## Critical: Fix Vite Manifest Error

The error `Unable to locate file in Vite manifest: resources/css/app.css` happens because:

1. **The production server has old code** (release 61138006 is still active)
2. **Assets haven't been built** (`npm run build` hasn't been run)
3. **Old Vite manifest** still references CSS file separately

## Step-by-Step Fix for Production

### Option 1: Laravel Forge (Recommended)

1. **SSH into your production server:**
   ```bash
   ssh forge@transport.on-forge.com
   ```

2. **Navigate to current release:**
   ```bash
   cd /home/forge/transport.on-forge.com/current
   ```

3. **Pull latest code:**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci  # Use ci for faster, reliable installs
   ```

5. **Build assets (CRITICAL!):**
   ```bash
   npm run build
   ```
   
   This creates/updates `public/build/manifest.json` with the correct asset references.

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

8. **Cache for production:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Option 2: Use the Provided Deployment Script

I've created an optimized deployment script for Laravel Forge. Copy the contents of `DEPLOY_SCRIPT.sh` into your Forge deployment script.

**In Laravel Forge:**
1. Go to your site → Settings → Deployments
2. Copy the entire contents of `DEPLOY_SCRIPT.sh` 
3. Paste it into the "Deploy Script" editor
4. Click "Save" and then "Deploy Now"

**Key improvements in the script:**
- ✅ Proper order: Install dependencies → Build assets → Migrate → Clear caches → Optimize
- ✅ Uses `npm ci` for faster, reliable installs
- ✅ Clears all caches before optimizing
- ✅ Includes fallback for storage:link
- ✅ Uses Forge's built-in variables (`$FORGE_PHP`, `$FORGE_COMPOSER`, etc.)

### Verify the Fix

After deployment, check:

1. **Verify manifest exists:**
   ```bash
   ls -la public/build/manifest.json
   cat public/build/manifest.json
   ```

2. **Check manifest contents:**
   The manifest should have an entry for `resources/js/app.jsx` but NOT a separate entry for `resources/css/app.css` (since CSS is bundled in the JS).

3. **Test the site:**
   Visit `https://transport.on-forge.com/login` - it should work now.

## Why This Happened

- Previous code had `@vite(['resources/css/app.css', 'resources/js/app.jsx'])` in `app.blade.php`
- We fixed it to only `@vite(['resources/js/app.jsx'])` since CSS is imported in `app.jsx`
- But production still has the old code and old built assets
- The old manifest.json still references CSS separately, causing the error

## If Still Not Working

1. **Check Laravel logs:**
   ```bash
   tail -100 storage/logs/laravel.log
   ```

2. **Verify file permissions:**
   ```bash
   ls -la public/build/
   chmod -R 755 public/build
   ```

3. **Verify assets were built:**
   ```bash
   ls -lah public/build/assets/
   ```
   You should see `.js` and `.css` files there.

4. **Check APP_ENV:**
   Make sure `.env` has `APP_ENV=production`

