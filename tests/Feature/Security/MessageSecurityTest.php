<?php

namespace Tests\Feature\Security;

use App\Models\Booking;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MessageSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_unrelated_user_cannot_open_thread_for_another_parents_booking(): void
    {
        $owner = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);
        $student = Student::factory()->create(['parent_id' => $owner->id]);
        $booking = Booking::factory()->create(['student_id' => $student->id]);

        $attacker = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);

        $this->actingAs($attacker)->postJson(route('messages.store'), [
            'booking_id' => $booking->id,
            'message' => 'Let me see this booking',
        ])->assertForbidden();
    }

    public function test_booking_owner_can_message_about_their_booking(): void
    {
        $owner = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);
        $student = Student::factory()->create(['parent_id' => $owner->id]);
        $booking = Booking::factory()->create(['student_id' => $student->id]);

        $this->actingAs($owner)->postJson(route('messages.store'), [
            'booking_id' => $booking->id,
            'message' => 'Question about pickup time',
        ])->assertOk();
    }

    public function test_message_attachment_rejects_disallowed_file_type(): void
    {
        Storage::fake('public');

        $sender = User::factory()->create(['role' => 'parent', 'registration_approved_at' => now()]);
        $recipient = User::factory()->create(['role' => 'transport_admin']);

        $this->actingAs($sender)->postJson(route('messages.store'), [
            'recipient_id' => $recipient->id,
            'message' => 'See attached',
            'attachments' => [UploadedFile::fake()->create('payload.exe', 50)],
        ])->assertStatus(422)->assertJsonValidationErrors('attachments.0');
    }
}
