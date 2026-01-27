<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MessageThread extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'booking_id',
        'route_id',
        'participant_1_id',
        'participant_2_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    /**
     * Get the messages for the thread.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'thread_id')->orderBy('created_at');
    }

    /**
     * Get the first participant.
     */
    public function participant1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_1_id');
    }

    /**
     * Get the second participant.
     */
    public function participant2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_2_id');
    }

    /**
     * Get the booking for this thread.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the route for this thread.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the other participant in the thread.
     */
    public function getOtherParticipant(User $user): ?User
    {
        if ($this->participant_1_id === $user->id) {
            return $this->participant2;
        }
        return $this->participant1;
    }

    /**
     * Get unread message count for a user.
     */
    public function getUnreadCount(User $user): int
    {
        return $this->messages()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }
}
