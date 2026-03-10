<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google for authentication.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google. Find or create user, log in, redirect by role.
     */
    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if (! $user) {
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user && ! $user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            if (! $user) {
                $user = $this->createUserFromGoogle($googleUser);
            }
        }

        Auth::login($user, true);
        request()->session()->regenerate();

        return $this->redirectByRole($user);
    }

    protected function createUserFromGoogle(SocialiteUser $googleUser): User
    {
        $userData = [
            'name' => $googleUser->getName() ?: $googleUser->getEmail(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'password' => Hash::make(Str::random(64)),
            'email_verified_at' => now(),
            'registration_approved_at' => now(),
        ];

        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
            $userData['role'] = 'parent';
        }

        $user = User::create($userData);

        event(new \Illuminate\Auth\Events\Registered($user));

        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\NewParentRegistered($user));

        return $user;
    }

    protected function redirectByRole(User $user): RedirectResponse
    {
        $role = $user->attributes['role'] ?? $user->role ?? null;

        if (in_array($role, ['super_admin', 'transport_admin'])) {
            return redirect()->route('admin.dashboard');
        }

        if ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        }

        return redirect()->route('parent.dashboard');
    }
}
