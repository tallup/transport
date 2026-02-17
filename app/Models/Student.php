<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Models\Route;
use App\Models\PickupPoint;

class Student extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'parent_id',
        'name',
        'profile_picture',
        'school_id',
        'route_id',
        'pickup_point_id',
        'emergency_phone',
        'emergency_contact_name',
        'date_of_birth',
        'home_address',
        'grade',
        'authorized_pickup_persons',
        'special_instructions',
        'medical_notes',
        'emergency_contact_2_name',
        'emergency_contact_2_phone',
        'emergency_contact_2_relationship',
        'doctor_name',
        'doctor_phone',
        'authorization_to_transport_signed_at',
        'authorization_to_transport_signature',
        'payment_agreement_signed_at',
        'payment_agreement_signature',
        'liability_waiver_signed_at',
        'liability_waiver_signature',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'authorized_pickup_persons' => 'array',
        'authorization_to_transport_signed_at' => 'datetime',
        'payment_agreement_signed_at' => 'datetime',
        'liability_waiver_signed_at' => 'datetime',
    ];

    protected $appends = ['profile_picture_url'];

    /**
     * Get the parent user that owns the student.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Get the route assigned to the student.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the pickup point assigned to the student.
     */
    public function pickupPoint(): BelongsTo
    {
        return $this->belongsTo(\App\Models\PickupPoint::class, 'pickup_point_id');
    }

    /**
     * Get the bookings for the student.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the school that the student attends.
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
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
     * Check if authorization to transport is signed.
     */
    public function hasAuthorizationToTransport(): bool
    {
        return !is_null($this->authorization_to_transport_signed_at) && !is_null($this->authorization_to_transport_signature);
    }

    /**
     * Check if payment agreement is signed.
     */
    public function hasPaymentAgreement(): bool
    {
        return !is_null($this->payment_agreement_signed_at) && !is_null($this->payment_agreement_signature);
    }

    /**
     * Check if liability waiver is signed.
     */
    public function hasLiabilityWaiver(): bool
    {
        return !is_null($this->liability_waiver_signed_at) && !is_null($this->liability_waiver_signature);
    }

    /**
     * Check if all required documents are signed.
     */
    public function hasAllSignatures(): bool
    {
        return $this->hasAuthorizationToTransport() 
            && $this->hasPaymentAgreement() 
            && $this->hasLiabilityWaiver();
    }

    /**
     * Configure activity logging for Student model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'school_id', 'route_id', 'grade', 'medical_notes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
