# Automatic Booking Expiration & Route Removal

## Problem
Students were not being automatically removed from routes when their booking periods ended, causing confusion for drivers and incorrect rosters.

## Solution Implemented
Created an automated system that:
1. ✅ Checks booking statuses every hour
2. ✅ Expires bookings that have passed their end date
3. ✅ Removes expired students from route rosters automatically
4. ✅ Sends email notifications to parents when bookings expire

---

## How It Works

### 1. Scheduled Task
A scheduled command runs **every hour** to update booking statuses:

```php
// bootstrap/app.php
$schedule->command('bookings:update-statuses')->hourly();
```

### 2. Status Update Logic
The `BookingService::updateBookingStatuses()` method:

- **Activates** pending bookings when `start_date` is reached
- **Expires** active bookings when `end_date` has passed
- **Sends notifications** to parents when bookings expire
- **Removes** expired students from route rosters automatically

### 3. Roster Filtering
The `RosterService` automatically excludes expired bookings:

```php
// Only includes bookings with status 'pending' or 'active'
$bookings = Booking::where('route_id', $route->id)
    ->whereIn('status', ['pending', 'active'])
    ->where('start_date', '<=', $date)
    ->where(function ($query) use ($date) {
        $query->whereNull('end_date')
            ->orWhere('end_date', '>=', $date);
    })
    ->get();
```

### 4. Parent Notification
When a booking expires, parents receive an email with:
- ✅ Expired booking details
- ✅ Information about what this means
- ✅ Link to create a new booking
- ✅ Professional, clear messaging

---

## Booking Status Flow

```
┌─────────┐  start_date reached   ┌────────┐  end_date passed   ┌─────────┐
│ Pending │ ────────────────────> │ Active │ ────────────────> │ Expired │
└─────────┘                        └────────┘                    └─────────┘
                                        │
                                        │ Student appears
                                        │ on route roster
                                        │
                                   ┌────▼────┐
                                   │ Roster  │
                                   │ Updated │
                                   └─────────┘
```

---

## Files Created

### 1. Notification Class
**File:** `app/Notifications/BookingExpired.php`
- Queued notification sent when booking expires
- Includes booking details and renewal options

### 2. Email Template
**File:** `resources/views/emails/booking-expired.blade.php`
- Professional HTML email design
- Clear explanation of expiration
- Call-to-action to create new booking

---

## Files Modified

### 1. Booking Service
**File:** `app/Services/BookingService.php`
- Enhanced `updateBookingStatuses()` method
- Added notification sending for expired bookings
- Properly handles booking lifecycle

### 2. Scheduler Configuration
**File:** `bootstrap/app.php`
- Added hourly scheduled task for status updates
- Runs automatically via cron job

---

## Manual Commands

### Check and Update Booking Statuses
```bash
php artisan bookings:update-statuses
```

This command:
- Activates pending bookings that should start
- Expires active bookings that have ended
- Sends notifications to affected parents
- Shows summary of changes

### View Scheduled Tasks
```bash
php artisan schedule:list
```

Expected output:
```
0 * * * * php artisan bookings:update-statuses ......... Next Due: 1 hour from now
```

### Test Manually (Run All Scheduled Tasks)
```bash
php artisan schedule:run
```

---

## Production Setup

### 1. Ensure Cron is Running
The Laravel scheduler requires a cron entry:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Verify Queue Worker
Notifications are queued, so ensure queue worker is running:

```bash
php artisan queue:work --tries=3
```

For production, use Supervisor to keep it running:

```ini
[program:transport-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path-to-project/artisan queue:work --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path-to-project/storage/logs/worker.log
```

### 3. Test the System

**Test 1: Create a booking that expires tomorrow**
```sql
-- Set a booking to expire tomorrow (for testing)
UPDATE bookings 
SET end_date = CURDATE() 
WHERE id = [booking_id];
```

Then run:
```bash
php artisan bookings:update-statuses
```

