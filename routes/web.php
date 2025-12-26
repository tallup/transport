<?php

use App\Http\Controllers\Parent\BookingController;
use App\Http\Controllers\Parent\DashboardController;
use App\Http\Controllers\Parent\StudentController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::get('/bookings/{booking}/rebook', [BookingController::class, 'rebook'])->name('bookings.rebook');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/create-payment-intent', [BookingController::class, 'createPaymentIntent'])->name('bookings.create-payment-intent');
    Route::post('/bookings/payment-success', [BookingController::class, 'paymentSuccess'])->name('bookings.payment-success');
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
    Route::resource('calendar-events', \App\Http\Controllers\Admin\CalendarEventController::class);
});

// Driver Routes
Route::middleware(['auth', 'driver'])->prefix('driver')->name('driver.')->group(function () {
    // Redirect /driver to /driver/dashboard
    Route::get('/', function () {
        return redirect()->route('driver.dashboard');
    });
    
    Route::get('/dashboard', [\App\Http\Controllers\Driver\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/roster', [\App\Http\Controllers\Driver\RosterController::class, 'index'])->name('roster');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Webhook routes (exclude CSRF)
Route::post('/webhooks/stripe', [\App\Http\Controllers\Webhook\StripeWebhookController::class, 'handleWebhook'])
    ->middleware('web')
    ->name('webhooks.stripe');

require __DIR__.'/auth.php';
