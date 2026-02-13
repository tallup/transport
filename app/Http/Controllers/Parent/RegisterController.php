<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
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
     * Parent is not logged in; admin must approve before they can access the system.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'registration_approved_at' => null,
        ];

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profile-pictures', $filename, 'public');
            $userData['profile_picture'] = $path;
        }

        // Only add role if column exists
        if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
            $userData['role'] = 'parent';
        }

        $user = User::create($userData);

        event(new Registered($user));

        // Notify admins of new parent registration
        $adminService = app(\App\Services\AdminNotificationService::class);
        $adminService->notifyAdmins(new \App\Notifications\Admin\NewParentRegistered($user));

        return redirect()->route('parent.registration.pending');
    }
}

