# User Credentials Reference

All users created by the seeders have the default password: **`password`**

⚠️ **IMPORTANT:** Change all passwords immediately after seeding on production!

---

## 🔑 Admin Accounts

### Super Admin
- **Email:** `admin@transport.com`
- **Password:** `password`
- **Role:** `super_admin`
- **Access:** Full admin panel access at `/admin/dashboard`
- **Note:** Has access to all features and settings

### Transport Admin
- **Email:** `transport@transport.com`
- **Password:** `password`
- **Role:** `transport_admin`
- **Access:** Full admin panel access at `/admin/dashboard`
- **Note:** Can manage transport operations

---

## 🚗 Driver Accounts

### Driver 1
- **Name:** John Driver
- **Email:** `john.driver@transport.com`
- **Password:** `password`
- **Role:** `driver`
- **Access:** Driver portal at `/driver/dashboard`
- **Note:** View assigned route and daily rosters

### Driver 2
- **Name:** Jane Smith
- **Email:** `jane.smith@transport.com`
- **Password:** `password`
- **Role:** `driver`
- **Access:** Driver portal at `/driver/dashboard`
- **Note:** View assigned route and daily rosters

### Driver 3
- **Name:** Mike Johnson
- **Email:** `mike.johnson@transport.com`
- **Password:** `password`
- **Role:** `driver`
- **Access:** Driver portal at `/driver/dashboard`
- **Note:** View assigned route and daily rosters

---

## 👨‍👩‍👧 Parent Accounts

### Parent 1
- **Name:** Sarah Johnson
- **Email:** `sarah.johnson@example.com`
- **Password:** `password`
- **Role:** `parent`
- **Access:** Parent portal at `/parent/dashboard`
- **Note:** Can register students and book transport

### Parent 2
- **Name:** David Brown
- **Email:** `david.brown@example.com`
- **Password:** `password`
- **Role:** `parent`
- **Access:** Parent portal at `/parent/dashboard`
- **Note:** Can register students and book transport

### Parent 3
- **Name:** Emily Davis
- **Email:** `emily.davis@example.com`
- **Password:** `password`
- **Role:** `parent`
- **Access:** Parent portal at `/parent/dashboard`
- **Note:** Can register students and book transport

### Parent 4
- **Name:** Michael Wilson
- **Email:** `michael.wilson@example.com`
- **Password:** `password`
- **Role:** `parent`
- **Access:** Parent portal at `/parent/dashboard`
- **Note:** Can register students and book transport

### Parent 5
- **Name:** Jessica Martinez
- **Email:** `jessica.martinez@example.com`
- **Password:** `password`
- **Role:** `parent`
- **Access:** Parent portal at `/parent/dashboard`
- **Note:** Can register students and book transport

---

## 📋 Quick Reference Table

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| **Super Admin** | admin@transport.com | password | `/admin/dashboard` |
| **Transport Admin** | transport@transport.com | password | `/admin/dashboard` |
| **Driver 1** | john.driver@transport.com | password | `/driver/dashboard` |
| **Driver 2** | jane.smith@transport.com | password | `/driver/dashboard` |
| **Driver 3** | mike.johnson@transport.com | password | `/driver/dashboard` |
| **Parent 1** | sarah.johnson@example.com | password | `/parent/dashboard` |
| **Parent 2** | david.brown@example.com | password | `/parent/dashboard` |
| **Parent 3** | emily.davis@example.com | password | `/parent/dashboard` |
| **Parent 4** | michael.wilson@example.com | password | `/parent/dashboard` |
| **Parent 5** | jessica.martinez@example.com | password | `/parent/dashboard` |

---

## 🚀 How to Create These Accounts

Run the seeder:

```bash
php artisan db:seed --class=UserSeeder
```

Or run all seeders:

```bash
php artisan db:seed
```

---

## 🔐 Change Passwords After Seeding

**In production, immediately change all passwords:**

```bash
php artisan tinker
```

```php
use Illuminate\Support\Facades\Hash;

// Change Super Admin password
$admin = \App\Models\User::where('email', 'admin@transport.com')->first();
$admin->password = Hash::make('YOUR_SECURE_PASSWORD');
$admin->save();

// Change Transport Admin password
$transportAdmin = \App\Models\User::where('email', 'transport@transport.com')->first();
$transportAdmin->password = Hash::make('YOUR_SECURE_PASSWORD');
$transportAdmin->save();

// Change all driver passwords
\App\Models\User::where('role', 'driver')->get()->each(function($driver) {
    $driver->password = Hash::make('YOUR_SECURE_PASSWORD');
    $driver->save();
});

// Change all parent passwords
\App\Models\User::where('role', 'parent')->get()->each(function($parent) {
    $parent->password = Hash::make('YOUR_SECURE_PASSWORD');
    $parent->save();
});
```

---

## 📍 Login URLs

- **Login Page:** `/login`
- **Admin Dashboard:** `/admin/dashboard` (after admin login)
- **Driver Dashboard:** `/driver/dashboard` (after driver login)
- **Parent Dashboard:** `/parent/dashboard` (after parent login)

---

## ✨ Automatic Redirects

After login, users are automatically redirected based on their role:
- **Super Admin & Transport Admin** → `/admin/dashboard`
- **Driver** → `/driver/dashboard`
- **Parent** → `/parent/dashboard`








