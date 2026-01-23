<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\TokenMismatchException;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'driver' => \App\Http\Middleware\EnsureUserIsDriver::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        // Update booking statuses (activate pending, expire ended) - runs every hour
        $schedule->command('bookings:update-statuses')->hourly();
        
        // Send booking expiring notifications daily at 9 AM
        $schedule->command('bookings:notify-expiring --days=3')->dailyAt('09:00');
        
        // Send daily activity summary to admins at 6 PM
        $schedule->command('admin:daily-summary')->dailyAt('18:00');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (TokenMismatchException $e, $request) {
            if ($request->header('X-Inertia')) {
                return Inertia::location(route('login'));
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your session has expired. Please log in again.',
                ], 419);
            }

            return redirect()->route('login');
        });
    })->create();
