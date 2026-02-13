<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationRequestController extends Controller
{
    /**
     * Display a list of pending parent registration requests.
     */
    public function index(): Response
    {
        $pendingParents = User::where('role', 'parent')
            ->whereNull('registration_approved_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($user) => array_merge($user->toArray(), [
                'profile_picture_url' => $user->profile_picture_url,
            ]));

        return Inertia::render('Admin/RegistrationRequests/Index', [
            'pendingParents' => $pendingParents,
        ]);
    }

    /**
     * Approve a parent registration request.
     */
    public function approve(User $user): RedirectResponse
    {
        if ($user->role !== 'parent') {
            return redirect()->route('admin.registration-requests.index')
                ->with('error', 'Only parent accounts can be approved.');
        }

        if ($user->registration_approved_at !== null) {
            return redirect()->route('admin.registration-requests.index')
                ->with('error', 'This account has already been approved.');
        }

        $user->update(['registration_approved_at' => now()]);

        // Notify parent that their account has been approved
        $user->notify(new \App\Notifications\Parent\AccountApproved($user));

        return redirect()->route('admin.registration-requests.index')
            ->with('success', 'Parent account approved successfully. They can now log in.');
    }

    /**
     * Reject a parent registration request (deletes the user).
     */
    public function reject(User $user): RedirectResponse
    {
        if ($user->role !== 'parent') {
            return redirect()->route('admin.registration-requests.index')
                ->with('error', 'Only parent accounts can be rejected.');
        }

        if ($user->registration_approved_at !== null) {
            return redirect()->route('admin.registration-requests.index')
                ->with('error', 'This account has already been approved.');
        }

        $user->delete();

        return redirect()->route('admin.registration-requests.index')
            ->with('success', 'Registration request rejected and user removed.');
    }
}
