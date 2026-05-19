<?php

namespace Tests\Feature;

use App\Jobs\ScanUploadedFile;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_student_rejects_svg(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'parent']);
        $this->actingAs($user);

        $response = $this->post(route('parent.students.store'), [
            'name' => 'Test Student',
            'emergency_phone' => '0712345678',
            'emergency_contact_name' => 'Parent Name',
            'school_id' => School::factory()->create()->id,
            'profile_picture' => UploadedFile::fake()->create('evil.svg', 100, 'image/svg+xml'),
        ]);

        $response->assertSessionHasErrors('profile_picture');
    }

    public function test_store_student_rejects_heic(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'parent']);
        $this->actingAs($user);

        $response = $this->post(route('parent.students.store'), [
            'name' => 'Test Student',
            'emergency_phone' => '0712345678',
            'emergency_contact_name' => 'Parent Name',
            'school_id' => School::factory()->create()->id,
            'profile_picture' => UploadedFile::fake()->create('photo.heic', 100, 'image/heic'),
        ]);

        $response->assertSessionHasErrors('profile_picture');
    }

    public function test_store_student_accepts_jpeg(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'parent']);
        $this->actingAs($user);

        $response = $this->post(route('parent.students.store'), [
            'name' => 'Test Student',
            'emergency_phone' => '0712345678',
            'emergency_contact_name' => 'Parent Name',
            'school_id' => School::factory()->create()->id,
            'profile_picture' => UploadedFile::fake()->image('photo.jpg'),
        ]);

        $response->assertSessionDoesntHaveErrors('profile_picture');
    }

    public function test_scan_job_dispatched_on_student_store(): void
    {
        Queue::fake();
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'parent']);
        $this->actingAs($user);

        $this->post(route('parent.students.store'), [
            'name' => 'Test Student',
            'emergency_phone' => '0712345678',
            'emergency_contact_name' => 'Parent Name',
            'school_id' => School::factory()->create()->id,
            'profile_picture' => UploadedFile::fake()->image('photo.jpg'),
        ]);

        Queue::assertPushed(ScanUploadedFile::class);
    }

    public function test_students_store_has_throttle_middleware(): void
    {
        $middlewares = collect(app('router')->getRoutes()->getByName('parent.students.store')?->gatherMiddleware() ?? []);
        $this->assertTrue(
            $middlewares->contains(fn ($m) => str_starts_with($m, 'throttle:')),
            'parent.students.store route must carry throttle middleware'
        );
    }

    public function test_bookings_store_has_throttle_middleware(): void
    {
        $middlewares = collect(app('router')->getRoutes()->getByName('parent.bookings.store')?->gatherMiddleware() ?? []);
        $this->assertTrue(
            $middlewares->contains(fn ($m) => str_starts_with($m, 'throttle:')),
            'parent.bookings.store route must carry throttle middleware'
        );
    }
}
