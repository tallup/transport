<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushNotificationService
{
    protected $webPush;

    public function __construct()
    {
        $auth = [
            'VAPID' => [
                'subject' => config('app.url'),
                'publicKey' => config('services.webpush.public_key'),
                'privateKey' => config('services.webpush.private_key'),
            ],
        ];

        $this->webPush = new WebPush($auth);
    }

    /**
     * Send push notification to a user.
     *
     * @param User $user
     * @param string $title
     * @param string $body
     * @param array $data
     * @return void
     */
    public function sendPushNotification(User $user, string $title, string $body, array $data = []): void
    {
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        foreach ($subscriptions as $subscription) {
            try {
                $pushSubscription = Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'keys' => [
                        'p256dh' => $subscription->public_key,
                        'auth' => $subscription->auth_token,
                    ],
                    'contentEncoding' => $subscription->content_encoding ?? 'aesgcm',
                ]);

                $payload = json_encode([
                    'title' => $title,
                    'body' => $body,
                    'data' => $data,
                ]);

                $this->webPush->queueNotification($pushSubscription, $payload);
            } catch (\Exception $e) {
                Log::error('Failed to queue push notification', [
                    'user_id' => $user->id,
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Send all queued notifications
        foreach ($this->webPush->flush() as $report) {
            if (!$report->isSuccess()) {
                Log::error('Push notification failed', [
                    'endpoint' => $report->getEndpoint(),
                    'reason' => $report->getReason(),
                ]);

                // Remove invalid subscriptions
                if ($report->isSubscriptionExpired()) {
                    PushSubscription::where('endpoint', $report->getEndpoint())->delete();
                }
            }
        }
    }

    /**
     * Subscribe a user to push notifications.
     *
     * @param User $user
     * @param array $subscriptionData
     * @return PushSubscription
     */
    public function subscribe(User $user, array $subscriptionData): PushSubscription
    {
        return PushSubscription::updateOrCreate(
            [
                'user_id' => $user->id,
                'endpoint' => $subscriptionData['endpoint'],
            ],
            [
                'public_key' => $subscriptionData['keys']['p256dh'] ?? null,
                'auth_token' => $subscriptionData['keys']['auth'] ?? null,
                'content_encoding' => $subscriptionData['contentEncoding'] ?? 'aesgcm',
            ]
        );
    }

    /**
     * Unsubscribe a user from push notifications.
     *
     * @param User $user
     * @param string $endpoint
     * @return bool
     */
    public function unsubscribe(User $user, string $endpoint): bool
    {
        return PushSubscription::where('user_id', $user->id)
            ->where('endpoint', $endpoint)
            ->delete() > 0;
    }
}



