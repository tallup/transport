<?php

namespace App\Providers;

use App\Models\Booking;
use App\Models\Student;
use App\Policies\BookingPolicy;
use App\Policies\StudentPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Booking::class => BookingPolicy::class,
        Student::class => StudentPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        Vite::prefetch(concurrency: 3);

        // Register model observers
        \App\Models\Route::observe(\App\Observers\RouteObserver::class);

        $this->configureRateLimiting();
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('forms', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('messaging', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        // Booking mutations (store/update/cancel/destroy handled per-user; payment routes use inline throttle:10,1)
        RateLimiter::for('bookings', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        // Student create/update mutations
        RateLimiter::for('students', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        // Absence create/delete mutations
        RateLimiter::for('absences', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        // Profile update/delete and push subscription mutations
        RateLimiter::for('profile', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        // Admin-only mutation routes (resource writes, approvals, refunds, toggles, exports)
        RateLimiter::for('admin-mutations', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Driver action mutations (mark-complete, start-trip handled inline; acknowledge here)
        RateLimiter::for('driver-actions', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Public contact form submissions
        RateLimiter::for('contact', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
