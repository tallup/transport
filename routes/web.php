<?php

use App\Http\Controllers\Parent\BookingController;
use App\Http\Controllers\Parent\DashboardController;
use App\Http\Controllers\Parent\StudentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('parent.dashboard');
});

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
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/create-payment-intent', [BookingController::class, 'createPaymentIntent'])->name('bookings.create-payment-intent');
    Route::post('/bookings/payment-success', [BookingController::class, 'paymentSuccess'])->name('bookings.payment-success');
    Route::get('/routes/{route}/pickup-points', [BookingController::class, 'getPickupPoints'])->name('routes.pickup-points');
    Route::get('/routes/{route}/capacity', [BookingController::class, 'checkCapacity'])->name('routes.capacity');
    Route::post('/calculate-price', [BookingController::class, 'calculatePrice'])->name('calculate-price');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
