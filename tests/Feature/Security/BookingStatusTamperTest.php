<?php

namespace Tests\Feature\Security;

use App\Models\Booking;
use App\Models\PickupPoint;
use App\Models\Route;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingStatusTamperTest extends TestCase
{
    use RefreshDatabase;

    public function test_parent_cannot_self_activate_a_pending_booking(): void
    {
        $parent = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);
        $student = Student::factory()->create(['parent_id' => $parent->id]);
        $booking = Booking::factory()->create([
            'student_id' => $student->id,
            'status' => Booking::STATUS_PENDING,
            'start_date' => now()->addWeek()->toDateString(),
        ]);

        $this->actingAs($parent)->put(route('parent.bookings.update', $booking), [
            'status' => Booking::STATUS_ACTIVE,
        ]);

        // status must NOT have been applied from request input.
        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    public function test_store_request_accepts_pickup_point_without_pickup_address(): void
    {
        $parent = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);
        $student = Student::factory()->create(['parent_id' => $parent->id]);
        $route = Route::factory()->create();
        $pickupPoint = PickupPoint::factory()->for($route, 'route')->create();

        $response = $this->actingAs($parent)->post(route('parent.bookings.store'), [
            'student_id' => $student->id,
            'route_id' => $route->id,
            'pickup_point_id' => $pickupPoint->id,
            // pickup_address intentionally omitted — should be allowed when a point is chosen.
            'plan_type' => 'monthly',
            'trip_type' => 'two_way',
            'trip_direction' => 'both',
            'start_date' => now()->addWeek()->toDateString(),
        ]);

        // Whatever else happens downstream, pickup_address must not be a validation error.
        $response->assertSessionDoesntHaveErrors('pickup_address');
    }
}
