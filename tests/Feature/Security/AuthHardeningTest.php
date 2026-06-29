<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_deactivated_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'role' => 'parent',
            'registration_approved_at' => now(),
            'is_active' => false,
        ]);

        $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_active_approved_user_can_login(): void
    {
        $user = User::factory()->create([
            'role' => 'parent',
            'registration_approved_at' => now(),
            'is_active' => true,
        ]);

        $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_profile_picture_route_requires_authentication(): void
    {
        $this->get('/profile-pictures/some-file.jpg')
            ->assertRedirect(route('login'));
    }

    public function test_profile_picture_route_blocks_path_traversal(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/profile-pictures/'.rawurlencode('../../.env'))
            ->assertNotFound();
    }
}
