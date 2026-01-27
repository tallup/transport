<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class PushNotificationHelper
{
    protected $pushService;

    public function __construct(PushNotificationService $pushService)
    {
        $this->pushService = $pushService;
    }

    /**
     * Send push notification to a user if they have subscriptions.
     *
     * @param User $user
     * @param string $title
     * @param string $body
     * @param array $data
     * @return void
     */
    public function sendIfSubscribed(User $user, string $title, string $body, array $data = []): void
    {
        try {
            // Check if user has push subscriptions
            $hasSubscriptions = \App\Models\PushSubscription::where('user_id', $user->id)->exists();
            
            if ($hasSubscriptions) {
                $this->pushService->sendPushNotification($user, $title, $body, $data);
            }
        } catch (\Exception $e) {
            // Log error but don't fail the main notification flow
            Log::warning('Failed to send push notification', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

