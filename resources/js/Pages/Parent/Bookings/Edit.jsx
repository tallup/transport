import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
const axios = window.axios;

export default function EditBooking({ booking, students, routes, price: initialPrice }) {
    const { auth } = usePage().props;
    
    // Helper function to format time - extract just the time portion
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        try {
            let date;
            // Handle different time formats
            if (typeof timeString === 'string') {
                // If it's a full datetime string (ISO format)
                if (timeString.includes('T') || timeString.includes(' ')) {
                    date = new Date(timeString);
                }
                // If it's just time (HH:MM:SS or HH:MM)
                else if (timeString.includes(':') && timeString.length <= 8) {
                    date = new Date('2000-01-01T' + timeString);
                }
                else {
                    return timeString;
                }
            } else {
                date = new Date(timeString);
            }
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return timeString;
            }
            
            // Return formatted time in 12-hour format
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        } catch (e) {
            return timeString;
        }
    };
    
    // Get student_id from URL query parameter
    const [studentIdParam, setStudentIdParam] = useState(null);
    const [initialized, setInitialized] = useState(false);
    
    const [step, setStep] = useState(1); // Start at route selection step (skip student selection)
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(initialPrice || null);
    const [loading, setLoading] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState(routes);
    const [pickupOption, setPickupOption] = useState(booking?.pickup_point_id ? 'pickup_point' : 'custom');

    // Pre-fill form data from booking
    const { data, setData, put, errors, processing } = useForm({
        student_id: booking?.student_id || '',
        route_id: booking?.route_id || '',
        pickup_point_id: booking?.pickup_point_id || '',
        pickup_address: booking?.pickup_address || '',
        plan_type: booking?.plan_type || '',
        trip_type: booking?.trip_type || 'two_way',
        trip_direction: booking?.trip_direction || 'both',
        start_date: booking?.start_date ? new Date(booking.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    const latestDataRef = useRef(data);
    const priceRequestIdRef = useRef(0);
    const isFirstPriceEffectRun = useRef(true);

    // Filter routes for booking's student's school
    useEffect(() => {
        if (booking?.student?.school_id) {
            const filtered = routes.filter(route => 
                route.schools && route.schools.some(school => school.id === parseInt(booking.student.school_id))
            );
            setFilteredRoutes(filtered);
        } else {
            setFilteredRoutes(routes);
        }
    }, [routes, booking]);


    // Initialize with booking data
    useEffect(() => {
        if (booking) {
            // Set selected route
            const route = routes.find(r => r.id === parseInt(booking.route_id));
            if (route) {
                setSelectedRoute(route);
                checkCapacity(booking.route_id);
            }
            
            // Set pickup option based on booking
            if (booking.pickup_point_id) {
                setPickupOption('pickup_point');
            } else {
                setPickupOption('custom');
            }
            
            // Set price if provided
            if (initialPrice) {
                setPrice(initialPrice);
            } else if (booking.route_id && booking.plan_type) {
                // Calculate price if not provided
                calculatePrice();
            }
        }
    }, []);

    // Load route details when route is selected
    useEffect(() => {
        if (data.route_id) {
            const route = filteredRoutes.find(r => r.id === parseInt(data.route_id));
            setSelectedRoute(route);
            checkCapacity(data.route_id);
            // Only reset pickup option if route actually changed (not on initial load)
            // Preserve existing pickup_point_id if it belongs to the new route
            if (route && data.pickup_point_id) {
                const hasPickupPoint = route.pickup_points?.some(p => p.id === parseInt(data.pickup_point_id));
                if (!hasPickupPoint) {
                    // Pickup point doesn't belong to new route, reset
                    setPickupOption('custom');
                    setData('pickup_point_id', '');
                }
            }
        } else {
            setSelectedRoute(null);
        }
    }, [data.route_id, filteredRoutes]);

    // When Two way is selected, trip direction is always both. When One way, require pickup or dropoff.
    useEffect(() => {
        if (data.trip_type === 'two_way') {
            setData('trip_direction', 'both');
        } else if (data.trip_type === 'one_way' && data.trip_direction === 'both') {
            setData('trip_direction', 'pickup_only');
        }
    }, [data.trip_type]);

    // Keep ref in sync so async callbacks can read current form state
    latestDataRef.current = data;

    // Calculate price when route, plan type, or trip type changes
    useEffect(() => {
        if (data.route_id && data.plan_type) {
            if (!isFirstPriceEffectRun.current) {
                setPrice(null);
            }
            isFirstPriceEffectRun.current = false;
            calculatePrice();
        } else {
            setPrice(null);
        }
    }, [data.route_id, data.plan_type, data.trip_type]);

    const checkCapacity = async (routeId) => {
        try {
            const response = await axios.get(`/parent/routes/${routeId}/capacity`);
            setAvailableSeats(response.data);
        } catch (error) {
            console.error('Error checking capacity:', error);
        }
    };

    const calculatePrice = async () => {
        if (!data.route_id || !data.plan_type) return;
        const requestParams = {
            route_id: data.route_id,
            plan_type: data.plan_type,
            trip_type: data.trip_type,
        };
        const requestId = ++priceRequestIdRef.current;
        setLoading(true);
        try {
            const response = await axios.post('/parent/calculate-price', requestParams);
            const current = latestDataRef.current;
            const stillMatches =
                String(current.route_id) === String(requestParams.route_id) &&
                current.plan_type === requestParams.plan_type &&
                current.trip_type === requestParams.trip_type;
            if (stillMatches && response.data && !response.data.error) {
                setPrice(response.data);
            }
        } catch (error) {
            console.error('Error calculating price:', error);
            if (requestId === priceRequestIdRef.current) {
                setPrice(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields before submitting
        const hasPickupLocation = pickupOption === 'pickup_point' 
            ? data.pickup_point_id 
            : data.pickup_address;
        
        if (!data.route_id || !hasPickupLocation || !data.plan_type || !data.start_date) {
            alert('Please complete all required fields.');
            return;
        }
        
        put(`/parent/bookings/${booking.id}`, {
            preserveScroll: false,
            onSuccess: () => {
                // Navigate to booking show page
                router.visit(`/parent/bookings/${booking.id}`);
            },
            onError: (errors) => {
                // Errors will be available in the errors object
                console.log('Form errors:', errors);
                // Scroll to top to show errors
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const nextStep = () => {
        // Step 1: Route
        if (step === 1 && !data.route_id) {
            alert('Please select a route.');
            return;
        }
        // Step 2: Pickup
        if (step === 2) {
            if (pickupOption === 'pickup_point' && !data.pickup_point_id) {
                alert('Please select a pickup point.');
                return;
            }
            if (pickupOption === 'custom' && !data.pickup_address) {
                alert('Please enter a pickup address.');
                return;
            }
        }
        // Step 3: Plan
        if (step === 3 && !data.plan_type) {
            alert('Please select a plan.');
            return;
        }
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        // Don't allow going back before route selection (step 1)
        if (step > 1) {
            setStep(step - 1);
        } else {
            // Go back to booking show page
            router.visit(`/parent/bookings/${booking.id}`);
        }
    };

    // Initialize immediately if window is available (client-side)
    useEffect(() => {
        if (typeof window !== 'undefined' && !initialized && students && students.length > 0) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const studentId = urlParams.get('student_id');
                
                if (studentId) {
                    setStudentIdParam(studentId);
                    
                    // Parse studentId to integer for comparison
                    const studentIdInt = parseInt(studentId, 10);
                    if (!isNaN(studentIdInt)) {
                        setData('student_id', studentIdInt);
                        setStep(1);
                        
                        // Find student and set school_id and pickup_address
                        const student = students.find(s => {
                            // Handle both string and number comparisons
                            return s.id === studentIdInt || s.id == studentId || String(s.id) === String(studentId);
                        });
                        
                        if (student) {
                            if (student.school_id) {
                                setData('school_id', student.school_id);
                            }
                            if (student.home_address) {
                                setData('pickup_address', student.home_address);
                            }
                        }
                    }
                }
                setInitialized(true);
            } catch (error) {
                console.error('Error initializing booking form:', error);
                setInitialized(true);
            }
        }
    }, [initialized, students, setData]);

    // Show loading state if students haven't loaded yet
    if (!students || students.length === 0) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Edit Booking" />
                <div className="py-10">
                    <div className="container">
                        <GlassCard className="overflow-hidden">
                            <div className="p-6">
                                <p className="text-center text-slate-600">Loading...</p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const stepLabels = ['Route', 'Pickup', 'Plan', 'Review'];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Book Transport" />

            <div className="py-10">
                <div className="container">
                    {/* Header Section - match Create */}
                    <div className="mb-10 text-center">
                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Edit Booking</h1>
                        <p className="text-base font-medium text-slate-600">Update your booking in a few simple steps</p>
                    </div>

                    <GlassCard className="overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <div className="mb-6">
                                <Link
                                    href={`/parent/bookings/${booking.id}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary transition-colors hover:text-brand-secondary"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Booking Details
                                </Link>
                            </div>

                            {booking?.student && (
                                <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Editing booking for:</p>
                                                <p className="text-lg font-extrabold text-slate-900">
                                                    {booking.student.name}
                                                    {booking.student.school && (
                                                        <span className="text-base font-semibold text-slate-700 ml-2">
                                                            - {booking.student.school.name}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/parent/bookings/${booking.id}`}
                                            className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Step Indicator - match Create (4 steps) */}
                            <div className="mb-12">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full -z-0"></div>
                                    {[1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center flex-1 relative z-10">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="relative">
                                                    {s < 4 && step > s && (
                                                        <div className="absolute top-4 left-1/2 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full -z-0" style={{ width: 'calc(100% + 1rem)' }}></div>
                                                    )}
                                                    <div
                                                        className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                                            step > s
                                                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-brand-primary shadow-lg scale-110'
                                                                : step === s
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-brand-primary shadow-xl scale-125 ring-4 ring-yellow-400/40'
                                                                    : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                                                        }`}
                                                    >
                                                        {step > s ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-base">{s}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                                    step >= s ? 'text-brand-primary' : 'text-slate-400'
                                                }`}>
                                                    {stepLabels[s - 1]}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Select Route */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-extrabold text-brand-primary mb-2">Choose your route</h3>
                                                {booking?.student?.school && (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-brand-primary font-semibold text-sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {booking.student.school.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-brand-primary text-lg font-bold mb-2">No routes available</p>
                                                <p className="text-brand-primary/70 text-sm">
                                                    No routes are currently configured for this student's school.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                {filteredRoutes.map((route) => {
                                                    const isSelected = data.route_id == route.id;
                                                    return (
                                                        <label
                                                            key={route.id}
                                                            className={`group relative flex cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl border-2 ${
                                                                isSelected
                                                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-xl ring-2 ring-yellow-400/40 scale-[1.02]'
                                                                    : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400 hover:shadow-lg'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="route_id"
                                                                value={route.id}
                                                                checked={isSelected}
                                                                onChange={(e) => setData('route_id', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                            )}
                                                            <div className="flex-1 flex flex-col sm:flex-row gap-4 p-5 pl-6 min-w-0">
                                                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                                    isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-white/15 group-hover:bg-white/25'
                                                                }`}>
                                                                    <svg className={`w-7 h-7 ${isSelected ? '!text-brand-primary' : 'text-white/80'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-lg font-extrabold text-white mb-1 pr-8">{route.name}</p>
                                                                    {route.vehicle && (
                                                                        <p className="text-sm text-white/75 font-medium mb-3">
                                                                            {route.vehicle.make} {route.vehicle.model} · {route.vehicle.license_plate}
                                                                        </p>
                                                                    )}
                                                                    {(route.pickup_time || route.dropoff_time) && (
                                                                        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-black/10 border border-yellow-400/20">
                                                                            {route.pickup_time && (
                                                                                <span className="flex items-center gap-1.5 text-sm">
                                                                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                                                                    <span className="text-white/90 font-medium">Pickup</span>
                                                                                    <span className="text-green-200 font-bold">{formatTime(route.pickup_time)}</span>
                                                                                </span>
                                                                            )}
                                                                            {(route.pickup_time && route.dropoff_time) && (
                                                                                <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                                </svg>
                                                                            )}
                                                                            {route.dropoff_time && (
                                                                                <span className="flex items-center gap-1.5 text-sm">
                                                                                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                                                                                    <span className="text-white/90 font-medium">Dropoff</span>
                                                                                    <span className="text-blue-200 font-bold">{formatTime(route.dropoff_time)}</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-shrink-0 self-start sm:self-center">
                                                                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border ${
                                                                        route.available_seats > 0
                                                                            ? 'bg-emerald-500/25 text-emerald-100 border-emerald-400/50'
                                                                            : 'bg-red-500/25 text-red-100 border-red-400/50'
                                                                    }`}>
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                        </svg>
                                                                        {route.available_seats} seats
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                                                    <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {errors.route_id && (
                                            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
                                                <p className="text-red-200 text-sm font-bold">{errors.route_id}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Enter Pickup Address */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-primary mb-2">Where should we pick up?</h3>
                                            <p className="text-sm text-brand-primary/70">Choose a stop from your route or enter a custom address</p>
                                        </div>

                                        {selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/80 uppercase tracking-wider mb-3">Pickup type</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        pickupOption === 'pickup_point'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="pickup_option"
                                                            value="pickup_point"
                                                            checked={pickupOption === 'pickup_point'}
                                                            onChange={(e) => {
                                                                setPickupOption(e.target.value);
                                                                setData('pickup_point_id', '');
                                                                setData('pickup_address', '');
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        {pickupOption === 'pickup_point' && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                        )}
                                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${pickupOption === 'pickup_point' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                            <svg className={`w-6 h-6 ${pickupOption === 'pickup_point' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-extrabold text-white">From route stop</p>
                                                            <p className="text-xs text-white/70 mt-0.5">Choose a scheduled pickup point</p>
                                                        </div>
                                                        {pickupOption === 'pickup_point' && (
                                                            <div className="ml-auto w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow">
                                                                <svg className="w-3.5 h-3.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                    <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        pickupOption === 'custom'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="pickup_option"
                                                            value="custom"
                                                            checked={pickupOption === 'custom'}
                                                            onChange={(e) => {
                                                                setPickupOption(e.target.value);
                                                                setData('pickup_point_id', '');
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        {pickupOption === 'custom' && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                        )}
                                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${pickupOption === 'custom' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                            <svg className={`w-6 h-6 ${pickupOption === 'custom' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-extrabold text-white">Custom address</p>
                                                            <p className="text-xs text-white/70 mt-0.5">Enter your own pickup location</p>
                                                        </div>
                                                        {pickupOption === 'custom' && (
                                                            <div className="ml-auto w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow">
                                                                <svg className="w-3.5 h-3.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {pickupOption === 'pickup_point' && selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 ? (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/80 uppercase tracking-wider mb-3">Select a stop</p>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {selectedRoute.pickup_points.map((point) => {
                                                        const isSelected = data.pickup_point_id == point.id;
                                                        return (
                                                            <label
                                                                key={point.id}
                                                                className={`group relative flex cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl border-2 ${
                                                                    isSelected
                                                                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-xl ring-2 ring-yellow-400/40 scale-[1.01]'
                                                                        : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400 hover:shadow-lg'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="pickup_point_id"
                                                                    value={point.id}
                                                                    checked={isSelected}
                                                                    onChange={(e) => {
                                                                        setData('pickup_point_id', e.target.value);
                                                                        setData('pickup_address', point.address);
                                                                    }}
                                                                    className="sr-only"
                                                                />
                                                                {isSelected && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                                )}
                                                                <div className="flex-1 flex gap-4 p-5 pl-6 min-w-0">
                                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                                        <svg className={`w-6 h-6 ${isSelected ? '!text-brand-primary' : 'text-white/80'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 pr-8">
                                                                        <p className="text-base font-extrabold text-white mb-1">{point.name}</p>
                                                                        <p className="text-sm text-white/75">{point.address}</p>
                                                                        {(point.pickup_time || point.dropoff_time) && (
                                                                            <div className="flex flex-wrap items-center gap-2 mt-2 p-2 rounded-lg bg-black/10 border border-yellow-400/20">
                                                                                {point.pickup_time && (
                                                                                    <span className="flex items-center gap-1 text-xs">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                                                        <span className="text-green-200 font-bold">{formatTime(point.pickup_time)}</span>
                                                                                    </span>
                                                                                )}
                                                                                {point.dropoff_time && (
                                                                                    <span className="flex items-center gap-1 text-xs">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                                                        <span className="text-blue-200 font-bold">{formatTime(point.dropoff_time)}</span>
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                                                        <svg className="w-3.5 h-3.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                {errors.pickup_point_id && (
                                                    <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
                                                        <p className="text-red-200 text-sm font-bold">{errors.pickup_point_id}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border-2 border-yellow-400/60 bg-white/5 overflow-hidden">
                                                <div className="flex items-center gap-3 p-4 border-b border-yellow-400/30 bg-white/5">
                                                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-white">Pickup address</p>
                                                        <p className="text-xs text-white/70">Full street address for daily pickup</p>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <textarea
                                                        value={data.pickup_address}
                                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                                        placeholder="e.g. 123 Main St, City, State ZIP"
                                                        rows={4}
                                                        className="block w-full p-4 rounded-xl border-2 border-yellow-400/70 bg-white/10 text-white placeholder-white/40 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition backdrop-blur-sm font-medium"
                                                        required={pickupOption === 'custom'}
                                                    />
                                                    <p className="mt-3 flex items-center gap-2 text-xs text-white/70">
                                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        This address will be used for daily pickup.
                                                    </p>
                                                    {errors.pickup_address && (
                                                        <div className="mt-3 p-3 bg-red-500/20 border border-red-400/50 rounded-xl">
                                                            <p className="text-red-200 text-sm font-bold">{errors.pickup_address}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Select Plan */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-extrabold text-brand-primary mb-2">Choose your plan</h3>
                                            <p className="text-sm text-brand-primary/70">Select duration, start date, and trip type</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-brand-primary/80 uppercase tracking-wider mb-3">Plan duration</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                    { id: 'weekly', label: 'Weekly', desc: 'Pay as you go' },
                                                    { id: 'monthly', label: 'Monthly', desc: 'Most popular' },
                                                    { id: 'academic_term', label: 'Academic Term', desc: 'Full term' },
                                                    { id: 'annual', label: 'Annual', desc: 'Best value' },
                                                ].map(({ id: plan, label, desc }) => {
                                                    const isSelected = data.plan_type === plan;
                                                    return (
                                                        <label
                                                            key={plan}
                                                            className={`group relative flex flex-col cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl border-2 ${
                                                                isSelected
                                                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-xl ring-2 ring-yellow-400/40 scale-[1.02]'
                                                                    : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400 hover:shadow-lg'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="plan_type"
                                                                value={plan}
                                                                checked={isSelected}
                                                                onChange={(e) => setData('plan_type', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                            )}
                                                            <div className="flex-1 p-5 pl-6 min-w-0">
                                                                <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-3 transition-all ${isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                                    <svg className={`w-5 h-5 ${isSelected ? '!text-brand-primary' : 'text-white/80'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-base font-extrabold text-white">{label}</p>
                                                                <p className="text-xs text-white/70 mt-0.5">{desc}</p>
                                                                {price && isSelected && (
                                                                    <p className="mt-3 text-lg font-extrabold text-green-200">
                                                                        {price.per_booking_formatted ?? price.formatted}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                                                    <svg className="w-3.5 h-3.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {loading && (
                                                <div className="mt-4 p-4 rounded-xl bg-white/10 border border-yellow-400/50 flex items-center gap-3">
                                                    <svg className="animate-spin w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <p className="text-white text-sm font-medium">Calculating price...</p>
                                                </div>
                                            )}
                                            {errors.plan_type && (
                                                <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
                                                    <p className="text-red-200 text-sm font-bold">{errors.plan_type}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="rounded-2xl border-2 border-yellow-400/60 bg-white/5 overflow-hidden">
                                                <div className="flex items-center gap-3 p-4 border-b border-yellow-400/30 bg-white/5">
                                                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-white">Start date</p>
                                                        <p className="text-xs text-white/70">When transport begins</p>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="block w-full p-3 rounded-xl border-2 border-yellow-400/70 bg-white/10 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition backdrop-blur-sm font-medium"
                                                        required
                                                    />
                                                    {errors.start_date && (
                                                        <p className="mt-2 text-red-300 text-sm font-bold">{errors.start_date}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/80 uppercase tracking-wider mb-3">Trip type</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        data.trip_type === 'one_way'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="one_way"
                                                            checked={data.trip_type === 'one_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        {data.trip_type === 'one_way' && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                        )}
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_type === 'one_way' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                            <svg className={`w-4 h-4 ${data.trip_type === 'one_way' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-extrabold text-white">One way</p>
                                                            <p className="text-xs text-white/60">AM or PM only</p>
                                                        </div>
                                                        {data.trip_type === 'one_way' && (
                                                            <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2.5 h-2.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                    <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        data.trip_type === 'two_way'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="two_way"
                                                            checked={data.trip_type === 'two_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        {data.trip_type === 'two_way' && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                        )}
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_type === 'two_way' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                            <svg className={`w-4 h-4 ${data.trip_type === 'two_way' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-extrabold text-white">Two way</p>
                                                            <p className="text-xs text-white/60">AM & PM</p>
                                                        </div>
                                                        {data.trip_type === 'two_way' && (
                                                            <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2.5 h-2.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                                {errors.trip_type && (
                                                    <p className="mt-2 text-red-300 text-sm font-bold">{errors.trip_type}</p>
                                                )}
                                            </div>

                                            {data.trip_type === 'one_way' && (
                                                <div className="md:col-span-2">
                                                    <p className="text-xs font-bold text-brand-primary/80 uppercase tracking-wider mb-3">Service</p>
                                                    <p className="text-xs text-white/60 mb-3">One way: choose pickup only or dropoff only</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                            data.trip_direction === 'pickup_only'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                                : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_direction"
                                                                value="pickup_only"
                                                                checked={data.trip_direction === 'pickup_only'}
                                                                onChange={(e) => setData('trip_direction', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            {data.trip_direction === 'pickup_only' && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                            )}
                                                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_direction === 'pickup_only' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                                <svg className={`w-4 h-4 ${data.trip_direction === 'pickup_only' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-extrabold text-white">Pickup only</p>
                                                                <p className="text-xs text-white/60">To school (AM)</p>
                                                            </div>
                                                            {data.trip_direction === 'pickup_only' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                        <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                            data.trip_direction === 'dropoff_only'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                                : 'border-yellow-400/60 bg-white/5 hover:bg-white/10 hover:border-yellow-400'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_direction"
                                                                value="dropoff_only"
                                                                checked={data.trip_direction === 'dropoff_only'}
                                                                onChange={(e) => setData('trip_direction', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            {data.trip_direction === 'dropoff_only' && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                            )}
                                                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_direction === 'dropoff_only' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-white/15 group-hover:bg-white/25'}`}>
                                                                <svg className={`w-4 h-4 ${data.trip_direction === 'dropoff_only' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-extrabold text-white">Dropoff only</p>
                                                                <p className="text-xs text-white/60">From school (PM)</p>
                                                            </div>
                                                            {data.trip_direction === 'dropoff_only' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                    {errors.trip_direction && (
                                                        <p className="mt-2 text-red-300 text-sm font-bold">{errors.trip_direction}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-brand-primary mb-2">Review Your Booking</h3>
                                            <p className="text-sm text-brand-primary/70">Please review all details before saving changes</p>
                                        </div>

                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-500/20 border-2 border-red-400/50 p-5 rounded-xl mb-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-white font-extrabold">Please fix the following errors:</p>
                                                </div>
                                                <ul className="list-disc list-inside space-y-1 ml-2">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key} className="text-red-100 text-sm font-semibold">{message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="bg-gradient-to-br from-white/15 to-white/10 border-2 border-yellow-400/60 p-8 rounded-xl space-y-6 shadow-lg">
                                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Student</p>
                                                    <p className="text-lg font-extrabold text-white">{booking?.student?.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Route</p>
                                                    <p className="text-lg font-extrabold text-white mb-2">{selectedRoute?.name}</p>
                                                    {selectedRoute && (selectedRoute.pickup_time || selectedRoute.dropoff_time) && (
                                                        <div className="flex flex-wrap gap-4 text-xs text-white/70 mt-2">
                                                            {selectedRoute.pickup_time && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Pickup: <span className="font-bold text-green-200">{formatTime(selectedRoute.pickup_time)}</span>
                                                                </span>
                                                            )}
                                                            {selectedRoute.dropoff_time && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Dropoff: <span className="font-bold text-blue-200">{formatTime(selectedRoute.dropoff_time)}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Pickup Location</p>
                                                    <p className="text-lg font-extrabold text-white">
                                                        {data.pickup_point_id
                                                            ? (() => {
                                                                const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                                return selectedPoint ? `${selectedPoint.name} - ${selectedPoint.address}` : data.pickup_address;
                                                              })()
                                                            : data.pickup_address || 'Not set'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Plan</p>
                                                        <p className="text-base font-extrabold text-white">
                                                            {data.plan_type === 'academic_term' ? 'Academic Term' : (data.plan_type || '').replace('_', '-')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Trip Type</p>
                                                        <p className="text-base font-extrabold text-white">
                                                            {data.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {data.trip_type === 'one_way' && (
                                                    <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                            <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Service</p>
                                                            <p className="text-base font-extrabold text-white">
                                                                {data.trip_direction === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-yellow-400/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Start Date</p>
                                                    <p className="text-lg font-extrabold text-white">{new Date(data.start_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {price && (
                                                <div className="border-t-2 border-yellow-400/50 pt-6 mt-6">
                                                    {price.discount_label && (
                                                        <p className="mb-2 text-sm font-semibold text-yellow-300">{price.discount_label} applied</p>
                                                    )}
                                                    <div className="flex justify-between items-center p-5 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border-2 border-green-400/30">
                                                        <span className="text-xl font-extrabold text-white">Total Amount:</span>
                                                        <span className="text-3xl font-extrabold text-green-200">
                                                            {price.total_formatted ?? price.formatted}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons - match Create */}
                                <div className="flex justify-between items-center mt-10 pt-8 border-t-2 border-yellow-400/40">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 bg-white/10 border-2 border-yellow-400/60 text-white hover:bg-white/20 hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {step === 1 ? 'Back' : 'Previous'}
                                    </button>
                                    {step < 4 ? (
                                        <GlassButton
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-brand-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            Next
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </GlassButton>
                                    ) : (
                                        <GlassButton
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-brand-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    Update Booking
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </GlassButton>
                                    )}
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

