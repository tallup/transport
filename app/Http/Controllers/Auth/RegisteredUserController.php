<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ];

        // Only add role if column exists
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
            $userData['role'] = 'parent';
        }

        $user = User::create($userData);

        // Send welcome email to the new user
        $user->notify(new \App\Notifications\WelcomeNotification());

        // Notify admins of new parent registration
        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\NewParentRegistered($user));

        return redirect()->route('login')
            ->with('status', 'Your account has been created successfully! A confirmation email has been sent to your inbox. You can now log in.');
    }
}
