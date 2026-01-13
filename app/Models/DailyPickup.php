<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyPickup extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'route_id',
        'driver_id',
        'pickup_date',
        'pickup_point_id',
        'period',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'pickup_date' => 'date',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the booking for this daily pickup.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the route for this daily pickup.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the driver who completed this pickup.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the pickup point for this daily pickup.
     */
    public function pickupPoint(): BelongsTo
    {
        return $this->belongsTo(PickupPoint::class);
    }
}
