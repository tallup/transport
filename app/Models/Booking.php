<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'route_id',
        'pickup_point_id',
        'dropoff_point_id',
        'pickup_address',
        'pickup_latitude',
        'pickup_longitude',
        'plan_type',
        'status',
        'start_date',
        'end_date',
        'stripe_subscription_id',
        'stripe_customer_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'pickup_latitude' => 'decimal:8',
        'pickup_longitude' => 'decimal:8',
    ];

    /**
     * Get the student that owns the booking.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the route that owns the booking.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the pickup point that owns the booking.
     */
    public function pickupPoint(): BelongsTo
    {
        return $this->belongsTo(PickupPoint::class);
    }

    /**
     * Get the dropoff point that owns the booking.
     */
    public function dropoffPoint(): BelongsTo
    {
        return $this->belongsTo(PickupPoint::class, 'dropoff_point_id');
    }
}
