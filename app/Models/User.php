<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Will be ignored if column doesn't exist
        'phone_numbers',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        $casts = [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'phone_numbers' => 'array',
        ];
        
        // Only cast role if column exists
        try {
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
                // Role will be handled as string, no special casting needed
            }
        } catch (\Exception $e) {
            // If schema check fails, continue without role casting
        }
        
        return $casts;
    }
    
    /**
     * Get the user's role, defaulting to 'parent' if column doesn't exist.
     */
    public function getRoleAttribute($value)
    {
        if ($value !== null) {
            return $value;
        }
        
        // Check if column exists, if not return default
        try {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('users', 'role')) {
                return 'parent';
            }
        } catch (\Exception $e) {
            return 'parent';
        }
        
        return $value ?? 'parent';
    }

    /**
     * Get the students for the user (when role is parent).
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'parent_id');
    }

    /**
     * Get the routes assigned to the user (when role is driver).
     */
    public function routes(): HasMany
    {
        return $this->hasMany(Route::class, 'driver_id');
    }

    /**
     * Determine if the user can access the admin panel.
     */
    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        // Get role directly from database to ensure we have the latest value
        $role = \Illuminate\Support\Facades\DB::table('users')
            ->where('id', $this->id)
            ->value('role');
        
        if ($panel->getId() === 'admin') {
            // Only super_admin and transport_admin can access admin panel
            return in_array($role, ['super_admin', 'transport_admin']);
        }

        if ($panel->getId() === 'driver') {
            // Only drivers can access driver panel
            return $role === 'driver';
        }

        return true;
    }

    /**
     * Get the primary phone number.
     */
    public function getPrimaryPhone(): ?string
    {
        $phones = $this->phone_numbers ?? [];
        return !empty($phones) ? $phones[0] : null;
    }

    /**
     * Get all phone numbers.
     */
    public function getAllPhones(): array
    {
        return $this->phone_numbers ?? [];
    }
}
