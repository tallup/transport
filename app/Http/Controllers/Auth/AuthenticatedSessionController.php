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
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        
        // Force session save to ensure cookie is properly set
        $request->session()->save();

        // Redirect based on user role - ignore intended URL to prevent role mismatch
        $user = $request->user();
        $role = $user->attributes['role'] ?? $user->role ?? null;
        
        // Clear any intended URL to prevent redirecting to wrong portal
        $request->session()->forget('url.intended');
        
        if (in_array($role, ['super_admin', 'transport_admin', 'admin'])) {
            return redirect()->route('admin.dashboard');
        }
        
        if ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        }

        // Use same server redirect as admin/driver so session cookie is set reliably.
        // The previous 409 + X-Inertia-Location could cause "session expired" when the
        // cookie wasn't applied before the client-side redirect in some environments.
        return redirect()->route('parent.dashboard');
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
