<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Email verification is disabled app-wide (User::hasVerifiedEmail() always returns true).
     * Visiting this route must NOT log the user out — that was causing surprise logouts when an
     * already-authenticated user opened a stale verification link. Just send them home.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Keep the session intact; redirect to the role-based home.
        return redirect('/')->with('status', 'Your email is verified.');
    }
}
