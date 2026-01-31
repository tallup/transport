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

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                            Book Transport Service
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-brand-primary/70">
                            Complete the steps below to book transport for your student
                        </p>
                    </div>

                    <GlassCard className="overflow-hidden">
                        <div className="p-6 sm:p-8">
                            {/* Step Indicator - Modern Design */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between relative">
                                    {[0, 1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base border-2 shadow-lg transition-all duration-300 ${
                                                        step > s
                                                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-400 text-brand-primary scale-100'
                                                            : step === s
                                                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-500 text-brand-primary scale-110 ring-4 ring-yellow-400/30'
                                                                : 'bg-white/10 border-white/30 text-white/60 scale-100'
                                                    }`}
                                                >
                                                    {s + 1}
                                                </div>
                                                <span className={`mt-2 text-xs font-bold transition-colors ${
                                                    step >= s ? 'text-brand-primary' : 'text-white/50'
                                                }`}>
                                                    {['Student', 'Route', 'Pickup', 'Plan', 'Review'][s]}
                                                </span>
                                            </div>
                                            {s < 4 && (
                                                <div
                                                    className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                                                        step > s 
                                                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                                                            : 'bg-white/20'
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
                                    <div className="mb-8 p-5 bg-gradient-to-r from-blue-500/20 to-blue-500/10 border-2 border-blue-400/30 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide mb-1">Booking for:</p>
                                                    <p className="text-lg font-extrabold text-white">
                                                        {selectedStudent.name}
                                                        {selectedStudent.school && (
                                                            <span className="text-base font-semibold text-white/90 ml-2">
                                                                - {selectedStudent.school.name}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/parent/students"
                                                className="px-4 py-2 text-sm font-bold text-blue-200 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/50 transition"
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
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-brand-primary">Select Student</h3>
                                        </div>
                                        {students.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-white text-lg font-bold mb-4">No students registered yet.</p>
                                                <Link
                                                    href="/parent/students/enroll"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                                                >
                                                    Add a student first
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {students.map((student) => (
                                                    <label
                                                        key={student.id}
                                                        className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                            data.student_id == student.id
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="student_id"
                                                            value={student.id}
                                                            checked={data.student_id == student.id}
                                                            onChange={(e) => setData('student_id', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-start gap-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                data.student_id == student.id
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                    : 'bg-white/10'
                                                            }`}>
                                                                <svg className={`w-6 h-6 ${data.student_id == student.id ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-lg font-extrabold text-white mb-1">{student.name}</p>
                                                                {student.school && (
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                                            {student.school.name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {data.student_id == student.id && (
                                                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.student_id && (
                                            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                <p className="text-red-200 text-sm font-bold">{errors.student_id}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 1: Select Route */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-extrabold text-brand-primary">Select Route</h3>
                                                {data.student_id && (() => {
                                                    const selectedStudent = students.find(s => s.id == data.student_id);
                                                    return selectedStudent?.school ? (
                                                        <p className="text-sm text-brand-primary/70 font-semibold mt-1">
                                                            Showing routes for: <span className="text-brand-primary font-bold">{selectedStudent.school.name}</span>
                                                        </p>
                                                    ) : null;
                                                })()}
                                            </div>
                                        </div>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <p className="text-white text-lg font-bold mb-2">No routes available</p>
                                                <p className="text-white/80 text-sm font-semibold">
                                                    No routes are currently configured for this student's school.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {filteredRoutes.map((route) => (
                                                    <label
                                                        key={route.id}
                                                        className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                                                            data.route_id == route.id
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="route_id"
                                                            value={route.id}
                                                            checked={data.route_id == route.id}
                                                            onChange={(e) => setData('route_id', e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-start gap-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                data.route_id == route.id
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                    : 'bg-white/10'
                                                            }`}>
                                                                <svg className={`w-6 h-6 ${data.route_id == route.id ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                                    <div>
                                                                        <p className="text-lg font-extrabold text-white mb-1">{route.name}</p>
                                                                        {route.vehicle && (
                                                                            <p className="text-sm text-white/80 font-semibold">
                                                                                {route.vehicle.make} {route.vehicle.model} • {route.vehicle.license_plate}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex-shrink-0 ${
                                                                        route.available_seats > 0
                                                                            ? 'bg-green-500/30 text-green-100 border-green-400/50'
                                                                            : 'bg-red-500/30 text-red-100 border-red-400/50'
                                                                    }`}>
                                                                        {route.available_seats} seats
                                                                    </span>
                                                                </div>
                                                                {(route.pickup_time || route.dropoff_time) && (
                                                                    <div className="flex flex-wrap gap-4 mt-3">
                                                                        {route.pickup_time && (
                                                                            <div className="flex items-center gap-2">
                                                                                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                <span className="text-xs font-semibold text-white/90">
                                                                                    Pickup: <span className="font-bold text-green-200">{formatTime(route.pickup_time)}</span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {route.dropoff_time && (
                                                                            <div className="flex items-center gap-2">
                                                                                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                <span className="text-xs font-semibold text-white/90">
                                                                                    Dropoff: <span className="font-bold text-blue-200">{formatTime(route.dropoff_time)}</span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {data.route_id == route.id && (
                                                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.route_id && (
                                            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                <p className="text-red-200 text-sm font-bold">{errors.route_id}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Enter Pickup Address */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-brand-primary">Pickup and Dropoff Location</h3>
                                        </div>
                                        
                                        {selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 && (
                                            <div className="mb-6">
                                                <label className="block text-base font-bold text-brand-primary mb-3">
                                                    Choose Pickup Option <span className="text-red-300">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <label className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                        pickupOption === 'pickup_point'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                            : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
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
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                pickupOption === 'pickup_point'
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                    : 'bg-white/10'
                                                            }`}>
                                                                <svg className={`w-5 h-5 ${pickupOption === 'pickup_point' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                </svg>
                                                            </div>
                                                            <span className="font-bold text-white">Select from Route</span>
                                                            {pickupOption === 'pickup_point' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-3 h-3 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                    <label className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                        pickupOption === 'custom'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                            : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
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
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                pickupOption === 'custom'
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                    : 'bg-white/10'
                                                            }`}>
                                                                <svg className={`w-5 h-5 ${pickupOption === 'custom' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </div>
                                                            <span className="font-bold text-white">Custom Address</span>
                                                            {pickupOption === 'custom' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-3 h-3 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {pickupOption === 'pickup_point' && selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 ? (
                                            <div className="space-y-4">
                                                <label className="block text-base font-bold text-brand-primary mb-4">
                                                    Select Pickup Point <span className="text-red-300">*</span>
                                                </label>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {selectedRoute.pickup_points.map((point) => (
                                                        <label
                                                            key={point.id}
                                                            className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                                                                data.pickup_point_id == point.id
                                                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                    : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
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
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-start gap-4">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                    data.pickup_point_id == point.id
                                                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                        : 'bg-white/10'
                                                                }`}>
                                                                    <svg className={`w-6 h-6 ${data.pickup_point_id == point.id ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-lg font-extrabold text-white mb-1">{point.name}</p>
                                                                    <p className="text-sm text-white/80 font-semibold mb-3">{point.address}</p>
                                                                    {(point.pickup_time || point.dropoff_time) && (
                                                                        <div className="flex flex-wrap gap-4">
                                                                            {point.pickup_time && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                    <span className="text-xs font-semibold text-white/90">
                                                                                        Pickup: <span className="font-bold text-green-200">{formatTime(point.pickup_time)}</span>
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {point.dropoff_time && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                    <span className="text-xs font-semibold text-white/90">
                                                                                        Dropoff: <span className="font-bold text-blue-200">{formatTime(point.dropoff_time)}</span>
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {data.pickup_point_id == point.id && (
                                                                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.pickup_point_id && (
                                                    <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                        <p className="text-red-200 text-sm font-bold">{errors.pickup_point_id}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-base font-bold text-brand-primary mb-3">
                                                        Pickup Address <span className="text-red-300">*</span>
                                                    </label>
                                                    <textarea
                                                        value={data.pickup_address}
                                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                                        placeholder="Enter the full address where the student will be picked up"
                                                        rows={4}
                                                        className="block w-full glass-input text-white p-4 rounded-xl border-2 border-white/20 bg-white/10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                                                        required={pickupOption === 'custom'}
                                                    />
                                                    {errors.pickup_address && (
                                                        <div className="mt-2 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                            <p className="text-red-200 text-sm font-bold">{errors.pickup_address}</p>
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-brand-primary/70 mt-3 font-semibold">
                                                        This address will be used for daily pickup. Make sure it's accurate and complete.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Select Plan */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-brand-primary">Select Plan & Options</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-base font-bold text-brand-primary mb-4">
                                                    Plan Type <span className="text-red-300">*</span>
                                                </label>
                                                <div className="space-y-3">
                                                    {['weekly', 'monthly', 'academic_term', 'annual'].map((plan) => (
                                                        <label
                                                            key={plan}
                                                            className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                                data.plan_type === plan
                                                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                    : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="plan_type"
                                                                value={plan}
                                                                checked={data.plan_type === plan}
                                                                onChange={(e) => setData('plan_type', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                        data.plan_type === plan
                                                                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                            : 'bg-white/10'
                                                                    }`}>
                                                                        <svg className={`w-5 h-5 ${data.plan_type === plan ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="font-bold text-white capitalize">
                                                                        {plan === 'academic_term' ? 'Academic Term' : plan.replace('_', '-')}
                                                                    </span>
                                                                </div>
                                                                {price && data.plan_type === plan && (
                                                                    <span className="text-lg font-extrabold text-green-200">
                                                                        {price.formatted}
                                                                    </span>
                                                                )}
                                                                {data.plan_type === plan && (
                                                                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                    {loading && (
                                                        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                                                            <p className="text-white text-base font-semibold flex items-center gap-2">
                                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Calculating price...
                                                            </p>
                                                        </div>
                                                    )}
                                                    {errors.plan_type && (
                                                        <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                            <p className="text-red-200 text-sm font-bold">{errors.plan_type}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-base font-bold text-brand-primary mb-3">
                                                        Start Date <span className="text-red-300">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="block w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                                                        required
                                                    />
                                                    {errors.start_date && (
                                                        <div className="mt-2 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                            <p className="text-red-200 text-sm font-bold">{errors.start_date}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-base font-bold text-brand-primary mb-3">
                                                        Trip Type <span className="text-red-300">*</span>
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <label className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                            data.trip_type === 'one_way'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_type"
                                                                value="one_way"
                                                                checked={data.trip_type === 'one_way'}
                                                                onChange={(e) => setData('trip_type', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                    data.trip_type === 'one_way'
                                                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                        : 'bg-white/10'
                                                                }`}>
                                                                    <svg className={`w-5 h-5 ${data.trip_type === 'one_way' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                    </svg>
                                                                </div>
                                                                <span className="font-bold text-white">One Way</span>
                                                                {data.trip_type === 'one_way' && (
                                                                    <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                        <label className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                            data.trip_type === 'two_way'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 backdrop-blur-sm ring-2 ring-yellow-400/30 shadow-lg'
                                                                : 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-yellow-400/40'
                                                        }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_type"
                                                                value="two_way"
                                                                checked={data.trip_type === 'two_way'}
                                                                onChange={(e) => setData('trip_type', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                    data.trip_type === 'two_way'
                                                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                                        : 'bg-white/10'
                                                                }`}>
                                                                    <svg className={`w-5 h-5 ${data.trip_type === 'two_way' ? '!text-brand-primary' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                                    </svg>
                                                                </div>
                                                                <span className="font-bold text-white">Two Way</span>
                                                                {data.trip_type === 'two_way' && (
                                                                    <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                    {errors.trip_type && (
                                                        <div className="mt-2 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
                                                            <p className="text-red-200 text-sm font-bold">{errors.trip_type}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-brand-primary">Review Your Booking</h3>
                                        </div>
                                        
                                        {/* Display general form errors */}
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
                                        
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-white/30 p-6 rounded-xl space-y-5">
                                            {/* Student */}
                                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Student</p>
                                                    <p className="text-base font-extrabold text-white">{students.find(s => s.id == data.student_id)?.name}</p>
                                                </div>
                                            </div>

                                            {/* Route */}
                                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Route</p>
                                                    <p className="text-base font-extrabold text-white mb-2">{selectedRoute?.name}</p>
                                                    {selectedRoute && (selectedRoute.pickup_time || selectedRoute.dropoff_time) && (
                                                        <div className="flex flex-wrap gap-3 mt-2">
                                                            {selectedRoute.pickup_time && (
                                                                <span className="text-xs font-semibold text-white/80">
                                                                    Pickup: <span className="font-bold text-green-200">{formatTime(selectedRoute.pickup_time)}</span>
                                                                </span>
                                                            )}
                                                            {selectedRoute.dropoff_time && (
                                                                <span className="text-xs font-semibold text-white/80">
                                                                    Dropoff: <span className="font-bold text-blue-200">{formatTime(selectedRoute.dropoff_time)}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pickup Location */}
                                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Pickup Location</p>
                                                    <p className="text-base font-extrabold text-white">
                                                        {data.pickup_point_id 
                                                            ? (() => {
                                                                const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                                return selectedPoint ? `${selectedPoint.name} - ${selectedPoint.address}` : data.pickup_address;
                                                              })()
                                                            : data.pickup_address || 'Not set'}
                                                    </p>
                                                    {data.pickup_point_id && (() => {
                                                        const selectedPoint = selectedRoute?.pickup_points?.find(p => p.id == data.pickup_point_id);
                                                        return selectedPoint && (selectedPoint.pickup_time || selectedPoint.dropoff_time) ? (
                                                            <div className="flex flex-wrap gap-3 mt-2">
                                                                {selectedPoint.pickup_time && (
                                                                    <span className="text-xs font-semibold text-white/80">
                                                                        Pickup: <span className="font-bold text-green-200">{formatTime(selectedPoint.pickup_time)}</span>
                                                                    </span>
                                                                )}
                                                                {selectedPoint.dropoff_time && (
                                                                    <span className="text-xs font-semibold text-white/80">
                                                                        Dropoff: <span className="font-bold text-blue-200">{formatTime(selectedPoint.dropoff_time)}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Plan & Trip Type */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Plan</p>
                                                        <p className="text-base font-extrabold text-white">
                                                            {data.plan_type === 'academic_term' ? 'Academic Term' : data.plan_type.replace('_', '-').toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                                            </div>

                                            {/* Start Date */}
                                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide mb-1">Start Date</p>
                                                    <p className="text-base font-extrabold text-white">{new Date(data.start_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Total Price */}
                                            {price && (
                                                <div className="border-t-2 border-white/30 pt-5 mt-5">
                                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border-2 border-green-400/30">
                                                        <span className="text-xl font-extrabold text-white">Total Amount:</span>
                                                        <span className="text-3xl font-extrabold text-green-200">
                                                            {price.formatted}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/20">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={step === 0 && !studentIdParam}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                            step === 0 && !studentIdParam
                                                ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                                                : 'bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:scale-105'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {step === 1 && studentIdParam ? 'Back to Students' : 'Previous'}
                                    </button>
                                    {step < 4 ? (
                                        <GlassButton
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
                                            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Proceed to Payment
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

