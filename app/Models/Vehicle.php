<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'license_plate',
        'registration_number',
        'make',
        'model',
        'year',
        'capacity',
        'last_maintenance_date',
        'next_maintenance_date',
        'status',
    ];

    protected $casts = [
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
    ];

    /**
     * Get the routes for the vehicle.
     */
    public function routes(): HasMany
    {
        return $this->hasMany(Route::class);
    }
}
