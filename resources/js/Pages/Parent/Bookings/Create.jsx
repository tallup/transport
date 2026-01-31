import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
const axios = window.axios;

export default function CreateBooking({ students, routes }) {
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
    
    const [step, setStep] = useState(0);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState(routes);
    const [pickupOption, setPickupOption] = useState('custom'); // 'pickup_point' or 'custom'

    const { data, setData, post, errors, processing } = useForm({
        school_id: '',
        student_id: '',
        route_id: '',
        pickup_point_id: '',
        pickup_address: '',
        plan_type: '',
        trip_type: 'two_way',
        start_date: new Date().toISOString().split('T')[0],
    });

    // Filter routes when school is selected
    useEffect(() => {
        if (data.school_id) {
            const filtered = routes.filter(route => 
                route.schools && route.schools.some(school => school.id === parseInt(data.school_id))
            );
            setFilteredRoutes(filtered);
            // Reset route selection if current route doesn't serve selected school
            if (data.route_id) {
                const currentRoute = filtered.find(r => r.id === parseInt(data.route_id));
                if (!currentRoute) {
                    setData('route_id', '');
                }
            }
        } else {
            setFilteredRoutes(routes);
        }
    }, [data.school_id, routes]);


    // Auto-set school_id and filter routes when student is selected
    useEffect(() => {
        if (data.student_id) {
            const student = students.find(s => s.id == data.student_id);
            if (student?.school_id) {
                // Automatically set the school_id based on student's school
                setData('school_id', student.school_id);
            }
            // Pre-fill pickup address with student's home address
            if (!data.pickup_address && student?.home_address) {
                setData('pickup_address', student.home_address);
            }
        }
    }, [data.student_id, students]);

    // Load route details when route is selected
    useEffect(() => {
        if (data.route_id) {
            const route = filteredRoutes.find(r => r.id === parseInt(data.route_id));
            setSelectedRoute(route);
            checkCapacity(data.route_id);
            // Reset pickup option and data when route changes
            setPickupOption('custom');
            setData('pickup_point_id', '');
        } else {
            setSelectedRoute(null);
            setPickupOption('custom');
        }
    }, [data.route_id, filteredRoutes]);

    // Calculate price when route, plan type, or trip type changes
    useEffect(() => {
        if (data.route_id && data.plan_type && data.trip_type) {
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
        if (!data.route_id || !data.plan_type || !data.trip_type) return;
        setLoading(true);
        try {
            const response = await axios.get('/parent/calculate-price', {
                params: {
                    route_id: data.route_id,
                    plan_type: data.plan_type,
                    trip_type: data.trip_type,
                },
            });
            setPrice(response.data);
        } catch (error) {
            console.error('Error calculating price:', error);
            setPrice(null);
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
        
        if (!data.student_id || !data.route_id || !hasPickupLocation || !data.plan_type || !data.start_date) {
            alert('Please complete all required fields before proceeding to payment.');
            return;
        }
        
        post('/parent/bookings', {
            preserveScroll: false,
            onSuccess: (page) => {
                // Inertia will automatically navigate to the checkout page
                // The controller returns Inertia::render('Parent/Bookings/Checkout', ...)
            },
            onError: (errors) => {
                // Errors will be available in the errors object
                console.log('Form errors:', errors);
                // Scroll to top to show errors
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onFinish: () => {
                // This runs after the request completes (success or error)
            },
        });
    };

    const nextStep = () => {
        // Step 0: Student (only if not pre-selected)
        if (step === 0 && !data.student_id) return;
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
        setStep(step + 1);
    };

    const prevStep = () => {
        // Don't go back to student selection if student was pre-selected from URL
        if (step === 1 && studentIdParam) {
            // If we started at step 1 (route selection) because student was pre-selected,
            // going back should take us to the students list page
            window.location.href = '/parent/students';
        } else {
            setStep(step - 1);
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
                <Head title="Book Transport" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <GlassCard className="overflow-hidden">
                            <div className="p-6">
                                <p className="text-white text-center">Loading...</p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Book Transport" />

            <div className="py-8">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-8">
                            {/* Header */}
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold text-brand-primary mb-2">Book Transport Service</h2>
                                <p className="text-sm text-brand-primary/70">Follow the steps to complete your booking</p>
                            </div>

                            {/* Step Indicator - Clean Design */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between">
                                    {[0, 1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                                        step > s
                                                            ? 'bg-yellow-400 text-brand-primary'
                                                            : step === s
                                                                ? 'bg-yellow-400 text-brand-primary ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent'
                                                                : 'bg-white/10 text-white/50'
                                                    }`}
                                                >
                                                    {step > s ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        s + 1
                                                    )}
                                                </div>
                                                <span className={`mt-2 text-xs font-semibold ${
                                                    step >= s ? 'text-brand-primary' : 'text-white/40'
                                                }`}>
                                                    {['Student', 'Route', 'Pickup', 'Plan', 'Review'][s]}
                                                </span>
                                            </div>
                                            {s < 4 && (
                                                <div
                                                    className={`h-0.5 flex-1 mx-2 transition-all ${
                                                        step > s ? 'bg-yellow-400' : 'bg-white/10'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Show selected student info when coming from students list */}
                            {studentIdParam && data.student_id && students && students.length > 0 && (() => {
                                const selectedStudent = students.find(s => {
                                    return s.id == data.student_id || s.id === parseInt(data.student_id, 10) || String(s.id) === String(data.student_id);
                                });
                                return selectedStudent ? (
                                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-blue-200 mb-1">Booking for:</p>
                                                <p className="text-base font-bold text-white">
                                                    {selectedStudent.name}
                                                    {selectedStudent.school && (
                                                        <span className="text-sm font-normal text-white/80 ml-2">
                                                            - {selectedStudent.school.name}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <Link
                                                href="/parent/students"
                                                className="text-sm font-semibold text-blue-200 hover:text-white underline"
                                            >
                                                Change
                                            </Link>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            <form onSubmit={handleSubmit}>
                                {/* Step 0: Select Student */}
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-brand-primary mb-4">Select Student</h3>
                                        {students.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-white text-base font-semibold mb-4">No students registered yet.</p>
                                                <Link
                                                    href="/parent/students/enroll"
                                                    className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                                                >
                                                    Add a student first
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {students.map((student) => (
                                                    <label
                                                        key={student.id}
                                                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                                            data.student_id == student.id
                                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="student_id"
                                                            value={student.id}
                                                            checked={data.student_id == student.id}
                                                            onChange={(e) => setData('student_id', e.target.value)}
                                                            className="w-5 h-5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-white">{student.name}</p>
                                                            {student.school && (
                                                                <p className="text-sm text-white/70 mt-0.5">{student.school.name}</p>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.student_id && (
                                            <p className="text-red-300 text-sm font-semibold mt-2">{errors.student_id}</p>
                                        )}
                                    </div>
                                )}

                                {/* Step 1: Select Route */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-brand-primary mb-1">Select Route</h3>
                                            {data.student_id && (() => {
                                                const selectedStudent = students.find(s => s.id == data.student_id);
                                                return selectedStudent?.school ? (
                                                    <p className="text-sm text-white/60 mb-4">
                                                        Routes for: <span className="text-white font-semibold">{selectedStudent.school.name}</span>
                                                    </p>
                                                ) : null;
                                            })()}
                                        </div>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-white text-base font-semibold mb-2">No routes available</p>
                                                <p className="text-white/60 text-sm">
                                                    No routes are currently configured for this student's school.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {filteredRoutes.map((route) => (
                                                    <label
                                                        key={route.id}
                                                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                                            data.route_id == route.id
                                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="route_id"
                                                            value={route.id}
                                                            checked={data.route_id == route.id}
                                                            onChange={(e) => setData('route_id', e.target.value)}
                                                            className="w-5 h-5 mt-0.5 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                                <div>
                                                                    <p className="font-bold text-white">{route.name}</p>
                                                                    {route.vehicle && (
                                                                        <p className="text-sm text-white/70 mt-0.5">
                                                                            {route.vehicle.make} {route.vehicle.model} • {route.vehicle.license_plate}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                                                                    route.available_seats > 0
                                                                        ? 'bg-green-500/20 text-green-200'
                                                                        : 'bg-red-500/20 text-red-200'
                                                                }`}>
                                                                    {route.available_seats} seats
                                                                </span>
                                                            </div>
                                                            {(route.pickup_time || route.dropoff_time) && (
                                                                <div className="flex flex-wrap gap-4 text-xs text-white/60 mt-2">
                                                                    {route.pickup_time && (
                                                                        <span>Pickup: <span className="font-semibold text-white">{formatTime(route.pickup_time)}</span></span>
                                                                    )}
                                                                    {route.dropoff_time && (
                                                                        <span>Dropoff: <span className="font-semibold text-white">{formatTime(route.dropoff_time)}</span></span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.route_id && (
                                            <p className="text-red-300 text-sm font-semibold mt-2">{errors.route_id}</p>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Enter Pickup Address */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-brand-primary mb-4">Pickup Location</h3>
                                        
                                        {selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-white mb-2">
                                                    Choose Option <span className="text-red-300">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        pickupOption === 'pickup_point'
                                                            ? 'border-yellow-400 bg-yellow-400/10'
                                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
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
                                                            className="w-4 h-4 text-yellow-400"
                                                        />
                                                        <span className="text-sm font-semibold text-white">From Route</span>
                                                    </label>
                                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        pickupOption === 'custom'
                                                            ? 'border-yellow-400 bg-yellow-400/10'
                                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
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
                                                            className="w-4 h-4 text-yellow-400"
                                                        />
                                                        <span className="text-sm font-semibold text-white">Custom Address</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {pickupOption === 'pickup_point' && selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 ? (
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-white mb-2">
                                                    Select Pickup Point <span className="text-red-300">*</span>
                                                </label>
                                                {selectedRoute.pickup_points.map((point) => (
                                                    <label
                                                        key={point.id}
                                                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                                            data.pickup_point_id == point.id
                                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="pickup_point_id"
                                                            value={point.id}
                                                            checked={data.pickup_point_id == point.id}
                                                            onChange={(e) => {
                                                                setData('pickup_point_id', e.target.value);
                                                                setData('pickup_address', point.address);
                                                            }}
                                                            className="w-5 h-5 mt-0.5 text-yellow-400"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-white">{point.name}</p>
                                                            <p className="text-sm text-white/70 mt-0.5">{point.address}</p>
                                                            {(point.pickup_time || point.dropoff_time) && (
                                                                <div className="flex flex-wrap gap-3 text-xs text-white/60 mt-2">
                                                                    {point.pickup_time && (
                                                                        <span>Pickup: <span className="font-semibold text-white">{formatTime(point.pickup_time)}</span></span>
                                                                    )}
                                                                    {point.dropoff_time && (
                                                                        <span>Dropoff: <span className="font-semibold text-white">{formatTime(point.dropoff_time)}</span></span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                                {errors.pickup_point_id && (
                                                    <p className="text-red-300 text-sm font-semibold mt-2">{errors.pickup_point_id}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-semibold text-white mb-2">
                                                    Pickup Address <span className="text-red-300">*</span>
                                                </label>
                                                <textarea
                                                    value={data.pickup_address}
                                                    onChange={(e) => setData('pickup_address', e.target.value)}
                                                    placeholder="Enter the full address where the student will be picked up"
                                                    rows={3}
                                                    className="block w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                                    required={pickupOption === 'custom'}
                                                />
                                                {errors.pickup_address && (
                                                    <p className="text-red-300 text-sm font-semibold mt-2">{errors.pickup_address}</p>
                                                )}
                                                <p className="text-xs text-white/60 mt-2">
                                                    This address will be used for daily pickup.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Select Plan */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-brand-primary mb-4">Select Plan</h3>
                                        
                                        <div className="space-y-2 mb-6">
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                Plan Type <span className="text-red-300">*</span>
                                            </label>
                                            {['weekly', 'monthly', 'academic_term', 'annual'].map((plan) => (
                                                <label
                                                    key={plan}
                                                    className={`flex items-center justify-between gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                                        data.plan_type === plan
                                                            ? 'border-yellow-400 bg-yellow-400/10'
                                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name="plan_type"
                                                            value={plan}
                                                            checked={data.plan_type === plan}
                                                            onChange={(e) => setData('plan_type', e.target.value)}
                                                            className="w-5 h-5 text-yellow-400"
                                                        />
                                                        <span className="font-semibold text-white capitalize">
                                                            {plan === 'academic_term' ? 'Academic Term' : plan.replace('_', '-')}
                                                        </span>
                                                    </div>
                                                    {price && data.plan_type === plan && (
                                                        <span className="text-base font-bold text-green-200">
                                                            {price.formatted}
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                            {loading && (
                                                <p className="text-white/70 text-sm flex items-center gap-2">
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Calculating price...
                                                </p>
                                            )}
                                            {errors.plan_type && (
                                                <p className="text-red-300 text-sm font-semibold mt-2">{errors.plan_type}</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-white mb-2">
                                                    Start Date <span className="text-red-300">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="block w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                                    required
                                                />
                                                {errors.start_date && (
                                                    <p className="text-red-300 text-sm font-semibold mt-2">{errors.start_date}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-semibold text-white mb-2">
                                                    Trip Type <span className="text-red-300">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        data.trip_type === 'one_way'
                                                            ? 'border-yellow-400 bg-yellow-400/10'
                                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="one_way"
                                                            checked={data.trip_type === 'one_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="w-4 h-4 text-yellow-400"
                                                        />
                                                        <span className="text-sm font-semibold text-white">One Way</span>
                                                    </label>
                                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        data.trip_type === 'two_way'
                                                            ? 'border-yellow-400 bg-yellow-400/10'
                                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="two_way"
                                                            checked={data.trip_type === 'two_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="w-4 h-4 text-yellow-400"
                                                        />
                                                        <span className="text-sm font-semibold text-white">Two Way</span>
                                                    </label>
                                                </div>
                                                {errors.trip_type && (
                                                    <p className="text-red-300 text-sm font-semibold mt-2">{errors.trip_type}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-brand-primary mb-4">Review Your Booking</h3>
                                        
                                        {/* Display general form errors */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-500/20 border border-red-400/50 p-4 rounded-lg mb-4">
                                                <p className="text-white font-bold mb-2">Please fix the following errors:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key} className="text-red-100 text-sm font-semibold">{message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="bg-white/10 border border-white/20 p-6 rounded-lg space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-white/60 mb-1">Student</p>
                                                <p className="text-base font-bold text-white">{students.find(s => s.id == data.student_id)?.name}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs font-semibold text-white/60 mb-1">Route</p>
                                                <p className="text-base font-bold text-white">{selectedRoute?.name}</p>
                                                {selectedRoute && (selectedRoute.pickup_time || selectedRoute.dropoff_time) && (
                                                    <div className="flex gap-4 text-xs text-white/70 mt-1">
                                                        {selectedRoute.pickup_time && (
                                                            <span>Pickup: <span className="font-semibold text-white">{formatTime(selectedRoute.pickup_time)}</span></span>
                                                        )}
                                                        {selectedRoute.dropoff_time && (
                                                            <span>Dropoff: <span className="font-semibold text-white">{formatTime(selectedRoute.dropoff_time)}</span></span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs font-semibold text-white/60 mb-1">Pickup Location</p>
                                                <p className="text-base font-bold text-white">
                                                    {data.pickup_point_id 
                                                        ? (() => {
                                                            const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                            return selectedPoint ? `${selectedPoint.name} - ${selectedPoint.address}` : data.pickup_address;
                                                          })()
                                                        : data.pickup_address || 'Not set'}
                                                </p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-white/60 mb-1">Plan</p>
                                                    <p className="text-base font-bold text-white">
                                                        {data.plan_type === 'academic_term' ? 'Academic Term' : data.plan_type.replace('_', '-').toUpperCase()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-white/60 mb-1">Trip Type</p>
                                                    <p className="text-base font-bold text-white">
                                                        {data.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <p className="text-xs font-semibold text-white/60 mb-1">Start Date</p>
                                                <p className="text-base font-bold text-white">{new Date(data.start_date).toLocaleDateString()}</p>
                                            </div>
                                            
                                            {price && (
                                                <div className="border-t border-white/20 pt-4 mt-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-white">Total:</span>
                                                        <span className="text-2xl font-extrabold text-green-200">
                                                            {price.formatted}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={step === 0 && !studentIdParam}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                                            step === 0 && !studentIdParam
                                                ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                                                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        {step === 1 && studentIdParam ? 'Back to Students' : 'Previous'}
                                    </button>
                                    {step < 4 ? (
                                        <GlassButton
                                            type="button"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </GlassButton>
                                    ) : (
                                        <GlassButton
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? 'Processing...' : 'Proceed to Payment'}
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

