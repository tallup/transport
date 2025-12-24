<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PickupPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'name',
        'address',
        'latitude',
        'longitude',
        'sequence_order',
        'pickup_time',
        'dropoff_time',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the route that owns the pickup point.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the bookings for the pickup point.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
