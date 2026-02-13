<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Only show parents and drivers (not admins)
        $query->whereIn('role', ['parent', 'driver']);

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'role' => $request->role ?? '',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:parent,driver',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['email_verified_at'] = now();

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        // Prevent editing admin users
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            abort(403, 'Cannot edit admin users.');
        }

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Prevent editing admin users
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            abort(403, 'Cannot edit admin users.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:parent,driver',
        ]);

        // Only update password if provided
        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting admin users
        if (in_array($user->role, ['super_admin', 'transport_admin', 'admin'])) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Cannot delete admin users.');
        }

        // Delete user - DB cascades will handle related records:
        // - Parents: students are cascade-deleted via parent_id FK
        // - Drivers: routes get driver_id set to null via FK
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle parent account status (enable/disable)
     * When disabling, remove all students from routes and cancel active bookings
     */
    public function toggleParentStatus(User $user)
    {
        // Only allow toggling parent accounts
        if ($user->role !== 'parent') {
            return redirect()->route('admin.users.index')
                ->with('error', 'Can only toggle status for parent accounts.');
        }

        DB::transaction(function () use ($user) {
            $isCurrentlyActive = $user->is_active ?? true;
            $newStatus = !$isCurrentlyActive;

            // Update user status
            $user->update(['is_active' => $newStatus]);

            if (!$newStatus) {
                // Disabling parent account
                // Remove all students from routes
                Student::where('parent_id', $user->id)
                    ->whereNotNull('route_id')
                    ->update(['route_id' => null, 'pickup_point_id' => null]);

                // Cancel all active bookings for this parent's students
                $studentIds = $user->students()->pluck('id');
                Booking::whereIn('student_id', $studentIds)
                    ->whereIn('status', ['pending', 'awaiting_approval', 'active'])
                    ->update(['status' => 'cancelled']);
            }
        });

        $status = ($user->is_active ?? true) ? 'enabled' : 'disabled';
        return redirect()->route('admin.users.index')
            ->with('success', "Parent account {$status} successfully. " . 
                   (!$user->is_active ? "All students have been removed from routes and active bookings cancelled." : ""));
    }
}









