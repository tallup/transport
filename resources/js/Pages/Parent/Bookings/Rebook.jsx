import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
const axios = window.axios;

export default function Rebook({ previousBooking, students, schools = [], routes }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(4); // Start at Plan selection
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredRoutes, setFilteredRoutes] = useState(routes);

    const { data, setData, post, errors, processing } = useForm({
        school_id: previousBooking.student?.school_id || '',
        student_id: previousBooking.student_id || '',
        route_id: previousBooking.route_id || '',
        pickup_point_id: previousBooking.pickup_point_id || '',
        pickup_address: previousBooking.pickup_address || previousBooking.student?.home_address || '',
        plan_type: previousBooking.plan_type || '',
        trip_type: previousBooking.trip_type || 'two_way',
        start_date: new Date().toISOString().split('T')[0],
    });

    // Filter routes when school is selected
    useEffect(() => {
        if (data.school_id) {
            const filtered = routes.filter(route =>
                route.schools && route.schools.some(school => school.id === parseInt(data.school_id))
            );
            setFilteredRoutes(filtered);
        } else {
            setFilteredRoutes(routes);
        }
    }, [data.school_id, routes]);

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
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const nextStep = () => {
        if (step === 0 && !data.school_id) return;
        if (step === 1 && !data.student_id) return;
        if (step === 2 && !data.route_id) return;
        if (step === 3 && !data.pickup_address && !data.pickup_point_id) {
            alert('Please enter a pickup address.');
            return;
        }
        if (step === 4 && !data.plan_type) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Rebook Transport" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">Rebook Transport Service</h2>
                            <p className="text-xl font-bold text-blue-200 mb-6 drop-shadow">Quickly renew service for {previousBooking.student?.name}</p>

                            {/* Rebook Summary (Always visible for rebook) */}
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Student</p>
                                    <p className="text-base font-bold text-white">{previousBooking.student?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Route</p>
                                    <p className="text-base font-bold text-white">{previousBooking.route?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">School</p>
                                    <p className="text-base font-bold text-white">{previousBooking.student?.school?.name || 'Assigned School'}</p>
                                </div>
                            </div>

                            {/* Step Indicator */}
                            <div className="mb-10">
                                <div className="flex justify-between relative px-2">
                                    {/* Background Line */}
                                    <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10 -z-10"></div>

                                    {[0, 1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= s
                                                    ? 'bg-blue-600 text-white scale-110 shadow-blue-500/50'
                                                    : 'bg-white/10 text-white/40 border-2 border-white/10'
                                                    }`}
                                            >
                                                {step > s ? (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : s + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-3 text-[10px] font-black tracking-tighter text-white/60 uppercase px-1">
                                    <span className={step >= 0 ? 'text-blue-400' : ''}>School</span>
                                    <span className={step >= 1 ? 'text-blue-400' : ''}>Student</span>
                                    <span className={step >= 2 ? 'text-blue-400' : ''}>Route</span>
                                    <span className={step >= 3 ? 'text-blue-400' : ''}>Pickup</span>
                                    <span className={step >= 4 ? 'text-blue-400' : ''}>Plan</span>
                                    <span className={step >= 5 ? 'text-blue-400' : ''}>Review</span>
                                </div>
                            </div >

                            <form onSubmit={handleSubmit}>
                                {/* Step 0: Select School */}
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select School</h3>
                                        <div className="space-y-2">
                                            {schools.map((school) => (
                                                <label
                                                    key={school.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition ${data.school_id == school.id
                                                        ? 'border-blue-400 bg-blue-500/30 backdrop-blur-sm'
                                                        : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="school_id"
                                                        value={school.id}
                                                        checked={data.school_id == school.id}
                                                        onChange={(e) => setData('school_id', e.target.value)}
                                                        className="mr-3"
                                                    />
                                                    <div>
                                                        <span className="font-bold text-white">{school.name}</span>
                                                        {school.address && (
                                                            <p className="text-sm text-white/90 mt-1 font-semibold">{school.address}</p>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 1: Select Student */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Student</h3>
                                        <div className="space-y-2">
                                            {students.map((student) => (
                                                <label
                                                    key={student.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition ${data.student_id == student.id
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
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Select Route */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Route</h3>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-white text-lg font-semibold mb-4">No routes available for the selected school.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(0)}
                                                    className="text-blue-300 hover:text-blue-100 font-bold underline"
                                                >
                                                    Select a different school
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {filteredRoutes.map((route) => (
                                                    <label
                                                        key={route.id}
                                                        className={`block p-4 border rounded-lg cursor-pointer transition ${data.route_id == route.id
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
                                                                <span className={`text-sm px-2 py-1 rounded border font-semibold ${route.available_seats > 0
                                                                    ? 'bg-green-500/30 text-green-100 border-green-400/50'
                                                                    : 'bg-red-500/30 text-red-100 border-red-400/50'
                                                                    }`}>
                                                                    {route.available_seats} seats available
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Enter Pickup Address */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Pickup and Dropoff Location</h3>
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
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Select Plan */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Select Plan</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="space-y-4">
                                                    {['weekly', 'monthly', 'academic_term', 'annual'].map((plan) => (
                                                        <label
                                                            key={plan}
                                                            className={`block p-4 border rounded-lg cursor-pointer transition ${data.plan_type === plan
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
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-base font-bold text-white mb-2">
                                                    Trip Type *
                                                </label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${data.trip_type === 'one_way'
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
                                                    <label className={`block p-4 border rounded-lg cursor-pointer transition ${data.trip_type === 'two_way'
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

                                {/* Step 5: Review */}
                                {step === 5 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white mb-4">Review Your Booking</h3>
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
                                                    {data.pickup_address || 'Not set'}
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
                                        className={`px-4 py-2 rounded font-bold transition ${step === 0
                                            ? 'bg-gray-500/30 cursor-not-allowed text-gray-400'
                                            : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    {step < 5 ? (
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
                        </div >
                    </GlassCard >
                </div >
            </div >
        </AuthenticatedLayout >
    );
}




