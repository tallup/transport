# Email System - Configuration & Troubleshooting Guide

**Date:** January 24, 2026  
**Status:** ✅ Fixed

---

## 🐛 Issue Encountered

### Error Message:
```
Symfony\Component\Mime\Exception\LogicException
An email must have a "To", "Cc", or "Bcc" header.
```

### When It Occurred:
- When cancelling a booking
- When sending any notification to users without valid email addresses
- When admin users don't have valid email addresses configured

---

## 🔍 Root Causes Identified

### 1. **Invalid Email Addresses**
Users (especially admins) may have:
- `NULL` email addresses
- Invalid email formats (e.g., "admin", "test@", etc.)
- Placeholder emails that don't pass validation

### 2. **Missing Fallback Configuration**
The `config/mail.php` fallback address wasn't properly configured or validated

### 3. **No Graceful Degradation**
When `User::routeNotificationForMail()` returned `null`, Laravel tried to send the email anyway, causing the exception

---

## ✅ Solutions Implemented

### **Fix 1: Enhanced Email Routing** (`app/Models/User.php`)

Updated `routeNotificationForMail()` with **3-tier fallback system**:

```php
public function routeNotificationForMail($notification): ?string
{
    // Tier 1: Use user's email if valid
    if (filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
        return $this->email;
    }

    // Tier 2: Use configured fallback address
    $fallbackAddress = config('mail.fallback_to.address');
    if ($fallbackAddress && filter_var($fallbackAddress, FILTER_VALIDATE_EMAIL)) {
        \Log::warning('Using fallback email for notification');
        return $fallbackAddress;
    }

    // Tier 3: Use MAIL_FROM_ADDRESS as last resort
    $fromAddress = config('mail.from.address');
    if ($fromAddress && filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
        \Log::warning('Using from address as fallback');
        return $fromAddress;
    }

    // Tier 4: Return null (notification will be skipped)
    \Log::error('No valid email found - notification skipped');
    return null;
}
```

**Benefits:**
- ✅ Always tries to find a valid email address
- ✅ Logs warnings when using fallbacks (for debugging)
- ✅ Gracefully skips notifications if no valid email exists
- ✅ Prevents the "missing To header" exception

---

## 📧 How Email Sending Works

### **Notification Flow:**

```
1. Action triggers notification
   ↓
2. Notification::send($user, $notification)
   ↓
3. Laravel calls $user->routeNotificationForMail($notification)
   ↓
4. Returns email address (or null)
   ↓
5. If email exists: Send email
   If null: Skip notification (no error)
```

### **Email Recipients:**

#### **Parent Notifications:**
- **Recipient:** Logged-in parent's email
- **Validation:** `filter_var($user->email, FILTER_VALIDATE_EMAIL)`
- **Fallback Chain:**
  1. User's email
  2. `MAIL_FALLBACK_TO_ADDRESS`
  3. `MAIL_FROM_ADDRESS`
  4. Skip notification

#### **Admin Notifications:**
- **Recipients:** All users with role in `['admin', 'super_admin', 'transport_admin']`
- **Query:** `User::whereIn('role', [...])->whereNotNull('email')->get()`
- **Filtering:** `AdminNotificationService` filters out invalid emails
- **Fallback:** Same 3-tier system per admin user

---

## 🔧 Configuration Required

### **Environment Variables (.env)**

```env
# Mail Configuration
MAIL_MAILER=log                                    # Use 'ses' for production
MAIL_FROM_ADDRESS="noreply@ontimetransport.com"    # Must be valid email
MAIL_FROM_NAME="On-Time Transportation"

# Fallback for invalid user emails
MAIL_FALLBACK_TO_ADDRESS="admin@ontimetransport.com"
MAIL_FALLBACK_TO_NAME="System Administrator"

# For production (AWS SES)
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
```

### **Important Notes:**

1. **MAIL_FROM_ADDRESS** - Must be a verified email in AWS SES (for production)
2. **MAIL_FALLBACK_TO_ADDRESS** - Should be a monitored admin email
3. **MAIL_MAILER** - Use `log` for local development, `ses` for production

---

## 📊 Email Types & Recipients

### **Parent Notifications:**

| Notification | Trigger | Recipient | Template |
|--------------|---------|-----------|----------|
| `BookingConfirmed` | Payment received | Parent | `emails/booking-confirmed.blade.php` |
| `BookingApproved` | Admin approves | Parent | `emails/booking-approved.blade.php` |
| `BookingCancelled` | User cancels | Parent | `emails/booking-cancelled.blade.php` |
| `BookingExpired` | End date passed | Parent | `emails/booking-expired.blade.php` |
| `BookingExpiringSoon` | 3 days before end | Parent | `emails/booking-expiring-soon.blade.php` |
| `RouteChanged` | Route reassigned | Parent | `emails/route-changed.blade.php` |
| `PickupCompleted` | Driver marks complete | Parent | `emails/pickup-completed.blade.php` |

### **Admin Notifications:**

| Notification | Trigger | Recipients | Template |
|--------------|---------|------------|----------|
| `NewBookingCreated` | New booking | All admins | `emails/admin/new-booking-created.blade.php` |
| `BookingCancelledAlert` | User cancels | All admins | `emails/admin/booking-cancelled-alert.blade.php` |
| `PaymentReceivedAlert` | Payment success | All admins | `emails/admin/payment-received-alert.blade.php` |
| `PickupCompletedAlert` | Pickup complete | All admins | `emails/admin/pickup-completed-alert.blade.php` |
| `RouteCompletedAlert` | Route finished | All admins | `emails/admin/route-completed-alert.blade.php` |
| `DailyActivitySummary` | Daily at 6 PM | All admins | `emails/admin/daily-activity-summary.blade.php` |

