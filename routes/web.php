<?php

use App\Http\Controllers\Parent\BookingController;
use App\Http\Controllers\Parent\DashboardController;
use App\Http\Controllers\Parent\StudentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PolicyController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $user = $request->user();
    if ($user) {
        $role = $user->attributes['role'] ?? $user->role ?? null;
        if (in_array($role, ['super_admin', 'transport_admin'])) {
            return redirect()->route('admin.dashboard');
        }
        if ($role === 'driver') {
            return redirect()->route('driver.dashboard');
        }
        return redirect()->route('parent.dashboard');
    }
    return Inertia::render('Home');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Parent Portal Routes
Route::middleware(['auth', 'verified'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Students
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::get('/students/enroll', [StudentController::class, 'enroll'])->name('students.enroll');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('/bookings/{booking}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::get('/bookings/{booking}/checkout', [BookingController::class, 'showCheckout'])->name('bookings.checkout');
    Route::get('/pickup-history', [BookingController::class, 'allPickupHistory'])->name('pickup-history');
    Route::get('/bookings/{booking}/rebook', [BookingController::class, 'rebook'])->name('bookings.rebook');
    Route::get('/bookings/{booking}/pickup-history', [BookingController::class, 'pickupHistory'])->name('bookings.pickup-history');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/create-payment-intent', [BookingController::class, 'createPaymentIntent'])->name('bookings.create-payment-intent');
    Route::post('/bookings/payment-success', [BookingController::class, 'paymentSuccess'])->name('bookings.payment-success');
    Route::post('/bookings/skip-payment', [BookingController::class, 'skipPayment'])->name('bookings.skip-payment');
    Route::post('/bookings/create-paypal-order', [BookingController::class, 'createPayPalOrder'])->name('bookings.create-paypal-order');
    Route::get('/bookings/paypal/success', [BookingController::class, 'paypalSuccess'])->name('bookings.paypal.success');
    Route::get('/bookings/paypal/cancel', [BookingController::class, 'paypalCancel'])->name('bookings.paypal.cancel');
    Route::get('/schools/{school}/routes', [BookingController::class, 'getRoutesBySchool'])->name('schools.routes');
    Route::get('/routes/{route}/pickup-points', [BookingController::class, 'getPickupPoints'])->name('routes.pickup-points');
    Route::get('/routes/{route}/capacity', [BookingController::class, 'checkCapacity'])->name('routes.capacity');
    Route::post('/calculate-price', [BookingController::class, 'calculatePrice'])->name('calculate-price');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Redirect /admin to /admin/dashboard
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });
    
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('students', \App\Http\Controllers\Admin\StudentController::class);
    Route::resource('vehicles', \App\Http\Controllers\Admin\VehicleController::class);
    Route::resource('routes', \App\Http\Controllers\Admin\RouteController::class);
    Route::resource('pickup-points', \App\Http\Controllers\Admin\PickupPointController::class);
    Route::resource('bookings', \App\Http\Controllers\Admin\BookingController::class);
    Route::resource('pricing-rules', \App\Http\Controllers\Admin\PricingRuleController::class);
    Route::get('/pricing/manage', [\App\Http\Controllers\Admin\PricingController::class, 'manage'])->name('pricing.manage');
    Route::post('/pricing-rules/{pricingRule}/toggle-active', [\App\Http\Controllers\Admin\PricingController::class, 'toggleActive'])->name('pricing-rules.toggle-active');
    Route::get('/finance', [\App\Http\Controllers\Admin\FinanceController::class, 'dashboard'])->name('finance.dashboard');
    Route::resource('calendar-events', \App\Http\Controllers\Admin\CalendarEventController::class);
    Route::post('/bookings/{booking}/approve', [\App\Http\Controllers\Admin\BookingController::class, 'approve'])->name('bookings.approve');
    Route::post('/bookings/{booking}/cancel', [\App\Http\Controllers\Admin\BookingController::class, 'cancel'])->name('bookings.cancel');
});

// Driver Routes
Route::middleware(['auth', 'driver'])->prefix('driver')->name('driver.')->group(function () {
    // Redirect /driver to /driver/dashboard
    Route::get('/', function () {
        return redirect()->route('driver.dashboard');
    });
    
    Route::get('/dashboard', [\App\Http\Controllers\Driver\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/roster', [\App\Http\Controllers\Driver\RosterController::class, 'index'])->name('roster');
    Route::get('/students-schedule', [\App\Http\Controllers\Driver\DashboardController::class, 'studentsSchedule'])->name('students-schedule');
    Route::get('/route-performance', [\App\Http\Controllers\Driver\DashboardController::class, 'routePerformance'])->name('route-performance');
    Route::get('/route-information', [\App\Http\Controllers\Driver\DashboardController::class, 'routeInformation'])->name('route-information');
    Route::get('/completed-routes', [\App\Http\Controllers\Driver\DashboardController::class, 'completedRoutes'])->name('completed-routes');
    Route::post('/bookings/{booking}/mark-complete', [\App\Http\Controllers\Driver\RosterController::class, 'markComplete'])->name('bookings.mark-complete');
    Route::post('/pickup-points/mark-complete', [\App\Http\Controllers\Driver\RosterController::class, 'markPickupPointComplete'])->name('pickup-points.mark-complete');
    Route::post('/routes/{route}/mark-complete', [\App\Http\Controllers\Driver\DashboardController::class, 'markRouteComplete'])->name('routes.mark-complete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Public static pages
Route::get('/privacy-policy', function (Request $request) {
    return Inertia::render('PrivacyPolicy', ['auth' => ['user' => $request->user()]]);
})->name('privacy-policy');

Route::get('/terms-and-conditions', function (Request $request) {
    return Inertia::render('TermsAndConditions', ['auth' => ['user' => $request->user()]]);
})->name('terms-and-conditions');

Route::get('/faq', function (Request $request) {
    return Inertia::render('FAQ', ['auth' => ['user' => $request->user()]]);
})->name('faq');

// Keep-alive endpoint to prevent session expiration during active use
Route::middleware(['auth'])->get('/api/keep-alive', function (Request $request) {
    // This endpoint simply touches the session to keep it alive
    // Return minimal response
    return response()->json(['status' => 'ok'], 200);
})->name('api.keep-alive');

// Public API routes for policies (with rate limiting)
Route::middleware(['throttle:api'])->group(function () {
    Route::get('/api/policies', [PolicyController::class, 'index'])->name('api.policies');
    Route::get('/api/policies/{policy}', [PolicyController::class, 'show'])->name('api.policies.show');
});

// Webhook routes (exclude CSRF, but with rate limiting)
Route::post('/webhooks/stripe', [\App\Http\Controllers\Webhook\StripeWebhookController::class, 'handleWebhook'])
    ->middleware(['web', 'throttle:60,1'])
    ->name('webhooks.stripe');

require __DIR__.'/auth.php';
