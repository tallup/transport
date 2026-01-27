# PWA & Push Notifications Setup Guide

## Overview
This guide covers the setup and configuration of Progressive Web App (PWA) features and push notifications for the School Transport System.

---

## ✅ Completed Features

### PWA Features
- ✅ Service Worker (`public/sw.js`) - Offline caching, background sync
- ✅ Web App Manifest (`public/manifest.json`) - App installation, icons, shortcuts
- ✅ Service Worker Registration (`resources/js/utils/serviceWorkerRegistration.js`)
- ✅ Offline Manager (`resources/js/utils/offlineManager.js`)
- ✅ PWA manifest linked in `app.blade.php`

### Push Notifications
- ✅ Push Notification Service (`app/Services/PushNotificationService.php`)
- ✅ Push Subscription Controller (`app/Http/Controllers/PushSubscriptionController.php`)
- ✅ Push Subscription Model (`app/Models/PushSubscription.php`)
- ✅ VAPID Public Key API Endpoint (`/api/push/vapid-public-key`)
- ✅ Push notifications integrated into:
  - Booking created
  - Payment received
  - Booking cancelled
  - Student picked up/dropped off
  - Route completed
  - Driver assigned

---

## 🔧 Setup Instructions

### 1. Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for push notifications. Generate them using one of these methods:

#### Option A: Using Node.js (Recommended)
```bash
npm install -g web-push
web-push generate-vapid-keys
```

This will output:
```
Public Key: <your-public-key>
Private Key: <your-private-key>
```

#### Option B: Using Online Tool
Visit: https://web-push-codelab.glitch.me/

#### Option C: Using PHP
```bash
composer require minishlink/web-push
php artisan tinker
```
Then in tinker:
```php
$keys = \Minishlink\WebPush\VAPID::createVapidKeys();
echo "Public: " . $keys['publicKey'] . "\n";
echo "Private: " . $keys['privateKey'] . "\n";
```

### 2. Configure Environment Variables

Add the VAPID keys to your `.env` file:

```env
VAPID_PUBLIC_KEY=your-public-key-here
VAPID_PRIVATE_KEY=your-private-key-here
```

**Important:** 
- The public key will be exposed to clients (this is safe)
- The private key must be kept secret (never commit to version control)

### 3. Clear Configuration Cache

After adding the keys, clear the config cache:

```bash
php artisan config:clear
php artisan config:cache
```

### 4. Verify Configuration

Check that the keys are loaded correctly:

```bash
php artisan tinker
```

```php
config('services.webpush.public_key'); // Should return your public key
config('services.webpush.private_key'); // Should return your private key (should not be null)
```

### 5. Database Migration

Ensure the `push_subscriptions` table exists:

```bash
php artisan migrate
```

If the migration doesn't exist, create it:

```bash
php artisan make:migration create_push_subscriptions_table
```

Migration content:
```php
Schema::create('push_subscriptions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('endpoint')->unique();
    $table->string('public_key')->nullable();
    $table->string('auth_token')->nullable();
    $table->string('content_encoding', 16)->default('aesgcm');
    $table->timestamps();
});
```

---

## 📱 How It Works

### Service Worker Registration

1. **Automatic Registration**: The service worker is automatically registered when the app loads (`resources/js/app.jsx`)

2. **Push Subscription**: When a user is authenticated (has `user-id` meta tag), the app automatically attempts to subscribe to push notifications

3. **Permission Request**: The browser will prompt the user for notification permission

### Push Notification Flow

1. **User Subscribes**: 
   - User visits the app
   - Browser requests notification permission
   - Subscription data is saved to database via `/push-subscriptions` endpoint

2. **Server Sends Notification**:
   - Event occurs (booking created, payment received, etc.)
   - `PushNotificationHelper` checks if user has subscriptions
   - `PushNotificationService` sends push notification to all user's devices

3. **User Receives Notification**:
   - Service worker receives push event
   - Shows browser notification
   - User clicks notification → opens app to relevant page

---

## 🎯 Push Notification Events

The following events trigger push notifications:

