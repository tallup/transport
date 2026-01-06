import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import axios from 'axios';

export default function CreateBooking({ students, routes }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(0);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState(routes);

    const { data, setData, post, errors, processing } = useForm({
        school_id: '',
        student_id: '',
        route_id: '',
        pickup_point_id: '',
        pickup_address: '',
        pickup_latitude: '',
        pickup_longitude: '',
        plan_type: '',
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

    // Pre-select school based on student's school
    useEffect(() => {
        if (data.student_id && !data.school_id) {
            const student = students.find(s => s.id == data.student_id);
            if (student?.school_id) {
                setData('school_id', student.school_id);
            }
        }
    }, [data.student_id, students]);

    // Pre-fill pickup address with student's home address
    useEffect(() => {
        if (data.student_id && !data.pickup_address) {
            const student = students.find(s => s.id == data.student_id);
            if (student?.home_address) {
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
        } else {
            setSelectedRoute(null);
        }
    }, [data.route_id, filteredRoutes]);

    // Calculate price when route or plan type changes
    useEffect(() => {
        if (data.route_id && data.plan_type) {
            calculatePrice();
        } else {
            setPrice(null);
        }
    }, [data.route_id, data.plan_type]);

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
            const response = await axios.post('/parent/calculate-price', {
                route_id: data.route_id,
                plan_type: data.plan_type,
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
        if (!data.student_id || !data.route_id || (!data.pickup_point_id && !data.pickup_address) || !data.plan_type || !data.start_date) {
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
        // Step 0: Student
        if (step === 0 && !data.student_id) return;
        // Step 1: Route
        if (step === 1 && !data.route_id) return;
        // Step 2: Pickup
        if (step === 2 && !data.pickup_address && !data.pickup_point_id) {
            alert('Please enter a pickup address.');
            return;
        }
        // Step 3: Plan
        if (step === 3 && !data.plan_type) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

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
                                        <h3 className="text-xl font-bold text-white mb-4">Select Route</h3>
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
                                                        <div>
                                                            <span className="font-bold text-white">{route.name}</span>
                                                            <p className="text-sm text-white/90 mt-1 font-semibold">
                                                                Vehicle: {route.vehicle?.make} {route.vehicle?.model} ({route.vehicle?.license_plate})
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
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
                                        <h3 className="text-xl font-bold text-white mb-4">Enter Pickup Location</h3>
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
                                                    required
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
                                    </div>
                                )}

                                {/* Step 3: Select Plan */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Plan</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="space-y-4">
                                                    {['weekly', 'bi_weekly', 'monthly', 'semester', 'annual'].map((plan) => (
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
                                                                    {plan.replace('_', '-')}
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
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Pickup Address:</span>{' '}
                                                <span className="text-white/90 font-semibold">
                                                    {data.pickup_address || pickupPoints.find(p => p.id == data.pickup_point_id)?.name || 'Not set'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-white">Plan:</span>{' '}
                                                <span className="text-white/90 font-semibold">{data.plan_type.replace('_', '-').toUpperCase()}</span>
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
                                        disabled={step === 0}
                                        className={`px-4 py-2 rounded font-bold transition ${
                                            step === 0
                                                ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                                                : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
                                        }`}
                                    >
                                        Previous
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

