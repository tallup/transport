<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admins can view all students
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can view their own students
        if ($user->role === 'parent') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Student $student): bool
    {
        // Admins can view any student
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can only view their own students
        if ($user->role === 'parent') {
            return $student->parent_id === $user->id;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins and parents can create students
        return in_array($user->role, ['super_admin', 'transport_admin', 'parent']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Student $student): bool
    {
        // Admins can update any student
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can only update their own students
        if ($user->role === 'parent') {
            return $student->parent_id === $user->id;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Student $student): bool
    {
        // Only admins can delete students
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can delete their own students (if no active bookings)
        if ($user->role === 'parent' && $student->parent_id === $user->id) {
            // Check if student has active bookings
            return !$student->bookings()->whereIn('status', ['active', 'pending'])->exists();
        }
        
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Student $student): bool
    {
        // Only admins can restore students
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Student $student): bool
    {
        // Only super admins can permanently delete students
        return $user->role === 'super_admin';
    }
}