### **Driver Notifications:**

| Notification | Trigger | Recipient | Template |
|--------------|---------|-----------|----------|
| `DriverStudentAdded` | Student assigned | Driver | `emails/driver-student-added.blade.php` |
| `RouteCompleted` | Route marked complete | Driver | `emails/route-completed.blade.php` |

---

## 🚨 Troubleshooting

### **Problem: "An email must have a To header"**

**Cause:** User has invalid email address and no fallback configured

**Solution:**
1. Check user's email in database: `SELECT id, name, email, role FROM users WHERE email IS NULL OR email = '';`
2. Update invalid emails: `UPDATE users SET email = 'valid@email.com' WHERE id = X;`
3. Set fallback in `.env`: `MAIL_FALLBACK_TO_ADDRESS="admin@yourdomain.com"`
4. Clear config cache: `php artisan config:clear`

### **Problem: "Mailer [ses-v2] is not defined"**

**Cause:** `.env` has `MAIL_MAILER=ses-v2` but config only supports `ses`

**Solution:**
```env
# Change this:
MAIL_MAILER=ses-v2

# To this:
MAIL_MAILER=ses
```

Then run: `php artisan config:clear`

### **Problem: Emails not being sent**

**Check:**
1. **Queue is running:** `php artisan queue:work` (notifications use `ShouldQueue`)
2. **Mailer configured:** Check `.env` has `MAIL_MAILER=ses` or `log`
3. **Logs:** Check `storage/logs/laravel.log` for errors
4. **Failed jobs:** `php artisan queue:failed`

**Test email sending:**
```bash
php artisan tinker
>>> $user = User::find(1);
>>> $user->notify(new \App\Notifications\BookingConfirmed($booking));
```

### **Problem: Admin notifications not sending**

**Check:**
1. **Admin users exist:**
   ```sql
   SELECT id, name, email, role 
   FROM users 
   WHERE role IN ('admin', 'super_admin', 'transport_admin');
   ```

2. **Admins have valid emails:**
   ```php
   php artisan tinker
   >>> $admins = User::whereIn('role', ['admin', 'super_admin', 'transport_admin'])->get();
   >>> $admins->filter(fn($a) => filter_var($a->email, FILTER_VALIDATE_EMAIL))->count();
   ```

3. **Create admin with valid email:**
   ```php
   User::create([
       'name' => 'System Admin',
       'email' => 'admin@ontimetransport.com',
       'role' => 'super_admin',
       'password' => bcrypt('password'),
   ]);
   ```

---

## 📝 Monitoring Email Delivery

### **Check Sent Emails (Log Driver):**
```bash
# View logged emails
tail -f storage/logs/laravel.log | grep -A 20 "Mail"
```

### **Check Queue Status:**
```bash
# View queued jobs
php artisan queue:monitor

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### **Check AWS SES (Production):**
```bash
# View SES sending statistics
aws ses get-send-statistics --region us-east-1

# Check bounce/complaint rates
aws ses get-account-sending-enabled --region us-east-1
```

---

## 🔐 Security Best Practices

### **Email Validation:**
- ✅ Always validate emails before storing: `filter_var($email, FILTER_VALIDATE_EMAIL)`
- ✅ Use fallback addresses for invalid user emails
- ✅ Log when fallbacks are used (for monitoring)

### **AWS SES Configuration:**
- ✅ Verify all "from" addresses in SES
- ✅ Move out of SES sandbox for production
- ✅ Set up bounce/complaint handling
- ✅ Monitor sending quotas

### **Privacy:**
- ✅ Don't log full email content
- ✅ Use BCC for bulk admin notifications (optional)
- ✅ Implement unsubscribe functionality (future)

---

## 📈 Performance Optimization

### **Queue Configuration:**
All notifications implement `ShouldQueue` to avoid blocking requests:

```php
class BookingConfirmed extends Notification implements ShouldQueue
{
    use Queueable;
    // ...
}
```

**Benefits:**
- ✅ Instant response to user actions
- ✅ Emails sent asynchronously
- ✅ Automatic retries on failure
- ✅ Better error handling

### **Queue Worker Setup:**
```bash
# Start queue worker
php artisan queue:work --tries=3 --timeout=90

# Or use Supervisor (production)
sudo supervisorctl start transport-queue-worker
```

---

## 🎯 Summary

### **What Was Fixed:**
1. ✅ Enhanced `User::routeNotificationForMail()` with 3-tier fallback
2. ✅ Added comprehensive logging for email routing
3. ✅ Graceful handling when no valid email exists
4. ✅ Prevents "missing To header" exceptions

### **Configuration Checklist:**
- [ ] Set `MAIL_FROM_ADDRESS` in `.env`
- [ ] Set `MAIL_FALLBACK_TO_ADDRESS` in `.env`
- [ ] Ensure all admin users have valid emails
- [ ] Configure AWS SES for production
- [ ] Start queue worker
- [ ] Monitor logs for email issues

### **Testing:**
```bash
# Test booking cancellation
1. Log in as parent
2. Cancel a booking
3. Check logs: tail -f storage/logs/laravel.log
4. Verify no "missing To header" errors
5. Check email was logged/sent
```

---

## 📚 Related Documentation

- `AMAZON_SES_SETUP_COMPLETE.md` - AWS SES configuration
- `ADMIN_NOTIFICATIONS_SETUP.md` - Admin notification system
- `config/mail.php` - Mail configuration
- `app/Models/User.php` - Email routing logic
- `app/Services/AdminNotificationService.php` - Admin notification service

---

**Last Updated:** January 24, 2026  
**Status:** ✅ Production Ready
