<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->redirectByRole($user)->with('verified', true);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->redirectByRole($user)->with('verified', true);
    }

    protected function redirectByRole($user): RedirectResponse
    {
        $role = $user->attributes['role'] ?? $user->role ?? null;

        if (in_array($role, ['super_admin', 'transport_admin', 'admin'])) {
            return redirect()->route('admin.dashboard');
        }

        if ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        }

        return redirect()->route('parent.dashboard');
    }
}
