<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteCompletion extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'driver_id',
        'completion_date',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the route that was completed.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the driver who completed the route.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
