<?php

use App\Models\MessageThread;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Per-user private channel used for direct portal/message notifications.
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Message thread channel: only the two participants may subscribe.
Broadcast::channel('thread.{threadId}', function ($user, $threadId) {
    $thread = MessageThread::find($threadId);

    if (! $thread) {
        return false;
    }

    return (int) $thread->participant_1_id === (int) $user->id
        || (int) $thread->participant_2_id === (int) $user->id;
});
