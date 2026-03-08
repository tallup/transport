<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',       // 'percentage' or 'fixed'
        'value',
        'start_date',
        'end_date',
        'scope',      // 'all', 'route', 'plan_type'
        'route_id',
        'plan_type',
        'active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    /**
     * Get the route (when scope is 'route').
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Scope: only active discounts valid for the given date.
     */
    public function scopeActiveForDate(Builder $query, ?Carbon $date = null): Builder
    {
        $date = $date ?? Carbon::today();

        return $query->where('active', true)
            ->where(function (Builder $q) use ($date) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $date);
            })
            ->where(function (Builder $q) use ($date) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $date);
            });
    }

    /**
     * Scope: matching route (when scope is 'route' or 'all').
     */
    public function scopeForRoute(Builder $query, ?int $routeId): Builder
    {
        return $query->where(function (Builder $q) use ($routeId) {
            $q->where('scope', 'all')
                ->orWhere(function (Builder $q2) use ($routeId) {
                    $q2->where('scope', 'route')->where('route_id', $routeId);
                });
        });
    }

    /**
     * Scope: matching plan type (when scope is 'plan_type' or 'all').
     */
    public function scopeForPlanType(Builder $query, ?string $planType): Builder
    {
        return $query->where(function (Builder $q) use ($planType) {
            $q->where('scope', 'all')
                ->orWhere(function (Builder $q2) use ($planType) {
                    $q2->where('scope', 'plan_type')->where('plan_type', $planType);
                });
        });
    }
}
