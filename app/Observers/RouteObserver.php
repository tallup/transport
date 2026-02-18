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
                
                if ($driver && filter_var($driver->email, FILTER_VALIDATE_EMAIL)) {
                    // Notify the driver
                    $driver->notify(new DriverAssigned(null, $driver, $route));
                    
                    // Send push notification to driver
                    $pushHelper = app(\App\Services\PushNotificationHelper::class);
                    $pushHelper->sendIfSubscribed(
                        $driver,
                        'Route Assigned',
                        'You have been assigned to route: ' . $route->name,
                        ['type' => 'driver_assigned', 'route_id' => $route->id, 'url' => route('driver.dashboard')]
                    );
                    
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
                            $parent = $booking->student->parent;
                            $parent->notify(new DriverAssigned(
                                $booking,
                                $driver,
                                $route
                            ));
                            
                            // Send push notification to parent
                            $pushHelper->sendIfSubscribed(
                                $parent,
                                'Driver Assigned',
                                'A driver has been assigned to your child\'s route: ' . $route->name,
                                ['type' => 'driver_assigned', 'booking_id' => $booking->id, 'route_id' => $route->id, 'url' => route('parent.bookings.show', $booking)]
                            );
                        }
                    }
                }
            }
        }
    }
}
