import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { toast } from 'sonner';
const axios = window.axios;

export default function CreateBooking({ students, routes, recentPickups = [] }) {
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
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState(routes);
    const [pickupOption, setPickupOption] = useState('custom'); // 'pickup_point' or 'custom'

    const { data, setData, post, processing } = useForm({
        school_id: '',
        student_id: '',
        student_ids: [],
        route_id: '',
        pickup_point_id: '',
        pickup_address: '',
        plan_type: '',
        trip_type: '',
        trip_direction: 'both',
        start_date: new Date().toISOString().split('T')[0],
    });
    const page = usePage();
    const errors = page.props.errors || {};

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

    // Clear step-0 validation message when user selects a student
    useEffect(() => {
        if (selectedStudentIds.length > 0) setStudentStepError(false);
    }, [selectedStudentIds]);

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

    // When Two way is selected, trip direction is always both. When One way is selected, require pickup or dropoff.
    useEffect(() => {
        if (data.trip_type === 'two_way') {
            setData('trip_direction', 'both');
        } else if (data.trip_type === 'one_way' && data.trip_direction === 'both') {
            setData('trip_direction', 'pickup_only');
        }
    }, [data.trip_type]);

    // Calculate price when route, plan type, trip type, or number of students changes
    useEffect(() => {
        if (data.route_id && data.plan_type) {
            calculatePrice();
        } else {
            setPrice(null);
        }
    }, [data.route_id, data.plan_type, data.trip_type, selectedStudentIds.length]);

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
        setLoading(true);
        try {
            const studentCount = Math.max(1, selectedStudentIds.length);
            const response = await axios.get('/parent/calculate-price', {
                params: {
                    route_id: data.route_id,
                    plan_type: data.plan_type,
                    trip_type: data.trip_type || 'two_way',
                    for_date: data.start_date || undefined,
                    student_count: studentCount,
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
        if (selectedStudentIds.length === 0) {
            toast.error('Please select at least one student.');
            setStudentStepError(true);
            return;
        }
        
        const hasPickupLocation = pickupOption === 'pickup_point' 
            ? data.pickup_point_id 
            : data.pickup_address;
        
        if (!data.route_id || !hasPickupLocation || !data.plan_type || !data.start_date) {
            toast.error('Please complete all required fields before proceeding to payment.');
            return;
        }
        
        // Send payload with current selection so backend receives student_ids (setData is async and post would otherwise send stale data)
        const payload = {
            ...data,
            student_ids: selectedStudentIds,
            student_id: data.student_id || (selectedStudentIds.length > 0 ? selectedStudentIds[0] : ''),
        };
        setSubmitting(true);
        router.post('/parent/bookings', payload, {
            preserveScroll: false,
            onError: (errors) => {
                console.log('Form errors:', errors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const [studentStepError, setStudentStepError] = useState(false);

    const nextStep = () => {
        // Step 0: Student (only if not pre-selected)
        if (step === 0 && selectedStudentIds.length === 0) {
            setStudentStepError(true);
            toast.error('Please select at least one student first.');
            return;
        }
        setStudentStepError(false);
        // Step 1: Route
        if (step === 1) {
            if (!data.route_id) {
                toast.error('Please select a route.');
                return;
            }
            
            // Immediate Capacity Check
            const available = (availableSeats && typeof availableSeats === 'object') 
                ? availableSeats.available 
                : (selectedRoute?.available_seats);
                
            if (available !== undefined && available !== null && available < selectedStudentIds.length) {
                toast.error(`Not enough available seats on this route for all selected students. (Available: ${available}, Needed: ${selectedStudentIds.length})`);
                return;
            }
        }
        // Step 2: Pickup
        if (step === 2) {
            if (pickupOption === 'pickup_point' && !data.pickup_point_id) {
                toast.error('Please select a pickup point.');
                return;
            }
            if (pickupOption === 'custom' && !data.pickup_address) {
                toast.error('Please enter a pickup address.');
                return;
            }
        }
        // Step 3: Plan, trip type, and (if one way) service
        if (step === 3) {
            if (!data.plan_type) {
                toast.error('Please select a plan.');
                return;
            }
            if (!data.trip_type || !['one_way', 'two_way'].includes(data.trip_type)) {
                toast.error('Please select a trip type (One Way or Two Way).');
                return;
            }
            if (data.trip_type === 'one_way' && !['pickup_only', 'dropoff_only'].includes(data.trip_direction)) {
                toast.error('Please select pickup only or dropoff only for one way trip.');
                return;
            }
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
                        setSelectedStudentIds([studentIdInt]);
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

    // Show loading only when students prop hasn't been received yet (e.g. during Inertia visit)
    if (students === undefined || students === null) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Book Transport" />
                <div className="py-10">
                    <div className="container">
                        <GlassCard className="parent-form-shell overflow-hidden">
                            <div className="p-6">
                                <p className="text-center text-slate-600">Loading...</p>
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

            <div className="py-10">
                <div className="container">
                    {/* Header Section */}
                    <div className="mb-10 text-center">
                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Book Transport Service</h1>
                        <p className="text-base font-medium text-slate-600">Complete your booking in a few simple steps</p>
                    </div>

                    <GlassCard className="parent-form-shell overflow-hidden">
                        <div className="p-8 sm:p-10">
                            {/* Step Indicator - Modern Design */}
                            <div className="mb-12">
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line Background */}
                                    <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full -z-0"></div>
                                    
                                    {[0, 1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center flex-1 relative z-10">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="relative">
                                                    {/* Progress Line Fill */}
                                                    {s < 4 && step > s && (
                                                        <div className="absolute top-4 left-1/2 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full -z-0" style={{ width: 'calc(100% + 1rem)' }}></div>
                                                    )}
                                                    
                                                    <div
                                                        className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                                        step > s
                                                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-lg scale-110'
                                                                : step === s
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-xl scale-125 ring-4 ring-yellow-400/40'
                                                                    : 'border-2 border-slate-300 bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                        {step > s ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-base">{s + 1}</span>
                                            )}
                                        </div>
                                </div>
                                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                                    step >= s ? 'text-slate-700' : 'text-slate-400'
                                                }`}>
                                                    {['Student', 'Route', 'Pickup', 'Plan', 'Review'][s]}
                                                </span>
                                            </div>
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
                                    <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 shadow-md">
                                                    <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            <div>
                                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Booking for:</p>
                                                    <p className="text-lg font-extrabold text-slate-900">
                                                    {selectedStudent.name}
                                                    {selectedStudent.school && (
                                                        <span className="text-base font-semibold text-slate-700 ml-2">
                                                            - {selectedStudent.school.name}
                                                        </span>
                                                    )}
                                                </p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/parent/students"
                                                className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
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
                                        <div>
                                            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Select Student(s)</h3>
                                            <p className="text-sm text-slate-500">Choose one or more students you want to book transport for</p>
                                        </div>
                                        {students.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
                                                    <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <p className="mb-4 text-lg font-bold text-slate-900">No students registered yet.</p>
                                                <Link
                                                    href="/parent/students/enroll"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-brand-secondary hover:shadow-xl"
                                                >
                                                    Add a student first
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {students.map((student) => {
                                                    const isSelected = selectedStudentIds.includes(student.id);
                                                    return (
                                                        <label
                                                            key={student.id}
                                                            className={`group relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] max-w-xs mx-auto md:mx-0 ${
                                                                isSelected
                                                                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 shadow-lg ring-2 ring-yellow-400/30'
                                                                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                const alreadySelected = selectedStudentIds.includes(student.id);
                                                                let next;
                                                                if (alreadySelected) {
                                                                    next = selectedStudentIds.filter(id => id !== student.id);
                                                                } else {
                                                                    next = [...selectedStudentIds, student.id];
                                                                }
                                                                setSelectedStudentIds(next);
                                                                if (next.length > 0) {
                                                                    // Use the first selected student as the primary for school/route logic
                                                                    setData('student_id', next[0]);
                                                                } else {
                                                                    setData('student_id', '');
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="student_ids[]"
                                                                value={student.id}
                                                                checked={isSelected}
                                                                onChange={() => {}}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                                                isSelected
                                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md'
                                                                    : 'bg-slate-100 group-hover:bg-slate-200'
                                                            }`}>
                                                                <svg className={`w-5 h-5 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                            <div className="flex-1 min-w-0">
                                                            <p className="mb-1 truncate text-base font-extrabold text-slate-900">{student.name}</p>
                                                                {student.school && (
                                                                <div className="flex items-center gap-2 mt-1.5">
                                                                    <span className="truncate rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                                                        {student.school.name}
                                                                    </span>
                                                                </div>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                                                    <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                                )}
                                        {(studentStepError || errors.student_id) && (
                                                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                                                <p className="text-sm font-semibold text-rose-700">{errors.student_id || 'Please select a student before continuing.'}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 1: Select Route */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h3 className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl">Choose your route</h3>
                                                {data.student_id && (() => {
                                                    const selectedStudent = students.find(s => s.id == data.student_id);
                                                    return selectedStudent?.school ? (
                                                        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            {selectedStudent.school.name}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                        </div>

                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <p className="mb-2 text-lg font-bold text-slate-900">No routes available</p>
                                                <p className="text-sm text-slate-500">
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
                                                                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg'
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
                                                            {/* Left accent bar */}
                                                            {isSelected && (
                                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                                                            )}
                                                            <div className="flex-1 flex flex-col sm:flex-row gap-4 p-5 pl-6 min-w-0">
                                                                {/* Route icon */}
                                                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                                                    isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-slate-100 group-hover:bg-slate-200'
                                                                }`}>
                                                                    <svg className={`w-7 h-7 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="mb-1 pr-8 text-lg font-extrabold text-slate-900">{route.name}</p>
                                                                    {route.vehicle && (
                                                                        <p className="mb-3 text-sm font-medium text-slate-500">
                                                                            {route.vehicle.make} {route.vehicle.model} · {route.vehicle.license_plate}
                                                                        </p>
                                                                    )}
                                                                    {/* Schedule strip */}
                                                                    {(route.pickup_time || route.dropoff_time) && (
                                                                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                                            {route.pickup_time && (
                                                                                <span className="flex items-center gap-1.5 text-sm">
                                                                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                                                    <span className="font-medium text-slate-600">Pickup</span>
                                                                                    <span className="text-amber-200 font-bold">{formatTime(route.pickup_time)}</span>
                                                                                </span>
                                                                            )}
                                                                            {(route.pickup_time && route.dropoff_time) && (
                                                                                <svg className="w-4 h-4 flex-shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                                </svg>
                                                                            )}
                                                                            {route.dropoff_time && (
                                                                                <span className="flex items-center gap-1.5 text-sm">
                                                                                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                                                                                    <span className="font-medium text-slate-600">Dropoff</span>
                                                                                    <span className="text-blue-200 font-bold">{formatTime(route.dropoff_time)}</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {/* Seats badge */}
                                                                <div className="flex-shrink-0 self-start sm:self-center">
                                                                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border ${
                                                                        route.available_seats > 0
                                                                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                                            : 'border-rose-200 bg-rose-50 text-rose-700'
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
                                                                    <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {((data.route_id && ((availableSeats && typeof availableSeats === 'object' ? availableSeats.available : selectedRoute?.available_seats) < selectedStudentIds.length)) || errors.route_id) && (
                                            <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl animate-pulse">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <p className="text-red-200 text-sm font-bold">
                                                        {errors.route_id || 'Not enough available seats on this route for all selected students.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Enter Pickup Address */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl">Where should we pick up?</h3>
                                            <p className="text-sm text-slate-500">Choose a stop from your route or enter a custom address</p>
                                        </div>

                                        {recentPickups && recentPickups.length > 0 && (
                                            <div className="mb-2">
                                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Quick select from recent</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {recentPickups.map((pickup) => (
                                                        <button
                                                            key={pickup.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setPickupOption('pickup_point');
                                                                setData({
                                                                    ...data,
                                                                    route_id: String(pickup.route_id),
                                                                    pickup_point_id: String(pickup.pickup_point_id),
                                                                    pickup_address: pickup.pickup_point?.address || '',
                                                                });
                                                            }}
                                                            className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-yellow-400 hover:shadow-md transition-all text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 leading-none">{pickup.pickup_point?.name || 'Point'}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">{pickup.route?.name || 'Route'}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedRoute && selectedRoute.pickup_points && selectedRoute.pickup_points.length > 0 && (
                                            <div>
                                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pickup type</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        pickupOption === 'pickup_point'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${pickupOption === 'pickup_point' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                            <svg className={`w-6 h-6 ${pickupOption === 'pickup_point' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-extrabold text-slate-900">From route stop</p>
                                                            <p className="mt-0.5 text-xs text-slate-500">Choose a scheduled pickup point</p>
                                                        </div>
                                                        {pickupOption === 'pickup_point' && (
                                                            <div className="ml-auto w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow">
                                                                <svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                    <label className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        pickupOption === 'custom'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${pickupOption === 'custom' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                            <svg className={`w-6 h-6 ${pickupOption === 'custom' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-extrabold text-slate-900">Custom address</p>
                                                            <p className="mt-0.5 text-xs text-slate-500">Enter your own pickup location</p>
                                                        </div>
                                                        {pickupOption === 'custom' && (
                                                            <div className="ml-auto w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow">
                                                                <svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Select a stop</p>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {selectedRoute.pickup_points.map((point) => {
                                                        const isSelected = data.pickup_point_id == point.id;
                                                        return (
                                                            <label
                                                                key={point.id}
                                                                className={`group relative flex cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl border-2 ${
                                                                    isSelected
                                                                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 via-yellow-500/15 to-transparent shadow-xl ring-2 ring-yellow-400/40 scale-[1.01]'
                                                                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg'
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
                                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                                        <svg className={`w-6 h-6 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 pr-8">
                                                                        <p className="mb-1 text-base font-extrabold text-slate-900">{point.name}</p>
                                                                        <p className="text-sm text-slate-500">{point.address}</p>
                                                                        {(point.pickup_time || point.dropoff_time) && (
                                                                            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                                                                                {point.pickup_time && (
                                                                                    <span className="flex items-center gap-1 text-xs">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                                                        <span className="text-amber-200 font-bold">{formatTime(point.pickup_time)}</span>
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
                                                                        <svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900">Pickup address</p>
                                                        <p className="text-xs text-slate-500">Full street address for daily pickup</p>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <textarea
                                                        value={data.pickup_address}
                                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                                        placeholder="e.g. 123 Main St, City, State ZIP"
                                                        rows={4}
                                                        className="form-control min-h-28"
                                                        required={pickupOption === 'custom'}
                                                    />
                                                    <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        This address will be used for daily pickup.
                                                    </p>
                                                    {errors.pickup_address && (
                                                        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                                                            <p className="text-sm font-semibold text-rose-700">{errors.pickup_address}</p>
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
                                            <h3 className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl">Choose your plan</h3>
                                            <p className="text-sm text-slate-500">Select duration, start date, and trip type</p>
                                        </div>

                                        <div>
                                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Plan duration</p>
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
                                                                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg'
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
                                                                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                                    <svg className={`w-5 h-5 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-base font-extrabold text-slate-900">{label}</p>
                                                                <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                                                                {price && isSelected && (
                                                                    <>
                                                                        <p className="mt-3 text-lg font-extrabold text-amber-200">
                                                                            {selectedStudentIds.length > 1 && price.total_formatted ? (
                                                                                <>
                                                                                    <span className="block">{price.total_formatted}</span>
                                                                                    <span className="mt-1 block text-sm font-semibold text-slate-500">
                                                                                        {selectedStudentIds.length} {selectedStudentIds.length === 1 ? 'child' : 'children'}
                                                                                        {price.per_booking_formatted && ` × ${price.per_booking_formatted} each`}
                                                                                    </span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {price.per_booking_formatted ?? price.formatted}
                                                                                    {selectedStudentIds.length > 1 && price.per_booking_formatted && (
                                                                                        <span className="mt-1 block text-sm font-semibold text-slate-500">per child</span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </p>
                                                                        {price.discount_label && (
                                                                            <p className="mt-1 text-sm font-semibold text-yellow-300">
                                                                                Discount applied ({price.discount_label})
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                                                    <svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {loading && (
                                                <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <svg className="animate-spin w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-slate-700">Calculating price...</p>
                                                </div>
                                            )}
                                            {errors.plan_type && (
                                                <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
                                                    <p className="text-red-200 text-sm font-bold">{errors.plan_type}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-slate-900">Start date</p>
                                                        <p className="text-xs text-slate-500">When transport begins</p>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="form-control"
                                                        required
                                                    />
                                                    {errors.start_date && (
                                                        <p className="mt-2 text-red-300 text-sm font-bold">{errors.start_date}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Trip type</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        data.trip_type === 'one_way'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_type === 'one_way' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                            <svg className={`w-4 h-4 ${data.trip_type === 'one_way' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-extrabold text-slate-900">One way</p>
                                                            <p className="text-xs text-slate-500">AM or PM only</p>
                                                        </div>
                                                        {data.trip_type === 'one_way' && (
                                                            <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                    <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                        data.trip_type === 'two_way'
                                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_type === 'two_way' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                            <svg className={`w-4 h-4 ${data.trip_type === 'two_way' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-extrabold text-slate-900">Two way</p>
                                                            <p className="text-xs text-slate-500">AM & PM</p>
                                                        </div>
                                                        {data.trip_type === 'two_way' && (
                                                            <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                                            {/* Service (pickup or dropoff): only for One way. Two way = both by default. */}
                                            {data.trip_type === 'one_way' && (
                                                <div>
                                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Service</p>
                                                    <p className="mb-3 text-xs text-slate-500">One way: choose pickup only or dropoff only</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                            data.trip_direction === 'pickup_only'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_direction === 'pickup_only' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                                <svg className={`w-4 h-4 ${data.trip_direction === 'pickup_only' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-extrabold text-slate-900">Pickup only</p>
                                                                <p className="text-xs text-slate-500">To school (AM)</p>
                                                            </div>
                                                            {data.trip_direction === 'pickup_only' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                        <label className={`group relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                                            data.trip_direction === 'dropoff_only'
                                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/25 to-yellow-500/15 shadow-lg ring-2 ring-yellow-400/40'
                                                                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
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
                                                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${data.trip_direction === 'dropoff_only' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                                                <svg className={`w-4 h-4 ${data.trip_direction === 'dropoff_only' ? 'text-slate-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-extrabold text-slate-900">Dropoff only</p>
                                                                <p className="text-xs text-slate-500">From school (PM)</p>
                                                            </div>
                                                            {data.trip_direction === 'dropoff_only' && (
                                                                <div className="ml-auto w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
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
                                            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Review Your Booking</h3>
                                            <p className="text-sm text-slate-500">Please review all details before proceeding to payment</p>
                                        </div>
                                        
                                        {/* Display general form errors */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="font-extrabold text-rose-800">Please fix the following errors:</p>
                                                </div>
                                                <ul className="list-disc list-inside space-y-1 ml-2">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key} className="text-sm font-semibold text-rose-700">{message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-md">
                                                    <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                            </div>
                                                <div className="flex-1">
                                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Student</p>
                                                    <p className="text-lg font-extrabold text-slate-900">{students.find(s => s.id == data.student_id)?.name}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-md">
                                                    <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Route</p>
                                                    <p className="mb-2 text-lg font-extrabold text-slate-900">{selectedRoute?.name}</p>
                                                {selectedRoute && (selectedRoute.pickup_time || selectedRoute.dropoff_time) && (
                                                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                                        {selectedRoute.pickup_time && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Pickup: <span className="font-bold text-amber-200">{formatTime(selectedRoute.pickup_time)}</span>
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
                                            
                                            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-md">
                                                    <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Pickup Location</p>
                                                    <p className="text-lg font-extrabold text-slate-900">
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
                                                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 shadow-md">
                                                        <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Plan</p>
                                                        <p className="text-base font-extrabold text-slate-900">
                                                    {data.plan_type === 'academic_term' ? 'Academic Term' : data.plan_type.replace('_', '-').toUpperCase()}
                                                        </p>
                                            </div>
                                                </div>
                                                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 shadow-md">
                                                        <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Trip Type</p>
                                                        <p className="text-base font-extrabold text-slate-900">
                                                            {data.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {data.trip_type === 'one_way' && (
                                                    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 shadow-md">
                                                            <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Service</p>
                                                            <p className="text-base font-extrabold text-slate-900">
                                                                {data.trip_direction === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-md">
                                                    <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Start Date</p>
                                                    <p className="text-lg font-extrabold text-slate-900">{new Date(data.start_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            
                                            {price && (
                                                <div className="mt-6 border-t border-slate-200 pt-6">
                                                    {price.discount_label && (
                                                        <p className="mb-2 text-sm font-semibold text-yellow-300">
                                                            Discount applied ({price.discount_label})
                                                        </p>
                                                    )}
                                                    {selectedStudentIds.length > 1 && price.per_booking_formatted && (
                                                        <p className="mb-2 text-sm text-slate-500">{selectedStudentIds.length} children × {price.per_booking_formatted} per child</p>
                                                    )}
                                                    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-5">
                                                        <span className="text-xl font-extrabold text-slate-900">Total Amount:</span>
                                                        <span className="text-3xl font-extrabold text-amber-700">
                                                            {price.total_formatted ?? price.formatted}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={step === 0 && !studentIdParam}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                                            step === 0 && !studentIdParam
                                                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
                                            disabled={processing || submitting}
                                            className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-brand-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                        >
                                            {(processing || submitting) ? (
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

