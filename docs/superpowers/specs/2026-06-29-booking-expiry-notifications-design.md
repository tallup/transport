# Booking-period-end notifications + student deactivation

Date: 2026-06-29
Branch: feat/booking-expiry-notifications

## Problem

When a booking's period ends (`end_date` passes), nobody is notified and the
student is not cleanly removed from the route:

- **Admins are never told a booking expired** (no `Admin\BookingExpiredAlert`).
  This is a genuine code gap.
- The parent notification is mail-only; other booking notifications also use
  in-app (`database`) + PWA push.

### Root-cause correction

Initial scouting (which read only `routes/console.php`) concluded the
`bookings:update-statuses` command was never scheduled. **That was wrong** —
`bootstrap/app.php` already schedules it `->hourly()` (line 37). The expiry
logic in `BookingService::updateBookingStatuses()` (flips `active` -> `expired`,
emails parent via `BookingExpired`) therefore does run, *provided the server's
`schedule:run` cron is configured*.

So if production shows "parent not notified / student still active", the most
likely cause is **the Laravel scheduler cron is not running on the server**
(an infra check for Forge), not missing code. We did NOT add a duplicate
schedule entry. Code changes here cover the real gaps: the missing admin alert
and richer parent channels.

## Source of truth

A student is "active in a route" via their **Booking**, not the denormalized
`Student.route_id`. The driver roster query
(`DailyRoster` / `RosterService`) filters by
`whereIn('status', Booking::activeStatuses())` AND
`start_date <= today` AND (`end_date` null OR `end_date >= today`). So flipping
status to `expired` removes the student from the roster automatically.

## Decisions (approved)

- **Admin notify:** per-booking alert (one email per expired booking), mirroring
  the existing `Admin\NewBookingCreated` pattern.
- **Parent channels:** mail + in-app (`database`) + PWA push.
- **Deactivation:** status flip only. Leave `Student.route_id` /
  `pickup_point_id` denormalized cache untouched (safe for rebooking).

## Changes

1. **Scheduling** — no change. `bootstrap/app.php` already runs
   `bookings:update-statuses` hourly. Verify the server `schedule:run` cron
   separately (infra).

2. **Parent `BookingExpired`** — `via()` returns `['mail', 'database']`
   (`toArray()` already present). PWA push sent from the service loop via
   `PushNotificationHelper::sendIfSubscribed()`.

3. **Admin `BookingExpiredAlert`** — new `app/Notifications/Admin/BookingExpiredAlert.php`
   (channel: `mail`) + view `resources/views/emails/admin/booking-expired.blade.php`,
   mirroring `Admin\NewBookingCreated`.

4. **`BookingService::updateBookingStatuses()`** — inject
   `AdminNotificationService` + `PushNotificationHelper` via the constructor
   (alongside `CalendarService`). In the existing per-booking try/catch loop,
   after the parent mail/db notify: send parent push, then
   `notifyAdmins(new Admin\BookingExpiredAlert($booking))`. Each side-effect
   wrapped so one failure never aborts the run.

## Testing

Feature test (`tests/Feature`):
- Active booking with `end_date` in the past.
- `Notification::fake()`, run `artisan bookings:update-statuses`.
- Assert booking status == `expired`.
- Assert parent received `BookingExpired`; admin received `BookingExpiredAlert`.
- Assert the student no longer matches the active-roster query for that date.

## Out of scope

- Daily-digest admin summary (chose per-booking).
- Clearing `Student.route_id` on expiry.
- `BookingExpiringSoon` (pre-expiry reminder) — separate existing flow.
