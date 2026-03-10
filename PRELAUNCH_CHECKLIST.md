# Pre-launch checklist (before users start next week)

Use this list so the system runs correctly in production.

## 1. Database

- **Run pending migrations** on the production database:
  ```bash
  php artisan migrate
  ```
  If you use MySQL/MariaDB in production, all migrations are compatible. SQLite compatibility was fixed for tests only.

## 2. Environment (.env)

- **APP_KEY** – Must be set (`php artisan key:generate` if missing).
- **APP_ENV=production** – For production.
- **APP_DEBUG=false** – Never turn on in production (exposes errors and config).
- **APP_URL** – Set to your real URL (e.g. `https://yoursite.com`).
- **DB_*** – Use your production database (MySQL/MariaDB recommended).

## 3. Optional but important

- **Mail** – If you use notifications (e.g. admin new registration, password reset), set `MAIL_*` and optionally `ADMIN_NOTIFICATION_EMAIL` in `.env` (see `.env.example` comment).
- **Stripe** – If parents pay online, set `STRIPE_KEY`, `STRIPE_SECRET`, and `STRIPE_WEBHOOK_SECRET`; webhook URL: `https://your-domain.com/webhooks/stripe`.
- **Reverb (WebSockets)** – If you use real-time features, run the Reverb server and set `REVERB_*` and `VITE_REVERB_*` as in `.env.example`.

## 4. After deployment

- **Storage link**: `php artisan storage:link` (for profile pictures etc.).
- **Cache config**: `php artisan config:cache` and `php artisan route:cache` (optional, for performance).
- **Queue worker** – If you use queues (e.g. for notifications), run `php artisan queue:work` (or use Supervisor/systemd).

## 5. Tests (already passing)

The test suite runs successfully (25 tests), including auth (login, registration, password reset), profile, and migrations. Fixes applied:

- Migrations are SQLite-compatible so tests run; production MySQL is unchanged.
- Auth tests expect parent redirect and approved users where required.

## 6. Quick smoke checks

- Visit `/` → redirect to login or correct dashboard by role.
- Log in as parent → `/parent/dashboard`.
- Log in as admin → `/admin/dashboard`.
- Create a booking (parent) and approve it (admin) to confirm the main flow.
