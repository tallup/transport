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
    public function create(): Response
    {
        try {
            $canResetPassword = Route::has('password.request');
        } catch (\Exception $e) {
            $canResetPassword = false;
        }
        
        return Inertia::render('Auth/Login', [
            'canResetPassword' => $canResetPassword,
            'status' => session('status'),
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
        
        if (in_array($role, ['super_admin', 'transport_admin'])) {
            return redirect()->route('admin.dashboard');
        }
        
        if ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        }

        // Force full-page redirect for parent so the dashboard loads with a proper
        // document request and session cookie (avoids login → dashboard → back to login)
        $parentDashboardUrl = url()->route('parent.dashboard');
        return response('', 409)
            ->header('X-Inertia-Location', $parentDashboardUrl);
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
