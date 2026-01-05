# How to Update User Role on Production

## Quick Method: Use Laravel Tinker (Recommended)

1. **SSH into your Forge server** (via Forge's SSH button or your terminal)

2. **Navigate to your project directory:**
   ```bash
   cd /home/forge/transport.on-forge.com/current
   ```

3. **Run tinker:**
   ```bash
   php artisan tinker
   ```

4. **In tinker, run these commands:**
   ```php
   $user = \App\Models\User::where('email', 'transport@transport.com')->first();
   $user->role = 'super_admin';
   $user->save();
   exit
   ```

5. **Verify it worked:**
   ```php
   $user = \App\Models\User::where('email', 'transport@transport.com')->first();
   echo $user->role; // Should output: super_admin
   exit
   ```

## Alternative: Direct Database Access

If you have database access via Forge:

1. Go to your Forge site → **Database** tab
2. Click **Open Database** or use your database client
3. Run this SQL:
   ```sql
   UPDATE users SET role = 'super_admin' WHERE email = 'transport@transport.com';
   ```

## After Updating

1. **Log out** of your application
2. **Log back in**
3. You should now have access to `/admin/dashboard` and `/filament-admin/schools`

## Verify Access

After logging back in, try accessing:
- `/admin/dashboard` - Should work now
- `/filament-admin/schools` - Should work now



