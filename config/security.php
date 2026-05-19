<?php

return [
    'virus_scan' => [
        'driver' => env('VIRUS_SCAN_DRIVER', 'null'), // 'null' | 'clamav'
        'clamav' => [
            'host' => env('CLAMAV_HOST', '127.0.0.1'),
            'port' => env('CLAMAV_PORT', 3310),
        ],
    ],
];