| Event | Recipient | Title | Body |
|-------|-----------|-------|------|
| **Booking Created** | Parent | "Booking Received" | "Your booking has been created. Please complete payment to confirm." |
| **Payment Received** | Parent | "Payment Received" | "Your payment has been processed. Booking is pending approval." |
| **Booking Cancelled** | Parent | "Booking Cancelled" | "Your booking has been cancelled." |
| **Student Picked Up** | Parent | "Student Picked Up" | "Your student has been picked up from [location]" |
| **Student Dropped Off** | Parent | "Student Dropped Off" | "Your student has been safely dropped off at [location]" |
| **Route Completed** | Parent | "Route Completed" | "The [AM/PM] route has been completed successfully." |
| **Driver Assigned** | Driver | "Route Assigned" | "You have been assigned to route: [route name]" |
| **Driver Assigned** | Parent | "Driver Assigned" | "A driver has been assigned to your child's route: [route name]" |

---

## 🔍 Testing Push Notifications

### 1. Test Subscription

Open browser console and check:
```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistration().then(reg => console.log(reg));

// Check if subscribed
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => console.log(sub));
});
```

### 2. Test Manual Push

Using Tinker:
```bash
php artisan tinker
```

```php
$user = \App\Models\User::find(1); // Replace with actual user ID
$pushService = app(\App\Services\PushNotificationService::class);
$pushService->sendPushNotification(
    $user,
    'Test Notification',
    'This is a test push notification',
    ['type' => 'test', 'url' => '/parent/dashboard']
);
```

### 3. Test via API

```bash
curl -X POST http://your-domain.com/api/test-push \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"user_id": 1, "title": "Test", "body": "Test message"}'
```

---

## 🛠️ Troubleshooting

### Issue: Push notifications not working

**Checklist:**
1. ✅ VAPID keys are set in `.env`
2. ✅ Config cache is cleared
3. ✅ Service worker is registered (check browser DevTools → Application → Service Workers)
4. ✅ User has granted notification permission
5. ✅ User has active push subscriptions in database
6. ✅ Queue worker is running (if notifications are queued)

### Issue: "VAPID public key not configured"

**Solution:**
1. Ensure `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are in `.env`
2. Run `php artisan config:clear`
3. Verify keys are loaded: `php artisan tinker` → `config('services.webpush.public_key')`

### Issue: Service worker not registering

**Check:**
1. App is served over HTTPS (required for service workers)
2. Service worker file exists at `public/sw.js`
3. No console errors in browser DevTools

### Issue: Notifications not appearing

**Check:**
1. Browser notification permission is granted
2. User has push subscriptions in `push_subscriptions` table
3. Check browser console for errors
4. Verify service worker is active (DevTools → Application → Service Workers)

---

## 📦 Required Packages

Ensure these packages are installed:

```bash
# Backend
composer require minishlink/web-push

# Frontend (already in package.json)
# No additional packages needed - uses native browser APIs
```

---

## 🔐 Security Notes

1. **VAPID Private Key**: Never expose in client-side code or commit to version control
2. **HTTPS Required**: Service workers and push notifications require HTTPS (except localhost)
3. **User Consent**: Always request permission before subscribing
4. **Subscription Validation**: Server validates subscription endpoints before sending

---

## 📚 Additional Resources

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)

---

## ✅ Verification Checklist

- [ ] VAPID keys generated and added to `.env`
- [ ] Config cache cleared
- [ ] Database migration run (`push_subscriptions` table exists)
- [ ] Service worker registered (check DevTools)
- [ ] Push subscription endpoint working (`/push-subscriptions`)
- [ ] VAPID public key endpoint working (`/api/push/vapid-public-key`)
- [ ] Test push notification sent successfully
- [ ] Notifications appear in browser
- [ ] Notification click opens correct page

---

## 🎉 You're All Set!

Once configured, push notifications will automatically work for:
- ✅ Booking events
- ✅ Payment confirmations
- ✅ Pickup/drop-off notifications
- ✅ Route completions
- ✅ Driver assignments

Users will receive real-time notifications even when the app is not open!

