<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Student;
use App\Models\User;
use App\Notifications\Admin\BookingExpiredAlert;
use App\Notifications\BookingExpired;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class BookingExpiryTest extends TestCase
{
    use RefreshDatabase;

    private function makeExpiredBooking(): Booking
    {
        $parent = User::factory()->create(['role' => 'parent']);
        $student = Student::factory()->create(['parent_id' => $parent->id]);

        return Booking::factory()
            ->expiredByDate()
            ->create(['student_id' => $student->id]);
    }

    public function test_expired_booking_flips_to_expired_status(): void
    {
        Notification::fake();
        $booking = $this->makeExpiredBooking();

        app(BookingService::class)->updateBookingStatuses();

        $this->assertSame(Booking::STATUS_EXPIRED, $booking->fresh()->status);
    }

    public function test_parent_and_admin_are_notified_on_expiry(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = $this->makeExpiredBooking();
        $parent = $booking->student->parent;

        app(BookingService::class)->updateBookingStatuses();

        Notification::assertSentTo($parent, BookingExpired::class);
        Notification::assertSentTo($admin, BookingExpiredAlert::class);
    }

    public function test_expired_student_drops_off_active_route_roster(): void
    {
        Notification::fake();
        $booking = $this->makeExpiredBooking();
        $routeId = $booking->route_id;

        app(BookingService::class)->updateBookingStatuses();

        $today = now()->toDateString();
        $activeOnRoute = Booking::where('route_id', $routeId)
            ->whereIn('status', Booking::activeStatuses())
            ->where('start_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
            })
            ->count();

        $this->assertSame(0, $activeOnRoute, 'Expired booking must not appear on the active roster');
    }
}
