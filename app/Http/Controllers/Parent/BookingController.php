<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\PickupPoint;
use App\Models\Route;
use App\Models\School;
use App\Notifications\BookingConfirmed;
use App\Services\BookingService;
use App\Services\CalendarService;
use App\Services\CapacityGuard;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class BookingController extends Controller
{
    protected $capacityGuard;
    protected $pricingService;
    protected $bookingService;
    protected $calendarService;

    public function __construct(CapacityGuard $capacityGuard, PricingService $pricingService, BookingService $bookingService, CalendarService $calendarService)
    {
        $this->capacityGuard = $capacityGuard;
        $this->pricingService = $pricingService;
        $this->bookingService = $bookingService;
        $this->calendarService = $calendarService;
        
        Stripe::setApiKey(config('cashier.secret'));
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $students = $user->students()->with('school')->get();
        $schools = School::where('active', true)->orderBy('name')->get();
        
        // Filter routes by school if provided
        $schoolId = $request->query('school_id');
        $routesQuery = Route::where('active', true)
            ->with(['vehicle', 'pickupPoints', 'schools']);
        
        if ($schoolId) {
            $routesQuery->whereHas('schools', function ($query) use ($schoolId) {
                $query->where('schools.id', $schoolId);
            });
        }
        
        $routes = $routesQuery->get()
            ->map(function ($route) {
                $route->available_seats = $this->capacityGuard->getAvailableSeats($route);
                // Ensure pickup_points is accessible in frontend
                $route->pickup_points = $route->pickupPoints;
                return $route;
            });

        return Inertia::render('Parent/Bookings/Create', [
            'students' => $students,
            'schools' => $schools,
            'routes' => $routes,
        ]);
    }
    
    public function getRoutesBySchool(Request $request, School $school)
    {
        $routes = Route::where('active', true)
            ->whereHas('schools', function ($query) use ($school) {
                $query->where('schools.id', $school->id);
            })
            ->with(['vehicle', 'pickupPoints', 'schools'])
            ->get()
            ->map(function ($route) {
                $route->available_seats = $this->capacityGuard->getAvailableSeats($route);
                $route->pickup_points = $route->pickupPoints;
                return $route;
            });
        
        return response()->json($routes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'route_id' => 'required|exists:routes,id',
            'pickup_point_id' => 'nullable|exists:pickup_points,id',
            'pickup_address' => 'nullable|string|max:500',
            'pickup_latitude' => 'nullable|numeric|between:-90,90',
            'pickup_longitude' => 'nullable|numeric|between:-180,180',
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,semester,annual',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        // Ensure either pickup_point_id OR pickup_address is provided
        if (empty($validated['pickup_point_id']) && empty($validated['pickup_address'])) {
            return back()->withErrors(['pickup_address' => 'Please either select a pickup point or enter a pickup address.']);
        }

        // Verify student belongs to parent
        $user = $request->user();
        $student = $user->students()->findOrFail($validated['student_id']);

        // Validate booking date against calendar
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $dateValidation = $this->calendarService->validateBookingDate($startDate);
        if (!$dateValidation['valid']) {
            return back()->withErrors(['start_date' => $dateValidation['message']]);
        }

        // Check capacity
        $route = Route::findOrFail($validated['route_id']);
        try {
            $this->capacityGuard->validateBookingCapacity($route);
        } catch (\Exception $e) {
            return back()->withErrors(['route_id' => $e->getMessage()]);
        }

        // Calculate price
        try {
            $price = $this->pricingService->calculatePrice($validated['plan_type'], $route);
        } catch (\Exception $e) {
            return back()->withErrors(['plan_type' => 'Pricing not configured for this plan type']);
        }

        // Calculate end date based on plan type
        $bookingService = app(BookingService::class);
        $endDate = $bookingService->calculateEndDate(
            $validated['plan_type'],
            \Carbon\Carbon::parse($validated['start_date'])
        );

        // Create booking (pending until payment)
        $booking = Booking::create([
            'student_id' => $validated['student_id'],
            'route_id' => $validated['route_id'],
            'pickup_point_id' => $validated['pickup_point_id'] ?? null,
            'pickup_address' => $validated['pickup_address'] ?? null,
            'pickup_latitude' => $validated['pickup_latitude'] ?? null,
            'pickup_longitude' => $validated['pickup_longitude'] ?? null,
            'plan_type' => $validated['plan_type'],
            'status' => 'pending',
            'start_date' => $validated['start_date'],
            'end_date' => $endDate?->format('Y-m-d'),
        ]);

        return Inertia::render('Parent/Bookings/Checkout', [
            'booking' => $booking->load(['student', 'route', 'pickupPoint']),
            'price' => ['price' => $price, 'formatted' => $this->pricingService->formatPrice($price)],
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $students = $user->students;
        $bookings = Booking::whereIn('student_id', $students->pluck('id'))
            ->with(['student', 'route', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Parent/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function getPickupPoints(Request $request, Route $route)
    {
        $pickupPoints = $route->pickupPoints()->orderBy('sequence_order')->get();
        return response()->json($pickupPoints);
    }

    public function checkCapacity(Request $request, Route $route)
    {
        $availableSeats = $this->capacityGuard->getAvailableSeats($route);
        return response()->json([
            'available' => $availableSeats,
            'capacity' => $route->capacity,
        ]);
    }

    public function calculatePrice(Request $request)
    {
        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'plan_type' => 'required|in:weekly,bi_weekly,monthly,semester,annual',
        ]);

        try {
            $route = Route::findOrFail($validated['route_id']);
            $price = $this->pricingService->calculatePrice($validated['plan_type'], $route);
            return response()->json(['price' => $price, 'formatted' => $this->pricingService->formatPrice($price)]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function createPaymentIntent(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:50', // Minimum $0.50
        ]);

        $user = $request->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $validated['amount'],
                'currency' => 'usd',
                'metadata' => [
                    'booking_id' => $booking->id,
                    'user_id' => $user->id,
                ],
            ]);

            return response()->json(['clientSecret' => $paymentIntent->client_secret]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function paymentSuccess(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_intent_id' => 'required|string',
        ]);

        $user = $request->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Verify payment intent
        try {
            $paymentIntent = PaymentIntent::retrieve($validated['payment_intent_id']);

            if ($paymentIntent->status === 'succeeded') {
                // Update booking status
                $booking->update([
                    'status' => 'active',
                    'stripe_customer_id' => $user->stripe_id,
                ]);

                // Send confirmation notification
                $user->notify(new BookingConfirmed($booking));

                return redirect()->route('parent.bookings.index')
                    ->with('success', 'Booking confirmed! Check your email for details.');
            }
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Payment verification failed']);
        }

        return back()->withErrors(['error' => 'Payment was not successful']);
    }

    public function rebook(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Load previous booking data
        $booking->load(['student', 'route', 'pickupPoint', 'student.school']);
        $students = $user->students()->with('school')->get();
        $schools = \App\Models\School::where('active', true)->orderBy('name')->get();
        
        // Get routes for the student's school
        $schoolId = $booking->student->school_id;
        $routes = Route::where('active', true)
            ->whereHas('schools', function ($query) use ($schoolId) {
                $query->where('schools.id', $schoolId);
            })
            ->with(['vehicle', 'pickupPoints', 'schools'])
            ->get()
            ->map(function ($route) {
                $route->available_seats = $this->capacityGuard->getAvailableSeats($route);
                $route->pickup_points = $route->pickupPoints;
                return $route;
            });

        return Inertia::render('Parent/Bookings/Rebook', [
            'previousBooking' => $booking,
            'students' => $students,
            'schools' => $schools,
            'routes' => $routes,
        ]);
    }
}
