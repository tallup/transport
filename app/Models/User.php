<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
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
        'is_active',
        'profile_picture',
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
     * Route mail notifications only when email is valid.
     */
    public function routeNotificationForMail($notification): ?string
    {
        // First, try to use the user's email if it's valid
        if (filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            return $this->email;
        }

        // Try the configured fallback address
        $fallbackAddress = config('mail.fallback_to.address');
        if ($fallbackAddress && filter_var($fallbackAddress, FILTER_VALIDATE_EMAIL)) {
            \Log::warning('Using fallback email address for notification', [
                'user_id' => $this->id,
                'user_email' => $this->email,
                'fallback_email' => $fallbackAddress,
                'notification' => get_class($notification)
            ]);
            return $fallbackAddress;
        }

        // Last resort: use the MAIL_FROM_ADDRESS
        $fromAddress = config('mail.from.address');
        if ($fromAddress && filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
            \Log::warning('Using from address as fallback for notification', [
                'user_id' => $this->id,
                'user_email' => $this->email,
                'from_email' => $fromAddress,
                'notification' => get_class($notification)
            ]);
            return $fromAddress;
        }

        // If all else fails, log error and return null (notification will be skipped)
        \Log::error('No valid email address found for notification', [
            'user_id' => $this->id,
            'user_email' => $this->email,
            'notification' => get_class($notification)
        ]);
        
        return null;
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
     * Get the profile picture URL.
     */
    public function getProfilePictureUrlAttribute(): ?string
    {
        if (!$this->profile_picture) {
            return null;
        }

        return Storage::url($this->profile_picture);
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
            // Allow all admin roles to access admin panel
            return in_array($role, ['super_admin', 'transport_admin', 'admin']);
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
