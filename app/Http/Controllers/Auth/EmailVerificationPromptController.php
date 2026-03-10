<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            $role = $user->attributes['role'] ?? $user->role ?? null;
            if (in_array($role, ['super_admin', 'transport_admin', 'admin'])) {
                return redirect()->route('admin.dashboard');
            }
            if ($role === 'driver') {
                return redirect()->route('driver.dashboard');
            }
            return redirect()->route('parent.dashboard');
        }

        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
