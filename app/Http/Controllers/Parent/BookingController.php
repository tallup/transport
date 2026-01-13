<?php

namespace App\Http\Controllers\Parent;

use App\Exceptions\CapacityExceededException;
use App\Exceptions\PricingNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
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

    public function store(StoreBookingRequest $request)
    {
        $validated = $request->validated();
        
        // Sanitize text inputs
        if (isset($validated['pickup_address'])) {
            $validated['pickup_address'] = strip_tags($validated['pickup_address']);
        }

        // Ensure either pickup_point_id OR pickup_address is provided
        if (empty($validated['pickup_point_id']) && empty($validated['pickup_address'])) {
            return back()->withErrors(['pickup_address' => 'Please either select a pickup point or enter a pickup address.']);
        }

        // Verify student belongs to parent (authorization check)
        $user = $request->user();
        $student = $user->students()->findOrFail($validated['student_id']);
        
        // Additional authorization check using policy
        if (!$request->user()->can('create', Booking::class)) {
            abort(403, 'Unauthorized to create bookings.');
        }

        // Validate booking date against calendar
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $dateValidation = $this->calendarService->validateBookingDate($startDate);
        if (!$dateValidation['valid']) {
            return back()->withErrors(['start_date' => $dateValidation['message']]);
        }

        // Check for overlapping bookings
        $bookingService = app(BookingService::class);
        $endDate = $bookingService->calculateEndDate($validated['plan_type'], $startDate);
        
        // Get the overlapping booking for better error message
        $overlappingBooking = Booking::where('student_id', $validated['student_id'])
            ->whereIn('status', ['pending', 'active'])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($subQ) use ($startDate, $endDate) {
                    $subQ->where('start_date', '<=', $endDate ?? $startDate->copy()->addYear())
                        ->where(function ($endQ) use ($startDate) {
                            $endQ->whereNull('end_date')
                                ->orWhere('end_date', '>=', $startDate);
                        });
                });
            })
            ->with(['route', 'student'])
            ->first();
        
        if ($overlappingBooking) {
            $bookingInfo = sprintf(
                'This student already has a %s booking (ID: %d) from %s to %s. Please cancel or complete the existing booking first.',
                $overlappingBooking->status,
                $overlappingBooking->id,
                $overlappingBooking->start_date->format('M d, Y'),
                $overlappingBooking->end_date ? $overlappingBooking->end_date->format('M d, Y') : 'ongoing'
            );
            return back()->withErrors(['start_date' => $bookingInfo]);
        }

        // Check capacity
        $route = Route::findOrFail($validated['route_id']);
        try {
            $this->capacityGuard->validateBookingCapacity($route);
        } catch (CapacityExceededException $e) {
            return back()->withErrors(['route_id' => $e->getMessage()]);
        }

        // Calculate price
        try {
            $price = $this->pricingService->calculatePrice($validated['plan_type'], $validated['trip_type'], $route);
        } catch (PricingNotFoundException $e) {
            return back()->withErrors(['plan_type' => $e->getMessage()]);
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
            'trip_type' => $validated['trip_type'],
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
        
        // Auto-update booking statuses (activate pending bookings that have started)
        $bookingService = app(BookingService::class);
        $bookingService->updateBookingStatuses();
        
        $students = $user->students;
        
        // Get all bookings for parent's students, including all statuses and dates
        // Don't filter by date - show all bookings regardless of start/end date
        $bookings = Booking::whereIn('student_id', $students->pluck('id'))
            ->with(['student.parent', 'route.vehicle', 'pickupPoint'])
            ->orderBy('created_at', 'desc')
            ->get(); // Use get() to ensure all bookings are shown, including those that might be blocking

        return Inertia::render('Parent/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function showCheckout(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check
        if (!$user->can('view', $booking)) {
            abort(403, 'Unauthorized to view this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Only allow checkout for pending bookings
        if ($booking->status !== 'pending') {
            return redirect()->route('parent.bookings.index')
                ->with('error', 'This booking is not pending payment.');
        }

        // Calculate price
        try {
            $price = $this->pricingService->calculatePrice($booking->plan_type, $booking->trip_type ?? 'two_way', $booking->route);
        } catch (PricingNotFoundException $e) {
            return redirect()->route('parent.bookings.index')
                ->with('error', 'Unable to calculate price for this booking.');
        }

        return Inertia::render('Parent/Bookings/Checkout', [
            'booking' => $booking->load(['student', 'route', 'pickupPoint']),
            'price' => ['price' => $price, 'formatted' => $this->pricingService->formatPrice($price)],
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
            'plan_type' => 'required|in:weekly,monthly,academic_term,annual',
            'trip_type' => 'required|in:one_way,two_way',
        ]);

        try {
            $route = Route::findOrFail($validated['route_id']);
            $price = $this->pricingService->calculatePrice($validated['plan_type'], $validated['trip_type'], $route);
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

        // Authorization check using policy
        if (!$user->can('update', $booking)) {
            abort(403, 'Unauthorized to update this booking.');
        }

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

    public function skipPayment(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $user = $request->user();
        $booking = Booking::findOrFail($validated['booking_id']);

        // Authorization check using policy
        if (!$user->can('update', $booking)) {
            abort(403, 'Unauthorized to update this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Update booking status to active (or keep as pending - depends on business logic)
        // Keeping as 'pending' so it can be paid later
        // You can change this to 'active' if you want bookings to work without payment
        $booking->update([
            'status' => 'pending', // Keep as pending so payment can be made later
        ]);

        // Send notification about booking creation (without payment)
        $user->notify(new BookingConfirmed($booking));

        return redirect()->route('parent.bookings.index')
            ->with('success', 'Booking created successfully! You can complete payment later from your bookings page.');
    }

    public function rebook(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check using policy
        if (!$user->can('view', $booking)) {
            abort(403, 'Unauthorized to view this booking.');
        }

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

    public function show(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check
        if (!$user->can('view', $booking)) {
            abort(403, 'Unauthorized to view this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Calculate price if booking is pending
        $price = null;
        if ($booking->status === 'pending' && $booking->route) {
            try {
                $calculatedPrice = $this->pricingService->calculatePrice($booking->plan_type, $booking->trip_type ?? 'two_way', $booking->route);
                $price = ['price' => $calculatedPrice, 'formatted' => $this->pricingService->formatPrice($calculatedPrice)];
            } catch (PricingNotFoundException $e) {
                // Price calculation failed, but still show booking
            }
        }

        // Load daily pickups for this booking with formatted data
        try {
            $dailyPickups = \App\Models\DailyPickup::where('booking_id', $booking->id)
                ->with(['driver', 'pickupPoint'])
                ->orderBy('pickup_date', 'desc')
                ->orderBy('period', 'asc')
                ->get()
                ->map(function ($pickup) {
                    return [
                        'id' => $pickup->id,
                        'pickup_date' => $pickup->pickup_date ? $pickup->pickup_date->format('Y-m-d') : null,
                        'period' => $pickup->period ?? 'am',
                        'completed_at' => $pickup->completed_at ? $pickup->completed_at->toDateTimeString() : null,
                        'notes' => $pickup->notes,
                        'driver' => $pickup->driver ? [
                            'id' => $pickup->driver->id,
                            'name' => $pickup->driver->name,
                        ] : null,
                        'pickup_point' => $pickup->pickupPoint ? [
                            'id' => $pickup->pickupPoint->id,
                            'name' => $pickup->pickupPoint->name,
                            'address' => $pickup->pickupPoint->address ?? null,
                            'latitude' => $pickup->pickupPoint->latitude,
                            'longitude' => $pickup->pickupPoint->longitude,
                        ] : null,
                    ];
                })
                ->filter(function ($pickup) {
                    return $pickup['pickup_date'] !== null;
                })
                ->groupBy('pickup_date');
        } catch (\Exception $e) {
            // If there's an error loading pickups, use empty collection
            \Log::error('Error loading daily pickups: ' . $e->getMessage());
            $dailyPickups = collect([]);
        }

        // Load booking with relationships (safely handle missing relationships)
        $booking->load(['student.parent', 'student.school', 'route.vehicle', 'pickupPoint', 'dropoffPoint']);
        
        // Load driver separately if route exists
        if ($booking->route) {
            $booking->route->load('driver');
        }

        return Inertia::render('Parent/Bookings/Show', [
            'booking' => $booking,
            'price' => $price,
            'dailyPickups' => $dailyPickups,
        ]);
    }

    public function pickupHistory(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check
        if (!$user->can('view', $booking)) {
            abort(403, 'Unauthorized to view this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Load booking with relationships (safely handle missing relationships)
        $booking->load(['student.parent', 'student.school', 'route.vehicle', 'pickupPoint', 'dropoffPoint']);
        
        // Load driver separately if route exists
        if ($booking->route) {
            $booking->route->load('driver');
        }

        // Load all daily pickups for this booking with comprehensive data
        $dailyPickups = \App\Models\DailyPickup::where('booking_id', $booking->id)
            ->with(['driver', 'pickupPoint'])
            ->orderBy('pickup_date', 'desc')
            ->orderBy('period', 'asc')
            ->get()
            ->map(function ($pickup) use ($booking) {
                return [
                    'id' => $pickup->id,
                    'pickup_date' => $pickup->pickup_date->format('Y-m-d'),
                    'pickup_date_formatted' => $pickup->pickup_date->format('l, F j, Y'),
                    'period' => $pickup->period,
                    'completed_at' => $pickup->completed_at ? $pickup->completed_at->toDateTimeString() : null,
                    'completed_at_formatted' => $pickup->completed_at ? $pickup->completed_at->format('g:i A') : null,
                    'notes' => $pickup->notes,
                    'driver' => $pickup->driver ? [
                        'id' => $pickup->driver->id,
                        'name' => $pickup->driver->name,
                        'email' => $pickup->driver->email,
                    ] : null,
                    'pickup_point' => $pickup->pickupPoint ? [
                        'id' => $pickup->pickupPoint->id,
                        'name' => $pickup->pickupPoint->name,
                        'address' => $pickup->pickupPoint->address,
                        'latitude' => $pickup->pickupPoint->latitude,
                        'longitude' => $pickup->pickupPoint->longitude,
                        'pickup_time' => $pickup->pickupPoint->pickup_time,
                        'dropoff_time' => $pickup->pickupPoint->dropoff_time,
                    ] : null,
                    'route' => $booking->route ? [
                        'id' => $booking->route->id,
                        'name' => $booking->route->name,
                    ] : null,
                ];
            })
            ->groupBy('pickup_date');

        // Calculate statistics
        $totalPickups = $dailyPickups->flatten()->count();
        $completedPickups = $dailyPickups->flatten()->filter(fn($p) => $p['completed_at'] !== null)->count();
        $amPickups = $dailyPickups->flatten()->filter(fn($p) => $p['period'] === 'am')->count();
        $pmPickups = $dailyPickups->flatten()->filter(fn($p) => $p['period'] === 'pm')->count();

        return Inertia::render('Parent/Bookings/PickupHistory', [
            'booking' => $booking,
            'dailyPickups' => $dailyPickups,
            'statistics' => [
                'total' => $totalPickups,
                'completed' => $completedPickups,
                'am' => $amPickups,
                'pm' => $pmPickups,
            ],
        ]);
    }

    public function allPickupHistory(Request $request)
    {
        $user = $request->user();

        // Get all bookings for the parent's students
        $studentIds = $user->students->pluck('id');
        
        if ($studentIds->isEmpty()) {
            return Inertia::render('Parent/Bookings/AllPickupHistory', [
                'bookings' => collect([]),
                'dailyPickups' => collect([]),
                'pickupsByBooking' => collect([]),
                'statistics' => [
                    'total' => 0,
                    'completed' => 0,
                    'am' => 0,
                    'pm' => 0,
                ],
            ]);
        }
        
        $bookings = Booking::whereIn('student_id', $studentIds)
            ->with(['student', 'route.vehicle', 'route.driver', 'pickupPoint', 'dropoffPoint'])
            ->get();

        // Load all daily pickups for all bookings
        $bookingIds = $bookings->pluck('id');
        
        if ($bookingIds->isEmpty()) {
            return Inertia::render('Parent/Bookings/AllPickupHistory', [
                'bookings' => $bookings,
                'dailyPickups' => collect([]),
                'pickupsByBooking' => collect([]),
                'statistics' => [
                    'total' => 0,
                    'completed' => 0,
                    'am' => 0,
                    'pm' => 0,
                ],
            ]);
        }
        
        try {
            $dailyPickups = \App\Models\DailyPickup::whereIn('booking_id', $bookingIds->toArray())
                ->with(['driver', 'pickupPoint', 'booking.student', 'booking.route'])
                ->orderBy('pickup_date', 'desc')
                ->orderBy('period', 'asc')
                ->get()
                ->map(function ($pickup) {
                    $booking = $pickup->booking;
                    return [
                        'id' => $pickup->id,
                        'booking_id' => $pickup->booking_id,
                        'pickup_date' => $pickup->pickup_date->format('Y-m-d'),
                        'pickup_date_formatted' => $pickup->pickup_date->format('l, F j, Y'),
                        'period' => $pickup->period,
                        'completed_at' => $pickup->completed_at ? $pickup->completed_at->toDateTimeString() : null,
                        'completed_at_formatted' => $pickup->completed_at ? $pickup->completed_at->format('g:i A') : null,
                        'notes' => $pickup->notes,
                        'driver' => $pickup->driver ? [
                            'id' => $pickup->driver->id,
                            'name' => $pickup->driver->name,
                            'email' => $pickup->driver->email,
                        ] : null,
                        'pickup_point' => $pickup->pickupPoint ? [
                            'id' => $pickup->pickupPoint->id,
                            'name' => $pickup->pickupPoint->name,
                            'address' => $pickup->pickupPoint->address,
                            'latitude' => $pickup->pickupPoint->latitude,
                            'longitude' => $pickup->pickupPoint->longitude,
                            'pickup_time' => $pickup->pickupPoint->pickup_time,
                            'dropoff_time' => $pickup->pickupPoint->dropoff_time,
                        ] : null,
                        'booking' => $booking ? [
                            'id' => $booking->id,
                            'student' => $booking->student ? [
                                'id' => $booking->student->id,
                                'name' => $booking->student->name,
                            ] : null,
                            'route' => $booking->route ? [
                                'id' => $booking->route->id,
                                'name' => $booking->route->name,
                            ] : null,
                        ] : null,
                    ];
                })
                ->filter(function ($pickup) {
                    return $pickup['pickup_date'] !== null;
                })
                ->groupBy('pickup_date');
        } catch (\Exception $e) {
            \Log::error('Error loading daily pickups: ' . $e->getMessage());
            $dailyPickups = collect([]);
        }

        // Calculate overall statistics
        $totalPickups = $dailyPickups->flatten()->count();
        $completedPickups = $dailyPickups->flatten()->filter(fn($p) => $p['completed_at'] !== null)->count();
        $amPickups = $dailyPickups->flatten()->filter(fn($p) => $p['period'] === 'am')->count();
        $pmPickups = $dailyPickups->flatten()->filter(fn($p) => $p['period'] === 'pm')->count();

        // Group by booking for easier navigation
        $pickupsByBooking = $dailyPickups->flatten()->groupBy('booking_id');

        return Inertia::render('Parent/Bookings/AllPickupHistory', [
            'bookings' => $bookings,
            'dailyPickups' => $dailyPickups,
            'pickupsByBooking' => $pickupsByBooking,
            'statistics' => [
                'total' => $totalPickups,
                'completed' => $completedPickups,
                'am' => $amPickups,
                'pm' => $pmPickups,
            ],
        ]);
    }

    public function edit(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check
        if (!$user->can('update', $booking)) {
            abort(403, 'Unauthorized to edit this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Only allow editing pending bookings or future active bookings
        if ($booking->status !== 'pending') {
            $startDate = \Carbon\Carbon::parse($booking->start_date);
            if ($startDate->isPast() && $booking->status === 'active') {
                return redirect()->route('parent.bookings.show', $booking)
                    ->with('error', 'Cannot edit past or active bookings.');
            }
        }

        // Load booking with relationships
        $booking->load(['student.parent', 'student.school', 'route.vehicle', 'pickupPoint', 'dropoffPoint']);
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

        // Calculate price
        $price = null;
        if ($booking->route) {
            try {
                $calculatedPrice = $this->pricingService->calculatePrice($booking->plan_type, $booking->trip_type ?? 'two_way', $booking->route);
                $price = ['price' => $calculatedPrice, 'formatted' => $this->pricingService->formatPrice($calculatedPrice)];
            } catch (PricingNotFoundException $e) {
                // Price calculation failed
            }
        }

        return Inertia::render('Parent/Bookings/Edit', [
            'booking' => $booking,
            'students' => $students,
            'schools' => $schools,
            'routes' => $routes,
            'price' => $price,
        ]);
    }

    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check
        if (!$user->can('update', $booking)) {
            abort(403, 'Unauthorized to update this booking.');
        }

        // Verify booking belongs to user's student
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized');
        }

        // Only allow updating pending bookings or future active bookings
        if ($booking->status !== 'pending') {
            $startDate = \Carbon\Carbon::parse($booking->start_date);
            if ($startDate->isPast() && $booking->status === 'active') {
                return back()->withErrors(['error' => 'Cannot update past or active bookings.']);
            }
        }

        $validated = $request->validated();

        // Sanitize text inputs
        if (isset($validated['pickup_address'])) {
            $validated['pickup_address'] = strip_tags($validated['pickup_address']);
        }

        // Ensure either pickup_point_id OR pickup_address is provided if route_id is being updated
        if (isset($validated['route_id']) && empty($validated['pickup_point_id']) && empty($validated['pickup_address'])) {
            // If no new pickup info provided, keep existing
            if (!$booking->pickup_point_id && !$booking->pickup_address) {
                return back()->withErrors(['pickup_address' => 'Please either select a pickup point or enter a pickup address.']);
            }
        }

        // Validate booking date against calendar if start_date is being updated
        if (isset($validated['start_date'])) {
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $dateValidation = $this->calendarService->validateBookingDate($startDate);
            if (!$dateValidation['valid']) {
                return back()->withErrors(['start_date' => $dateValidation['message']]);
            }
        }

        // Check for overlapping bookings if dates are being updated (excluding current booking)
        if (isset($validated['start_date']) || isset($validated['end_date'])) {
            $startDate = isset($validated['start_date']) 
                ? \Carbon\Carbon::parse($validated['start_date']) 
                : \Carbon\Carbon::parse($booking->start_date);
            
            $bookingService = app(BookingService::class);
            $endDate = isset($validated['plan_type']) 
                ? $bookingService->calculateEndDate($validated['plan_type'], $startDate)
                : ($booking->end_date ? \Carbon\Carbon::parse($booking->end_date) : null);
            
            if (!$endDate && isset($validated['plan_type'])) {
                $endDate = $bookingService->calculateEndDate($validated['plan_type'], $startDate);
            }
            
            $overlappingBooking = Booking::where('student_id', $booking->student_id)
                ->where('id', '!=', $booking->id)
                ->whereIn('status', ['pending', 'active'])
                ->where(function ($q) use ($startDate, $endDate) {
                    $q->where(function ($subQ) use ($startDate, $endDate) {
                        $subQ->where('start_date', '<=', $endDate ?? $startDate->copy()->addYear())
                            ->where(function ($endQ) use ($startDate) {
                                $endQ->whereNull('end_date')
                                    ->orWhere('end_date', '>=', $startDate);
                            });
                    });
                })
                ->with(['route', 'student'])
                ->first();
            
            if ($overlappingBooking) {
                $bookingInfo = sprintf(
                    'This student already has a %s booking (ID: %d) from %s to %s. Please cancel or complete the existing booking first.',
                    $overlappingBooking->status,
                    $overlappingBooking->id,
                    $overlappingBooking->start_date->format('M d, Y'),
                    $overlappingBooking->end_date ? $overlappingBooking->end_date->format('M d, Y') : 'ongoing'
                );
                return back()->withErrors(['start_date' => $bookingInfo]);
            }
        }

        // Check capacity if route is being updated
        if (isset($validated['route_id']) && $validated['route_id'] != $booking->route_id) {
            $route = Route::findOrFail($validated['route_id']);
            try {
                $this->capacityGuard->validateBookingCapacity($route);
            } catch (CapacityExceededException $e) {
                return back()->withErrors(['route_id' => $e->getMessage()]);
            }
        }

        // Recalculate end date if plan_type or start_date changed
        if (isset($validated['plan_type']) || isset($validated['start_date'])) {
            $planType = $validated['plan_type'] ?? $booking->plan_type;
            $startDate = isset($validated['start_date']) 
                ? \Carbon\Carbon::parse($validated['start_date']) 
                : \Carbon\Carbon::parse($booking->start_date);
            
            $bookingService = app(BookingService::class);
            $newEndDate = $bookingService->calculateEndDate($planType, $startDate);
            $validated['end_date'] = $newEndDate?->format('Y-m-d');
        }

        // Update booking
        $booking->update($validated);

        return redirect()->route('parent.bookings.show', $booking)
            ->with('success', 'Booking updated successfully.');
    }

    public function cancel(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check - parent can only cancel their own student's bookings
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized to cancel this booking.');
        }

        // Allow cancelling pending or active bookings
        if (!in_array($booking->status, ['pending', 'active'])) {
            return back()->withErrors(['error' => 'Only pending or active bookings can be cancelled.']);
        }

        // Cancel the booking
        $booking->update([
            'status' => 'cancelled',
        ]);

        return redirect()->route('parent.bookings.index')
            ->with('success', 'Booking cancelled successfully.');
    }

    public function destroy(Request $request, Booking $booking)
    {
        $user = $request->user();

        // Authorization check - parent can only delete their own student's bookings
        if (!$user->students->contains($booking->student_id)) {
            abort(403, 'Unauthorized to delete this booking.');
        }

        // Only allow deleting cancelled or completed bookings
        // Prevent deleting pending or active bookings (they should be cancelled first)
        if (!in_array($booking->status, ['cancelled', 'completed', 'expired'])) {
            return back()->withErrors(['error' => 'Cannot delete pending or active bookings. Please cancel them first.']);
        }

        // Delete the booking
        $booking->delete();

        return redirect()->route('parent.bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }
}
