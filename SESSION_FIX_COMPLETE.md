# Complete Session Expiration Fix

## What Was Done
- Improved keep-alive pings (every 2 minutes + on user activity)
- Added pre-flight keep-alive before booking submission and checkout
- Changed price calculation to GET (no CSRF)
- Added fallback email recipient for users without email
- Fixed 419 redirects to login instead of blank screen

## What You Need to Do on Forge (Production)

### 1. Update Environment Variables

Add/Update these in **Forge → Environment**:

```env
# Session Configuration (CRITICAL)
SESSION_LIFETIME=480
SESSION_DOMAIN=ontimetransportwa.com
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
APP_URL=https://ontimetransportwa.com

# Mail Fallback (prevents crashes when user has no email)
MAIL_FALLBACK_TO_ADDRESS=transport@transport.com

# Ensure ONLY ONE MAIL_MAILER line exists (remove any MAIL_MAILER=log)
MAIL_MAILER=ses

# PayPal (ensure NO duplicates)
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=AauTiSBIZXsz_vvgZixuJrzoMg8Xiiz2iessdETru1Lu419NakL88Kr48fI95jRI-iF_5PhJEsUqy7Y5
PAYPAL_SANDBOX_CLIENT_SECRET=EKl16a4-vzhiR_o9fCLbauOTSmawRDdnRmSqA3GgAKWwb5OUNkjphyzPhyUyreYs9k_aQtuojQm65Tz0
PAYPAL_CURRENCY=USD
```

### 2. Deploy Latest Code

In Forge:
- Click **Deploy Now** to pull commit `0ff0954`
- Wait for deployment to complete

### 3. Clear Cached Config

After deployment, run these commands (Forge → Commands or SSH):

```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

### 4. Verify

Test the following:
- [ ] Make a new booking (should not see "page expired")
- [ ] Cancel a booking (should not get 500 error)
- [ ] Delete a cancelled booking (should work)
- [ ] Logout (should redirect to login, no 419)
- [ ] PayPal payment (should work without client_id error)
- [ ] Check if emails are being sent (not just logged)

## If Issues Persist

1. **Session still expires too fast:**
   - Increase `SESSION_LIFETIME` to `720` (12 hours) and clear config cache

2. **PayPal client_id still missing:**
   - Check for duplicate PAYPAL_* keys in Environment
   - Remove any with empty values
   - Clear config cache again

3. **Emails not sending:**
   - Ensure `MAIL_MAILER=ses` (NOT `log`)
   - Ensure AWS SES keys are set
   - Check `storage/logs/laravel.log` for "Mailer [ses-v2]" errors

4. **Still getting blank screens:**
   - Check browser console for network errors
   - Share the latest log entry from `storage/logs/laravel.log`

