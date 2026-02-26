<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast to one or more users for real-time portal updates (bookings, pickups, etc.).
 */
class PortalUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param array<int> $userIds User IDs to notify (parent, admin, driver)
     * @param string $type e.g. 'booking_approved', 'payment_received', 'pickup_completed', 'booking_created'
     * @param string $message Short human-readable message
     * @param array<string, mixed> $data Optional payload (e.g. booking_id, url)
     */
    public function __construct(
        public array $userIds,
        public string $type,
        public string $message,
        public array $data = []
    ) {}

    public function broadcastOn(): array
    {
        $channels = [];
        foreach ($this->userIds as $id) {
            $channels[] = new PrivateChannel('App.Models.User.' . $id);
        }
        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'portal.update';
    }

    public function broadcastWith(): array
    {
        return [
            'type' => $this->type,
            'message' => $this->message,
            'data' => $this->data,
        ];
    }
}
