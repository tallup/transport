# Booking-period-end notifications + student deactivation

Date: 2026-06-29
Branch: feat/booking-expiry-notifications

## Problem

When a booking's period ends (`end_date` passes), nobody is notified and the
student is not cleanly removed from the route:

- The expiry logic exists in `BookingService::updateBookingStatuses()` (flips
  `active` -> `expired`, emails the parent via `BookingExpired`), **but the
  `bookings:update-statuses` command is never scheduled** — `routes/console.php`
  only schedules `bookings:notify-starting-soon`. So in production nothing ever
  expires a booking: status stays `active` forever, the parent email never
  fires.
- Admins are never told a booking expired (no `Admin\BookingExpiredAlert`).
- The parent notification is mail-only; other booking notifications also use
  in-app (`database`) + PWA push.

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

1. **Schedule the command (root fix)** — `routes/console.php`:
   `Schedule::command('bookings:update-statuses')->dailyAt('06:00');`
   Runs before drivers load rosters so expired students drop the same morning.

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
