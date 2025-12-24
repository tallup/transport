<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'driver_id',
        'vehicle_id',
        'capacity',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get the driver that owns the route.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the vehicle that owns the route.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the pickup points for the route.
     */
    public function pickupPoints(): HasMany
    {
        return $this->hasMany(PickupPoint::class)->orderBy('sequence_order');
    }

    /**
     * Get the bookings for the route.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
