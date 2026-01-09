<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Carbon\Carbon;

class Route extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'driver_id',
        'vehicle_id',
        'capacity',
        'active',
        'service_type',
        'pickup_time',
        'dropoff_time',
    ];

    protected $casts = [
        'active' => 'boolean',
        'pickup_time' => 'datetime',
        'dropoff_time' => 'datetime',
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

    /**
     * Get the schools served by this route.
     */
    public function schools(): BelongsToMany
    {
        return $this->belongsToMany(School::class, 'route_school');
    }

    /**
     * Get the route completions.
     */
    public function completions(): HasMany
    {
        return $this->hasMany(RouteCompletion::class);
    }

    /**
     * Determine the service period (AM or PM) based on service_type or pickup_time.
     * service_type takes precedence if explicitly set to 'am' or 'pm'.
     * 
     * @return string 'am', 'pm', or 'both'
     */
    public function servicePeriod(): string
    {
        // If service_type is explicitly set to 'am' or 'pm', use it (takes precedence)
        if ($this->service_type && in_array($this->service_type, ['am', 'pm'])) {
            return $this->service_type;
        }

        // If pickup_time is set, use it to determine period
        if ($this->pickup_time) {
            // Handle TIME type - extract just the time portion
            $timeString = null;
            
            if ($this->pickup_time instanceof Carbon) {
                $timeString = $this->pickup_time->format('H:i:s');
            } elseif (is_string($this->pickup_time)) {
                // If it's already a time string like '07:30:00' or datetime string
                if (strpos($this->pickup_time, ' ') !== false) {
                    // It's a datetime string, extract time part
                    $parts = explode(' ', $this->pickup_time);
                    $timeString = $parts[1] ?? $parts[0];
                } else {
                    $timeString = $this->pickup_time;
                }
            } else {
                $timeString = (string) $this->pickup_time;
            }

            // Extract hour from time string (HH:mm:ss format)
            $parts = explode(':', $timeString);
            $hour = (int) ($parts[0] ?? 0);
            
            // If pickup_time is before 12:00 (noon), it's AM route
            return $hour < 12 ? 'am' : 'pm';
        }

        // If service_type is 'both' or not set, and no pickup_time, return 'both'
        return $this->service_type ?: 'both';
    }

    /**
     * Check if this is a morning (AM) route.
     * 
     * @return bool
     */
    public function isMorningRoute(): bool
    {
        $period = $this->servicePeriod();
        return $period === 'am' || $period === 'both';
    }

    /**
     * Check if this is an afternoon (PM) route.
     * 
     * @return bool
     */
    public function isAfternoonRoute(): bool
    {
        $period = $this->servicePeriod();
        return $period === 'pm' || $period === 'both';
    }

    /**
     * Scope to filter routes by period (AM/PM).
     * 
     * @param Builder $query
     * @param string $period 'am' or 'pm'
     * @return Builder
     */
    public function scopeForPeriod(Builder $query, string $period): Builder
    {
        if ($period === 'am') {
            // AM routes have pickup_time before 12:00
            return $query->whereRaw('TIME(pickup_time) < ?', ['12:00:00']);
        } elseif ($period === 'pm') {
            // PM routes have pickup_time at or after 12:00
            return $query->whereRaw('TIME(pickup_time) >= ?', ['12:00:00']);
        }
        
        return $query;
    }

    /**
     * Configure activity logging for Route model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'driver_id', 'vehicle_id', 'capacity', 'active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
