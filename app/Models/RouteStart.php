<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteStart extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'driver_id',
        'period',
        'start_date',
        'started_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'started_at' => 'datetime',
    ];

    /**
     * Get the route that was started.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the driver who started the route.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