You should see:
- Booking status changed to 'expired'
- Email sent to parent
- Student removed from route roster

**Test 2: Check roster**
```bash
# View driver roster for today
# Student should NOT appear if booking expired
```

---

## What Drivers See

### Before Expiration
```
Route: Morning Route A
Date: 2026-01-18

Pickup Point: School Street Corner
- John Doe (Student #123)
- Jane Smith (Student #456)
```

### After Expiration (John's booking expired)
```
Route: Morning Route A
Date: 2026-01-18

Pickup Point: School Street Corner
- Jane Smith (Student #456)
```

---

## What Parents Receive

### Email Subject
"Booking Expired - Renew to Continue Service"

### Email Content
- Clear notification that booking has expired
- Booking details (student, route, dates)
- Explanation of what this means
- Button to create new booking
- Support contact information

---

## Monitoring

### Check for Expired Bookings
```sql
SELECT 
    b.id,
    b.status,
    s.name as student_name,
    b.start_date,
    b.end_date,
    b.plan_type
FROM bookings b
JOIN students s ON b.student_id = s.id
WHERE b.status = 'expired'
ORDER BY b.end_date DESC;
```

### Check Active Bookings Count
```sql
SELECT COUNT(*) as active_bookings
FROM bookings
WHERE status = 'active'
AND (end_date IS NULL OR end_date >= CURDATE());
```

### View Upcoming Expirations
```sql
SELECT 
    b.id,
    s.name as student_name,
    b.end_date,
    DATEDIFF(b.end_date, CURDATE()) as days_remaining,
    r.name as route_name
FROM bookings b
JOIN students s ON b.student_id = s.id
JOIN routes r ON b.route_id = r.id
WHERE b.status = 'active'
AND b.end_date IS NOT NULL
AND b.end_date >= CURDATE()
AND b.end_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY b.end_date ASC;
```

---

## Benefits

✅ **Automatic Route Updates** - Drivers always see accurate rosters
✅ **No Manual Intervention** - System handles everything automatically
✅ **Parent Communication** - Parents are notified when service ends
✅ **Accurate Capacity** - Route capacity reflects actual active students
✅ **Clear Audit Trail** - Booking status history is tracked
✅ **Reduced Confusion** - Everyone knows when service starts/stops

---

## Troubleshooting

### Issue: Bookings Not Expiring
**Check:**
1. Is cron running? `crontab -l`
2. Is scheduler working? `php artisan schedule:list`
3. Run manually: `php artisan bookings:update-statuses`
4. Check logs: `tail -f storage/logs/laravel.log`

### Issue: Notifications Not Sent
**Check:**
1. Is queue worker running? `ps aux | grep queue:work`
2. Check failed jobs: `php artisan queue:failed`
3. Verify email config: `php artisan config:show mail`
4. Test email: `php artisan test:email your@email.com`

### Issue: Students Still Appear on Roster
**Check:**
1. Verify booking status in database
2. Confirm roster generation uses correct query
3. Clear cache: `php artisan cache:clear`
4. Check if booking dates are correct

---

## Future Enhancements

Potential improvements for the future:

1. **Grace Period** - Allow 1-2 day grace period before removal
2. **Renewal Reminders** - Multiple reminders before expiration
3. **Auto-Renewal** - Option for automatic booking renewal
4. **SMS Notifications** - Send text messages in addition to email
5. **Dashboard Alerts** - Show expiring bookings on parent dashboard
6. **Admin Reports** - Weekly summary of expired bookings
7. **Seasonal Patterns** - Analyze when bookings typically expire

---

## Related Features

- **Booking Expiring Notifications** - Warns 3 days before expiration
- **Session Management** - Keeps users logged in during active use
- **Daily Activity Summary** - Admins receive booking activity reports
- **Email System** - AWS SES for reliable delivery

---

## Support

If you have questions or issues:
- Email: support@ontimetransport.awsapps.com
- Check logs: `storage/logs/laravel.log`
- Run diagnostics: `php artisan schedule:list`

