# Pre-Deployment Testing Checklist

## Server Status
- ✅ Laravel server running on http://localhost:8000
- ✅ VAPID keys configured
- ✅ Config and routes cached

---

## 1. PWA Features Testing

### Service Worker
- [ ] Open browser DevTools → Application → Service Workers
- [ ] Verify service worker is registered
- [ ] Check service worker is active
- [ ] Test offline functionality (disable network, reload page)

### Web App Manifest
- [ ] Visit http://localhost:8000/manifest.json
- [ ] Verify manifest loads correctly
- [ ] Check icons are accessible
- [ ] Test "Add to Home Screen" on mobile device

### Push Notifications Setup
- [ ] Visit http://localhost:8000/api/push/vapid-public-key
- [ ] Verify returns JSON with publicKey
- [ ] Check browser console for service worker registration
- [ ] Verify notification permission prompt appears

---

## 2. Analytics Dashboard Testing

### Access Dashboard
- [ ] Login as admin user
- [ ] Navigate to /admin/analytics
- [ ] Verify dashboard loads without errors

### Dashboard Components
- [ ] **Overview Tab**: Check key metrics display
  - Total Revenue
  - Active Routes
  - Total Drivers
  - Average Utilization
- [ ] **Revenue Tab**: Verify revenue trends chart displays
- [ ] **Capacity Tab**: Check capacity heatmap shows routes
- [ ] **Drivers Tab**: Verify driver performance table loads
- [ ] **Routes Tab**: Check route efficiency metrics table

### Date Range Filter
- [ ] Select different start/end dates
- [ ] Click "Apply Filter"
- [ ] Verify data updates correctly

### Report Export
- [ ] Click "Export Report" button
- [ ] Select different report types (Revenue, Capacity, Driver, Route)
- [ ] Select different formats (PDF, Excel)
- [ ] Verify export completes successfully

### API Endpoints
- [ ] Test GET /admin/analytics/revenue
- [ ] Test GET /admin/analytics/capacity
- [ ] Test GET /admin/analytics/drivers/{driver}
- [ ] Test GET /admin/analytics/routes/{route}
- [ ] Test POST /admin/analytics/export

---

## 3. Push Notifications Testing

### Subscription
- [ ] Login as any user (parent/driver/admin)
- [ ] Open browser console
- [ ] Check for "Service Worker registered" message
- [ ] Verify push subscription is created
- [ ] Check database: `SELECT * FROM push_subscriptions WHERE user_id = ?`

### Send Test Notification
```bash
php artisan tinker
```
```php
$user = \App\Models\User::first();
$pushService = app(\App\Services\PushNotificationService::class);
$pushService->sendPushNotification(
    $user,
    'Test Notification',
    'This is a test push notification',
    ['type' => 'test', 'url' => '/parent/dashboard']
);
```
- [ ] Verify notification appears in browser
- [ ] Click notification, verify it opens correct page

### Event-Based Notifications
- [ ] **Booking Created**: Create a new booking, verify push notification sent
- [ ] **Payment Received**: Complete a payment, verify push notification sent
- [ ] **Booking Cancelled**: Cancel a booking, verify push notification sent
- [ ] **Student Picked Up**: Driver marks student complete, verify push notification sent
- [ ] **Route Completed**: Driver completes route, verify push notification sent
- [ ] **Driver Assigned**: Assign driver to route, verify push notifications sent (driver + parents)

---

## 4. Email Notifications Testing

### Verify Email Configuration
- [ ] Check .env has MAIL_MAILER configured
- [ ] Verify AWS SES credentials are set (if using SES)
- [ ] Test email sending:
```bash
php artisan tinker
```
```php
\Mail::raw('Test email', function($msg) {
    $msg->to('your-email@example.com')->subject('Test');
});
```

### Event-Based Emails
- [ ] Create booking → Check email received
- [ ] Complete payment → Check email received
- [ ] Cancel booking → Check email received
- [ ] Driver marks pickup → Check email received
- [ ] Route completed → Check email received

---

## 5. Database & Migrations

### Check Migrations
```bash
php artisan migrate:status
```
- [ ] All migrations are "Ran" (except any that are intentionally pending)
- [ ] No migration errors

### Verify Tables
- [ ] `push_subscriptions` table exists
- [ ] `analytics_*` tables exist (if any)
- [ ] All core tables exist (users, bookings, routes, etc.)

---

## 6. Performance & Errors

### Check Logs
```bash
tail -f storage/logs/laravel.log
```
- [ ] No critical errors
- [ ] No warnings about missing configurations

### Browser Console
- [ ] Open DevTools → Console
- [ ] Check for JavaScript errors
- [ ] Verify no 404 errors for assets
- [ ] Check for service worker errors

### Network Tab
- [ ] Verify all API calls return 200 OK
- [ ] Check response times are reasonable
- [ ] Verify no failed requests

---

## 7. Security Checks

### Authentication
- [ ] Admin routes require authentication
- [ ] Admin routes require admin role
- [ ] Driver routes require driver role
- [ ] Parent routes require authentication

### CSRF Protection
- [ ] Verify CSRF token is present in meta tags
- [ ] Test form submissions work correctly

### API Endpoints
- [ ] VAPID public key endpoint is accessible (no auth required - OK)
- [ ] Push subscription endpoints require authentication
- [ ] Analytics endpoints require admin authentication

---

## 8. Mobile/Responsive Testing

### Responsive Design
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Verify analytics dashboard is responsive
- [ ] Check navigation works on mobile
- [ ] Verify PWA install prompt appears on mobile

### Touch Interactions
- [ ] Test all buttons/links work on touch
- [ ] Verify charts are interactive on mobile
- [ ] Check tables are scrollable on mobile

---

## 9. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

---

## 10. Final Verification

### Quick Smoke Test
1. [ ] Login as admin → Access analytics dashboard
2. [ ] Login as parent → Create booking
3. [ ] Login as driver → View roster
4. [ ] Verify push notifications work
5. [ ] Verify email notifications work
6. [ ] Check all routes are accessible
7. [ ] Verify no console errors
8. [ ] Check logs for errors

### Deployment Readiness
- [ ] All tests pass
- [ ] No critical errors in logs
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Queue worker can process jobs
- [ ] Cache cleared and rebuilt

---

## Test Commands

```bash
# Check server is running
curl http://localhost:8000

# Test VAPID endpoint
curl http://localhost:8000/api/push/vapid-public-key

# Check routes
php artisan route:list

# Check config
php artisan config:show services.webpush

# Test queue
php artisan queue:work --once

# Clear all caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Known Issues to Fix

1. ⚠️ Migration error: `2026_01_22_210000_add_awaiting_approval_status_to_bookings_table` - SQLite doesn't support MODIFY COLUMN
   - **Fix**: Need to update migration for SQLite compatibility or use MySQL/PostgreSQL

---

## Notes

- Server running on: http://localhost:8000
- VAPID Public Key: BHpPJhOgj1x4if3EHBROrkNuGpMxc5yA_bVT2p7Sf8uUBMUdKDwYXN--r4w9J1cMLVrot9-c3q1AMMbWAg4D1oQ
- Test user credentials: Check USER_CREDENTIALS.md

