<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admins can view all bookings
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can view their own bookings
        if ($user->role === 'parent') {
            return true;
        }
        
        // Drivers can view bookings for their routes
        if ($user->role === 'driver') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Admins can view any booking
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can only view bookings for their own students
        if ($user->role === 'parent') {
            return $user->students->contains($booking->student_id);
        }
        
        // Drivers can view bookings for their routes
        if ($user->role === 'driver') {
            $route = $booking->route;
            return $route && $route->driver_id === $user->id;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins and parents can create bookings
        return in_array($user->role, ['super_admin', 'transport_admin', 'parent']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Admins can update any booking
        if (in_array($user->role, ['super_admin', 'transport_admin'])) {
            return true;
        }
        
        // Parents can only update bookings for their own students
        if ($user->role === 'parent') {
            return $user->students->contains($booking->student_id);
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Booking $booking): bool
    {
        // Only admins can delete bookings
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Booking $booking): bool
    {
        // Only admins can restore bookings
        return in_array($user->role, ['super_admin', 'transport_admin']);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Booking $booking): bool
    {
        // Only super admins can permanently delete bookings
        return $user->role === 'super_admin';
    }
}
