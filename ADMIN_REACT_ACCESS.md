# How to Access the Admin React Interface

## Prerequisites

1. **Server must be running:**
   ```bash
   php artisan serve
   ```

2. **Assets must be built:**
   ```bash
   npm run build
   ```

## Step-by-Step Access

### 1. Log In First

You **must** log in before accessing admin routes. The admin routes are protected by authentication middleware.

1. Go to: `http://127.0.0.1:8000/login` (or `http://localhost:8000/login`)

2. Enter admin credentials:
   - **Email:** `admin@transport.com`
   - **Password:** `password`

3. Click "Log in"

### 2. Access Admin Dashboard

After logging in, you can access:

- **Admin Dashboard:** `http://127.0.0.1:8000/admin/dashboard`
- **Students:** `http://127.0.0.1:8000/admin/students`
- **Vehicles:** `http://127.0.0.1:8000/admin/vehicles`
- **Routes:** `http://127.0.0.1:8000/admin/routes`
- **Pickup Points:** `http://127.0.0.1:8000/admin/pickup-points`
- **Bookings:** `http://127.0.0.1:8000/admin/bookings`
- **Pricing Rules:** `http://127.0.0.1:8000/admin/pricing-rules`
- **Calendar Events:** `http://127.0.0.1:8000/admin/calendar-events`

## Troubleshooting

### Issue: Redirected to Login Page

**Cause:** You're not logged in or your session expired.

**Solution:** 
1. Go to `/login` and log in with admin credentials
2. After successful login, you'll be redirected to your dashboard
3. Then navigate to `/admin/dashboard`

### Issue: 403 Forbidden Error

**Cause:** Your user doesn't have admin role.

**Solution:**
1. Verify your user's role:
   ```bash
   php artisan tinker
   ```
   Then:
   ```php
   $user = \App\Models\User::where('email', 'admin@transport.com')->first();
   echo $user->attributes['role'] ?? $user->role ?? 'NOT SET';
   // Should output: super_admin or transport_admin
   ```

2. If role is not set, update it:
   ```php
   $user->role = 'super_admin';
   $user->save();
   ```

### Issue: Page Not Found (404)

**Cause:** Assets not built or route doesn't exist.

**Solution:**
1. Rebuild assets:
   ```bash
   npm run build
   ```

2. Clear cache:
   ```bash
   php artisan route:clear
   php artisan config:clear
   php artisan cache:clear
   ```

### Issue: Blank Page / No Content

**Cause:** JavaScript errors or assets not loading.

**Solution:**
1. Check browser console for errors (F12)
2. Rebuild assets:
   ```bash
   npm run build
   ```
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "Page not found: ./Pages/Admin/Dashboard.jsx"

**Cause:** React component file missing or Vite not built.

**Solution:**
1. Verify the file exists: `resources/js/Pages/Admin/Dashboard.jsx`
2. Rebuild assets:
   ```bash
   npm run build
   ```

## Quick Test

To quickly test if everything is working:

1. Start the server:
   ```bash
   php artisan serve
   ```

2. Build assets (if not done):
   ```bash
   npm run build
   ```

3. Open browser and go to: `http://127.0.0.1:8000/login`

4. Log in with:
   - Email: `admin@transport.com`
   - Password: `password`

5. After login, go to: `http://127.0.0.1:8000/admin/dashboard`

You should see the admin dashboard with statistics and navigation menu.

## Admin User Credentials

If the admin user doesn't exist, run the seeder:

```bash
php artisan db:seed --class=UserSeeder
```

This creates:
- **Super Admin:** `admin@transport.com` / `password`
- **Transport Admin:** `transport@transport.com` / `password`

**⚠️ SECURITY WARNING:** Change default passwords immediately after first login!

## Development Mode

If you're developing and want hot-reloading:

1. In one terminal, start Laravel:
   ```bash
   php artisan serve
   ```

2. In another terminal, start Vite:
   ```bash
   npm run dev
   ```

Then access: `http://127.0.0.1:8000/admin/dashboard`

**Note:** Vite dev server will handle hot-reloading of React components automatically.




