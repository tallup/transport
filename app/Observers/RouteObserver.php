<?php

namespace App\Observers;

use App\Models\Route;
use App\Models\User;
use App\Models\Booking;
use App\Notifications\DriverAssigned;

class RouteObserver
{
    /**
     * Handle the Route "updated" event.
     */
    public function updated(Route $route): void
    {
        // Check if driver was assigned or changed
        if ($route->isDirty('driver_id')) {
            $oldDriverId = $route->getOriginal('driver_id');
            $newDriverId = $route->driver_id;
            
            // Only send notification if a driver was assigned (not removed)
            if ($newDriverId && $oldDriverId != $newDriverId) {
                $driver = User::find($newDriverId);
                
                if ($driver) {
                    // Notify the driver
                    $driver->notify(new DriverAssigned(null, $driver, $route));
                    
                    // Notify all parents with active bookings on this route
                    $activeBookings = Booking::where('route_id', $route->id)
                        ->where('status', 'active')
                        ->whereDate('start_date', '<=', now())
                        ->where(function ($query) {
                            $query->whereNull('end_date')
                                ->orWhereDate('end_date', '>=', now());
                        })
                        ->with(['student.parent'])
                        ->get();

                    foreach ($activeBookings as $booking) {
                        if ($booking->student && $booking->student->parent) {
                            $booking->student->parent->notify(new DriverAssigned(
                                $booking,
                                $driver,
                                $route
                            ));
                        }
                    }
                }
            }
        }
    }
}
