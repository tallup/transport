# Real-Time Updates Across Portals

Real-time updates use **Laravel Reverb** (WebSockets) and **Laravel Echo** so that parent, admin, and driver portals see changes without refreshing.

## How It Works

1. **Backend** dispatches a `PortalUpdate` event to specific user IDs (e.g. parent when admin approves a booking, admins when payment is received).
2. **Reverb** broadcasts the event to each user’s private channel (`App.Models.User.{id}`).
3. **Echo** on the frontend subscribes to the current user’s private channel and listens for `portal.update`.
4. When an event is received, the current page is **reloaded** so data (bookings, dashboard, etc.) stays in sync.

## When Updates Are Sent

| Action | Who gets the update |
|--------|----------------------|
| Admin approves a booking | Parent (booking owner) |
| Parent pays (Stripe or PayPal) | All admins |
| Driver marks pickup/dropoff complete | Parent + all admins |

## Setup

### 1. Environment

Copy the Reverb and Vite vars from `.env.example` into your `.env`:

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

For production, set `REVERB_HOST` (and optionally `REVERB_PORT` / `REVERB_SCHEME`) to your public Reverb host (e.g. `ws.yourapp.com`, port 443, scheme https).

### 2. Run Reverb

Start the Reverb server (separate from `php artisan serve`):

```bash
php artisan reverb:start
```

For local dev it listens on `0.0.0.0:8080` by default. Keep this process running (e.g. in a second terminal or via Supervisor in production).

### 3. Queue Worker

Broadcasts are queued. Run a queue worker so events are actually sent:

```bash
php artisan queue:work
```

### 4. Frontend

Echo is already set up in `resources/js/echo.js` and `RealTimeListener` is included in the authenticated layouts (Parent, Admin, Driver). Rebuild assets after changing env:

```bash
npm run build
```

## Adding More Real-Time Events

1. **Dispatch** a `PortalUpdate` where the action happens:

   ```php
   use App\Events\PortalUpdate;

   event(new PortalUpdate(
       [ $userId1, $userId2 ],  // user IDs to notify
       'event_type',            // e.g. 'booking_cancelled'
       'Short message',
       [ 'booking_id' => 123 ]  // optional data
   ));
   ```

2. The frontend does not need changes: it already listens for `portal.update` and reloads the page. Optionally you can use the event payload in `RealTimeListener` (e.g. show a toast or only reload certain data).

## Production

- Run Reverb behind your web server (e.g. Nginx proxy to `localhost:8080`).
- Use **Supervisor** (or similar) to keep `reverb:start` and `queue:work` running.
- Set `REVERB_HOST` / `REVERB_SCHEME` so the browser connects to your public WebSocket URL (e.g. `wss://ws.yourapp.com`).

## Alternative: Polling

If you prefer not to run Reverb, you can refresh data on a timer (e.g. every 30–60 seconds) on dashboard and booking list pages with `router.reload()` inside `setInterval`. That gives updates without WebSockets but with a delay and extra requests.
