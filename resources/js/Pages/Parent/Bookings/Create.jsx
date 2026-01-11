import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import axios from 'axios';

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
        pickup_latitude: '',
        pickup_longitude: '',
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
            const response = await axios.post('/parent/calculate-price', {
                route_id: data.route_id,
                plan_type: data.plan_type,
                trip_type: data.trip_type,
            });
            setPrice(response.data);
        } catch (error) {
            console.error('Error calculating price:', error);
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

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Book Transport Service</h2>

                            {/* Step Indicator */}
                            <div className="mb-8">
                                <div className="flex justify-between">
                                    {[0, 1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                    step >= s
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white/20 text-white/60 border border-white/30'
                                                }`}
                                            >
                                                {s + 1}
                                            </div>
                                            {s < 4 && (
                                                <div
                                                    className={`w-12 h-1 mx-1 ${
                                                        step > s ? 'bg-blue-500' : 'bg-white/20'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs font-bold text-white">
                                    <span>Student</span>
                                    <span>Route</span>
                                    <span>Pickup</span>
                                    <span>Plan</span>
                                    <span>Review</span>
                                </div>
                            </div>

                            {/* Show selected student info when coming from students list */}
                            {studentIdParam && data.student_id && students && students.length > 0 && (() => {
                                const selectedStudent = students.find(s => {
                                    return s.id == data.student_id || s.id === parseInt(data.student_id, 10) || String(s.id) === String(data.student_id);
                                });
                                return selectedStudent ? (
                                    <div className="mb-6 p-4 bg-blue-500/30 border border-blue-400/50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-blue-100 mb-1">Booking for:</p>
                                                <p className="text-lg font-bold text-white">
                                                    {selectedStudent.name}
                                                    {selectedStudent.school && (
                                                        <span className="text-base font-semibold text-white/90 ml-2">
                                                            - {selectedStudent.school.name}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <Link
                                                href="/parent/students"
                                                className="text-sm font-semibold text-blue-200 hover:text-blue-100 underline"
                                            >
                                                Change Student
                                            </Link>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            <form onSubmit={handleSubmit}>
                                {/* Step 0: Select Student */}
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Student</h3>
                                        {students.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-white text-lg font-semibold mb-4">No students registered yet.</p>
                                                <a
                                                    href="/parent/students/enroll"
                                                    className="text-blue-300 hover:text-blue-100 font-bold underline"
                                                >
                                                    Add a student first
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {students.map((student) => (
                                                    <label
                                                        key={student.id}
                                                        className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                            data.student_id == student.id
                                                                ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                                : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="student_id"
                                                            value={student.id}
                                                            checked={data.student_id == student.id}
                                                            onChange={(e) => setData('student_id', e.target.value)}
                                                            className="mr-3"
                                                        />
                                                        <span className="font-bold text-white">{student.name}</span>
                                                        {student.school && (
                                                            <span className="text-white/90 ml-2 font-semibold">- {student.school.name}</span>
                                                        )}
                                                    </label>
                                                ))}
                                                {errors.student_id && (
                                                    <p className="text-red-300 text-sm font-semibold">{errors.student_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 1: Select Route */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Select Route</h3>
                                            {data.student_id && (() => {
                                                const selectedStudent = students.find(s => s.id == data.student_id);
                                                return selectedStudent?.school ? (
                                                    <p className="text-sm text-white/80 font-semibold mb-4">
                                                        Showing routes for: <span className="text-blue-200 font-bold">{selectedStudent.school.name}</span>
                                                    </p>
                                                ) : null;
                                            })()}
                                        </div>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-white text-lg font-semibold mb-4">No routes available for the selected school.</p>
                                                <p className="text-white text-sm font-semibold">
                                                    No routes are currently configured for this student's school. Please contact the administrator.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {filteredRoutes.map((route) => (
                                                <label
                                                    key={route.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                        data.route_id == route.id
                                                            ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                            : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="route_id"
                                                        value={route.id}
                                                        checked={data.route_id == route.id}
                                                        onChange={(e) => setData('route_id', e.target.value)}
                                                        className="mr-3"
                                                    />
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <span className="font-bold text-white">{route.name}</span>
                                                            <p className="text-sm text-white/90 mt-1 font-semibold">
                                                                Vehicle: {route.vehicle?.make} {route.vehicle?.model} ({route.vehicle?.license_plate})
                                                            </p>
                                                            {(route.pickup_time || route.dropoff_time) && (
                                                                <div className="mt-2 space-y-1">
                                                                    {route.pickup_time && (
                                                                        <p className="text-xs text-white/90">
                                                                            Pickup: <span className="font-bold text-white">{formatTime(route.pickup_time)}</span>
                                                                        </p>
                                                                    )}
                                                                    {route.dropoff_time && (
                                                                        <p className="text-xs text-white/90">
                                                                            Dropoff: <span className="font-bold text-white">{formatTime(route.dropoff_time)}</span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <span className={`text-sm px-2 py-1 rounded border font-semibold ${
                                                                route.available_seats > 0
                                                                    ? 'bg-green-500/30 text-green-100 border-green-400/50'
                                                                    : 'bg-red-500/30 text-red-100 border-red-400/50'
                                                            }`}>
                                                                {route.available_seats} seats available
                                                            </span>
                                                        </div>
                                                    </div>
                                                </label>
                                                ))}
                                                {errors.route_id && (
                                                    <p className="text-red-300 text-sm font-semibold">{errors.route_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Enter Pickup Address */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Pickup and Dropoff Location</h3>
                                        
                                        {selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 && (
                                            <div className="mb-6">
                                                <label className="block text-base font-bold text-white mb-3">
                                                    Choose Pickup Option <span className="text-red-300">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                        pickupOption === 'pickup_point'
                                                            ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                            : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
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
                                                            className="mr-3"
                                                        />
                                                        <span className="font-bold text-white">Select from Route</span>
                                                    </label>
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                        pickupOption === 'custom'
                                                            ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                            : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
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
                                                            className="mr-3"
                                                        />
                                                        <span className="font-bold text-white">Custom Address</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {pickupOption === 'pickup_point' && selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 ? (
                                            <div className="space-y-4">
                                                <label className="block text-base font-bold text-white mb-2">
                                                    Select Pickup Point <span className="text-red-300">*</span>
                                                </label>
                                                <div className="space-y-2">
                                                    {selectedRoute.pickup_points.map((point) => (
                                                        <label
                                                            key={point.id}
                                                            className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                                data.pickup_point_id == point.id
                                                                    ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                                    : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
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
                                                                    setData('pickup_latitude', point.latitude || '');
                                                                    setData('pickup_longitude', point.longitude || '');
                                                                }}
                                                                className="mr-3"
                                                            />
                                                            <div className="flex-1">
                                                                <span className="font-bold text-white">{point.name}</span>
                                                                <p className="text-sm text-white/90 mt-1 font-semibold">{point.address}</p>
                                                                <div className="mt-2 space-y-1">
                                                                    {point.pickup_time && (
                                                                        <p className="text-xs text-white/90">
                                                                            Pickup: <span className="font-bold text-white">{formatTime(point.pickup_time)}</span>
                                                                        </p>
                                                                    )}
                                                                    {point.dropoff_time && (
                                                                        <p className="text-xs text-white/90">
                                                                            Dropoff: <span className="font-bold text-white">{formatTime(point.dropoff_time)}</span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.pickup_point_id && (
                                                    <p className="text-red-300 text-sm mt-1 font-semibold">{errors.pickup_point_id}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-base font-bold text-white mb-2">
                                                        Pickup Address <span className="text-red-300">*</span>
                                                    </label>
                                                    <textarea
                                                        value={data.pickup_address}
                                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                                        placeholder="Enter the full address where the student will be picked up"
                                                        rows={3}
                                                        className="block w-full glass-input text-white"
                                                        required={pickupOption === 'custom'}
                                                    />
                                                    {errors.pickup_address && (
                                                        <p className="text-red-300 text-sm mt-1 font-semibold">{errors.pickup_address}</p>
                                                    )}
                                                    <p className="text-sm text-white/80 mt-2 font-semibold">
                                                        This address will be used for daily pickup. Make sure it's accurate and complete.
                                                    </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-base font-bold text-white mb-2">
                                                            Latitude (Optional)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={data.pickup_latitude}
                                                            onChange={(e) => setData('pickup_latitude', e.target.value)}
                                                            placeholder="e.g., 40.7128"
                                                            className="block w-full glass-input text-white"
                                                        />
                                                        {errors.pickup_latitude && (
                                                            <p className="text-red-300 text-sm mt-1 font-semibold">{errors.pickup_latitude}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-base font-bold text-white mb-2">
                                                            Longitude (Optional)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={data.pickup_longitude}
                                                            onChange={(e) => setData('pickup_longitude', e.target.value)}
                                                            placeholder="e.g., -74.0060"
                                                            className="block w-full glass-input text-white"
                                                        />
                                                        {errors.pickup_longitude && (
                                                            <p className="text-red-300 text-sm mt-1 font-semibold">{errors.pickup_longitude}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-white/70 font-semibold">
                                                    Note: Latitude and longitude are optional. They can be used for GPS navigation if provided.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Select Plan */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Plan</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="space-y-4">
                                                    {['weekly', 'bi_weekly', 'monthly', 'academic_term', 'annual'].map((plan) => (
                                                        <label
                                                            key={plan}
                                                            className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                                data.plan_type === plan
                                                                    ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                                    : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="plan_type"
                                                                value={plan}
                                                                checked={data.plan_type === plan}
                                                                onChange={(e) => setData('plan_type', e.target.value)}
                                                                className="mr-3"
                                                            />
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-bold text-white capitalize">
                                                                    {plan === 'academic_term' ? 'Academic Term' : plan.replace('_', '-')}
                                                                </span>
                                                                {price && data.plan_type === plan && (
                                                                    <span className="text-lg font-bold text-green-200">
                                                                        {price.formatted}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                    {loading && <p className="text-white text-base font-semibold">Calculating price...</p>}
                                                    {errors.plan_type && (
                                                        <p className="text-red-300 text-sm font-semibold">{errors.plan_type}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-base font-bold text-white mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="block w-full glass-input text-white"
                                                    required
                                                />
                                                {errors.start_date && (
                                                    <p className="text-red-300 text-sm mt-1 font-semibold">{errors.start_date}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-base font-bold text-white mb-2">
                                                    Trip Type *
                                                </label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                        data.trip_type === 'one_way'
                                                            ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                            : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="one_way"
                                                            checked={data.trip_type === 'one_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="mr-3"
                                                        />
                                                        <span className="font-bold text-white">One Way</span>
                                                    </label>
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${
                                                        data.trip_type === 'two_way'
                                                            ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                            : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="trip_type"
                                                            value="two_way"
                                                            checked={data.trip_type === 'two_way'}
                                                            onChange={(e) => setData('trip_type', e.target.value)}
                                                            className="mr-3"
                                                        />
                                                        <span className="font-bold text-white">Two Way</span>
                                                    </label>
                                                </div>
                                                {errors.trip_type && (
                                                    <p className="text-red-300 text-sm mt-1 font-semibold">{errors.trip_type}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Review Your Booking</h3>
                                        
                                        {/* Display general form errors */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-500/30 border border-red-400/50 p-4 rounded-lg mb-4">
                                                <p className="text-white font-bold mb-2">Please fix the following errors:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key} className="text-red-100 text-sm font-semibold">{message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="bg-white/10 backdrop-blur-sm border border-white/30 p-6 rounded-lg space-y-4">
                                            <div>
                                                <span className="font-bold text-white">Student:</span>{' '}
                                                <span className="text-white/90 font-semibold">{students.find(s => s.id == data.student_id)?.name}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Route:</span>{' '}
                                                <span className="text-white/90 font-semibold">{selectedRoute?.name}</span>
                                                {selectedRoute && (selectedRoute.pickup_time || selectedRoute.dropoff_time) && (
                                                    <div className="mt-1 ml-4 space-y-0.5">
                                                        {selectedRoute.pickup_time && (
                                                            <p className="text-xs text-white/90">
                                                                Pickup: <span className="font-bold text-white">{formatTime(selectedRoute.pickup_time)}</span>
                                                            </p>
                                                        )}
                                                        {selectedRoute.dropoff_time && (
                                                            <p className="text-xs text-white/90">
                                                                Dropoff: <span className="font-bold text-white">{formatTime(selectedRoute.dropoff_time)}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Pickup Location:</span>{' '}
                                                <span className="text-white/90 font-semibold">
                                                    {data.pickup_point_id 
                                                        ? (() => {
                                                            const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                            return selectedPoint ? `${selectedPoint.name} - ${selectedPoint.address}` : data.pickup_address;
                                                          })()
                                                        : data.pickup_address || 'Not set'}
                                                </span>
                                                {data.pickup_point_id && (() => {
                                                    const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                    return selectedPoint && (selectedPoint.pickup_time || selectedPoint.dropoff_time) ? (
                                                        <div className="mt-1 ml-4 space-y-0.5">
                                                            {selectedPoint.pickup_time && (
                                                                <p className="text-xs text-white/90">
                                                                    Pickup: <span className="font-bold text-white">{formatTime(selectedPoint.pickup_time)}</span>
                                                                </p>
                                                            )}
                                                            {selectedPoint.dropoff_time && (
                                                                <p className="text-xs text-white/90">
                                                                    Dropoff: <span className="font-bold text-white">{formatTime(selectedPoint.dropoff_time)}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : null;
                                                })()}
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Plan:</span>{' '}
                                                <span className="text-white/90 font-semibold">
                                                    {data.plan_type === 'academic_term' ? 'Academic Term' : data.plan_type.replace('_', '-').toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Trip Type:</span>{' '}
                                                <span className="text-white/90 font-semibold">
                                                    {data.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Start Date:</span>{' '}
                                                <span className="text-white/90 font-semibold">{new Date(data.start_date).toLocaleDateString()}</span>
                                            </div>
                                            {price && (
                                                <div className="border-t border-white/30 pt-4">
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
                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={step === 0 && !studentIdParam}
                                        className={`px-4 py-2 rounded font-bold transition ${
                                            step === 0 && !studentIdParam
                                                ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                                                : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
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

