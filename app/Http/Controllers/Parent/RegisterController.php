<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Display the parent registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Parent/Register');
    }

    /**
     * Display the pending approval page after registration.
     */
    public function pending(): Response
    {
        return Inertia::render('Parent/RegistrationPending');
    }

    /**
     * Handle an incoming parent registration request.
     * Account is auto-approved; parent is logged in and redirected to dashboard.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'registration_approved_at' => now(),
            'email_verified_at' => now(),
        ];

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $ext = preg_replace('/[^a-z0-9]/', '', strtolower($file->getClientOriginalExtension())) ?: 'jpg';
            $filename = time() . '_' . \Illuminate\Support\Str::random(10) . '.' . $ext;
            $path = $file->storeAs('profile-pictures', $filename, 'public');
            $userData['profile_picture'] = $path;
        }

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

