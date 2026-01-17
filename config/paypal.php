<?php

return [
    'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
    'sandbox' => [
        'client_id' => env('PAYPAL_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
        'app_id' => env('PAYPAL_APP_ID', ''),
    ],
    'live' => [
        'client_id' => env('PAYPAL_LIVE_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_LIVE_CLIENT_SECRET', ''),
        'app_id' => env('PAYPAL_LIVE_APP_ID', ''),
    ],
    'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'),
    'currency' => env('PAYPAL_CURRENCY', 'USD'),
    'notify_url' => env('PAYPAL_NOTIFY_URL', ''),
    'locale' => env('PAYPAL_LOCALE', 'en_US'),
    'validate_ssl' => env('PAYPAL_VALIDATE_SSL', true),
];

