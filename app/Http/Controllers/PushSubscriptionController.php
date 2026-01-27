<?php

namespace App\Http\Controllers;

use App\Services\PushNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PushSubscriptionController extends Controller
{
    protected $pushService;

    public function __construct(PushNotificationService $pushService)
    {
        $this->pushService = $pushService;
    }

    /**
     * Store a push subscription.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
            'keys' => 'required|array',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
            'contentEncoding' => 'nullable|string',
        ]);

        try {
            $this->pushService->subscribe($request->user(), $validated);

            return response()->json([
                'success' => true,
                'message' => 'Subscription saved successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save push subscription', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save subscription',
            ], 500);
        }
    }

    /**
     * Remove a push subscription.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => 'required|string',
        ]);

        try {
            $this->pushService->unsubscribe($request->user(), $validated['endpoint']);

            return response()->json([
                'success' => true,
                'message' => 'Subscription removed successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to remove push subscription', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove subscription',
            ], 500);
        }
    }
}
