<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        try {
            $canResetPassword = Route::has('password.request');
        } catch (\Exception $e) {
            $canResetPassword = false;
        }

        $status = session('status');
        if ($request->query('expired')) {
            $status = $status ?: 'Your session expired. Please sign in again.';
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => $canResetPassword,
            'status' => $status,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): \Symfony\Component\HttpFoundation\Response
    {
        $request->authenticate();

        $request->session()->regenerate();
        $request->session()->save();

        $user = $request->user();
        $role = $user->attributes['role'] ?? $user->role ?? null;

        $request->session()->forget('url.intended');

        if (in_array($role, ['super_admin', 'transport_admin', 'admin'])) {
            $target = route('admin.dashboard');
        } elseif ($role === 'driver') {
            $target = route('driver.dashboard');
        } else {
            $target = route('parent.dashboard');
        }

        // Force a full-page redirect (not Inertia XHR) so the browser fully
        // applies the new session cookie before loading the destination page.
        if ($request->header('X-Inertia')) {
            return \Inertia\Inertia::location($target);
        }

        return redirect($target);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
