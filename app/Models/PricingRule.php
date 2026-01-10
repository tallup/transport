<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricingRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_type',
        'trip_type',
        'route_id',
        'vehicle_type',
        'amount',
        'currency',
        'active',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'active' => 'boolean',
    ];

    /**
     * Get the route that owns the pricing rule (if route-specific).
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }
}
