<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PushController extends Controller
{
    /**
     * Get VAPID public key for push notifications.
     */
    public function getVapidPublicKey(Request $request)
    {
        $publicKey = config('services.webpush.public_key');

        if (!$publicKey) {
            return response()->json([
                'error' => 'VAPID public key not configured',
            ], 500);
        }

        return response()->json([
            'publicKey' => $publicKey,
        ]);
    }
}

