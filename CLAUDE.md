# CLAUDE.md

## Project Overview
On-Time Transportation — a school transport booking and management platform. Parents book seats for students on routes with pickup points; drivers run routes; admins manage everything. Stripe-based payments via Laravel Cashier with PayPal as a secondary provider.

## Stack
- **Backend:** Laravel 12 (PHP 8.2+)
- **Admin:** Filament 3 (two panels: Admin + Driver)
- **Frontend:** Inertia.js + React 19, Tailwind 3, Vite 7
- **Payments:** Laravel Cashier 16 (Stripe) + `@stripe/react-stripe-js`; `srmklive/paypal` for PayPal
- **Realtime:** Laravel Reverb + Laravel Echo + Pusher JS client
- **Auth:** Sanctum + Breeze + Socialite
- **Other:** Spatie ActivityLog, Maatwebsite Excel, barryvdh DomPDF, AWS SDK (SES), web-push (PWA), Ziggy

## Common Commands
```bash
composer dev          # concurrent: serve + queue:listen + pail + vite
composer test         # config:clear + artisan test (PHPUnit 11)
php artisan migrate
php artisan queue:listen
php artisan reverb:start
npm run build
```

## Directory Layout
- `app/Models/` — Eloquent models
- `app/Filament/Resources/` — Admin panel CRUD
- `app/Filament/Driver/` — Driver panel (separate Filament panel)
- `app/Providers/Filament/` — `AdminPanelProvider`, `DriverPanelProvider`
- `app/Http/Controllers/Webhook/StripeWebhookController.php` — Stripe webhooks
- `resources/js/` — Inertia React pages
- `routes/web.php`, `routes/auth.php`, `routes/channels.php`
- `database/migrations/` — domain tables start 2025_12_24

## Domain Models
`User`, `Student`, `School`, `Route`, `Vehicle`, `PickupPoint`, `Booking`, `PricingRule`, `Discount`, `DailyPickup`, `RouteStart`/`RouteCompletion`, `StudentAbsence`, `CalendarEvent`, `Policy`, `Message`/`MessageThread`/`MessageAttachment`, `PushSubscription`.

## Payment Integration
- **Env:** `STRIPE_KEY`, `STRIPE_SECRET`, `CASHIER_CURRENCY` (defaults usd), `CASHIER_PATH=stripe`
- **Webhook:** `POST /webhooks/stripe` → `StripeWebhookController@handleWebhook` (CSRF-excluded, rate limited)
- **Booking flow:** `POST /bookings/create-payment-intent` → `paymentSuccess` or `skipPayment` (all throttled 10/1)
- **Subscriptions:** Cashier `customer_columns` + `subscriptions` migrations present
- See `STRIPE_INTEGRATION_REVIEW.md` for audit notes

## Conventions
- Two Filament panels: `/admin` (full) and `/driver` (driver-scoped)
- Inertia React for public/parent-facing pages; Filament for staff/driver UIs
- Webhook controllers under `app/Http/Controllers/Webhook/`
- Heavy use of operational markdown docs at repo root (deploy, SES, Reverb, sessions)
- Deployed via Forge to DigitalOcean — see `DEPLOY.md`, `DEPLOY_SCRIPT_FORGE.txt`
- Mail via AWS SES; PWA push via `minishlink/web-push`
- Roles surfaced through `SUPER_ADMIN_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` env vars
