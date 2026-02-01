<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Only admins can view users list
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Only admins can view users
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins can create users
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Only admins can update users
        // But prevent editing admin users
        if (in_array($model->role, ['super_admin', 'transport_admin'])) {
            return false;
        }
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Only admins can delete users
        // But prevent deleting admin users
        if (in_array($model->role, ['super_admin', 'transport_admin'])) {
            return false;
        }
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Prevent force deleting admin users
        if (in_array($model->role, ['super_admin', 'transport_admin'])) {
            return false;
        }
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }
}
