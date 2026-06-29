<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class VerifyEmailNoLogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_visiting_verify_email_link_does_not_log_the_user_out(): void
    {
        $user = User::factory()->create([
            'role' => 'parent',
            'registration_approved_at' => now(),
        ]);

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        // The user must remain authenticated (previously this route logged them out).
        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/');
    }
}
