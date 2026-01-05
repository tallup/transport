<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get the routes that serve this school.
     */
    public function routes(): BelongsToMany
    {
        return $this->belongsToMany(Route::class, 'route_school');
    }

    /**
     * Get the students at this school.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}



