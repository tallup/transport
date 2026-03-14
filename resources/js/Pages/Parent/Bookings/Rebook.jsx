import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { toast } from 'sonner';
const axios = window.axios;

export default function Rebook({ previousBooking, students, schools = [], routes }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(4); // Start at Plan selection
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [planPrices, setPlanPrices] = useState({}); // Store prices for all plans
    const [price, setPrice] = useState(null); // Current selected price
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
        trip_direction: previousBooking.trip_direction || 'both',
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
            fetchAllPrices(data.route_id, data.trip_type); // Fetch all prices when route is ready
        } else {
            setSelectedRoute(null);
            setPlanPrices({});
        }
    }, [data.route_id, filteredRoutes, data.trip_type]);

    // When Two way is selected, trip direction is always both. When One way, require pickup or dropoff.
    useEffect(() => {
        if (data.trip_type === 'two_way') {
            setData('trip_direction', 'both');
        } else if (data.trip_type === 'one_way' && data.trip_direction === 'both') {
            setData('trip_direction', 'pickup_only');
        }
    }, [data.trip_type]);

    // Update the singular 'price' when plan changes
    useEffect(() => {
        if (data.plan_type && planPrices[data.plan_type]) {
            setPrice(planPrices[data.plan_type]);
        }
    }, [data.plan_type, planPrices]);

    const checkCapacity = async (routeId) => {
        try {
            const response = await axios.get(`/parent/routes/${routeId}/capacity`);
            setAvailableSeats(response.data);
        } catch (error) {
            console.error('Error checking capacity:', error);
        }
    };

    const fetchAllPrices = async (routeId, tripType) => {
        if (!routeId || !tripType) return;
        setLoading(true);
        const plans = ['weekly', 'monthly', 'academic_term', 'annual'];
        const newPrices = {};

        try {
            // Fetch all 4 prices in parallel for maximum speed
            const pricePromises = plans.map(plan =>
                axios.get('/parent/calculate-price', {
                    params: {
                        route_id: routeId,
                        plan_type: plan,
                        trip_type: tripType,
                    },
                })
            );

            const results = await Promise.all(pricePromises);
            results.forEach((res, index) => {
                newPrices[plans[index]] = res.data;
            });
            setPlanPrices(newPrices);
        } catch (error) {
            console.error('Error pre-fetching all prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields before submitting
        if (!data.student_id || !data.route_id || (!data.pickup_point_id && !data.pickup_address) || !data.plan_type || !data.start_date) {
            toast.error('Please complete all required fields before proceeding to payment.');
            return;
        }
        if (data.trip_type === 'one_way' && !['pickup_only', 'dropoff_only'].includes(data.trip_direction)) {
            toast.error('Please select pickup only or dropoff only for one way trip.');
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
            toast.error('Please enter a pickup address.');
            return;
        }
        if (step === 4 && !data.plan_type) return;
        if (step === 4 && data.trip_type === 'one_way' && !['pickup_only', 'dropoff_only'].includes(data.trip_direction)) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Rebook Transport" />

            <div className="py-10">
                <div className="container max-w-4xl">
                    <GlassCard className="parent-form-shell overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Rebook Transport Service</h2>
                            <p className="mb-6 text-base font-medium text-slate-600">Quickly renew service for {previousBooking.student?.name}</p>

                            {/* Rebook Summary (Always visible for rebook) */}
                            <div className="mb-10 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:grid-cols-3">
                                <div>
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Student</p>
                                    <p className="text-lg font-black text-slate-900">{previousBooking.student?.name}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Current Route</p>
                                    <p className="text-lg font-black text-slate-900">{previousBooking.route?.name}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-slate-500">School</p>
                                    <p className="text-lg font-black text-slate-900">{previousBooking.student?.school?.name || 'Assigned School'}</p>
                                </div>
                            </div>

                            {/* Step Indicator */}
                            <div className="mb-10">
                                <div className="flex justify-between relative px-2">
                                    {/* Background Line */}
                                    <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-10"></div>

                                    {[0, 1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= s
                                                    ? 'bg-brand-primary text-white scale-110 shadow-brand-primary/30'
                                                    : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
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
                                <div className="flex justify-between mt-3 px-1 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                    <span className={step >= 0 ? 'text-slate-700' : ''}>School</span>
                                    <span className={step >= 1 ? 'text-slate-700' : ''}>Student</span>
                                    <span className={step >= 2 ? 'text-slate-700' : ''}>Route</span>
                                    <span className={step >= 3 ? 'text-slate-700' : ''}>Pickup</span>
                                    <span className={step >= 4 ? 'text-slate-700' : ''}>Plan</span>
                                    <span className={step >= 5 ? 'text-slate-700' : ''}>Review</span>
                                </div>
                            </div >

                            <form onSubmit={handleSubmit}>
                                {/* Step 0: Select School */}
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <h3 className="mb-4 text-xl font-bold text-slate-900">Select School</h3>
                                        <div className="space-y-2">
                                            {schools.map((school) => (
                                                <label
                                                    key={school.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition ${data.school_id == school.id
                                                        ? 'border-brand-primary bg-brand-primary/5'
                                                        : 'border-slate-200 bg-white hover:bg-slate-50'
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
                                                        <span className="font-bold text-slate-900">{school.name}</span>
                                                        {school.address && (
                                                            <p className="mt-1 text-sm font-medium text-slate-500">{school.address}</p>
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
                                        <h3 className="mb-4 text-xl font-bold text-slate-900">Select Student</h3>
                                        <div className="space-y-2">
                                            {students.map((student) => (
                                                <label
                                                    key={student.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition ${data.student_id == student.id
                                                        ? 'border-brand-primary bg-brand-primary/5'
                                                        : 'border-slate-200 bg-white hover:bg-slate-50'
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
                                                    <span className="font-bold text-slate-900">{student.name}</span>
                                                    {student.school && (
                                                        <span className="ml-2 font-medium text-slate-500">- {student.school.name}</span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Select Route */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="mb-4 text-xl font-bold text-slate-900">Select Route</h3>
                                        {filteredRoutes.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="mb-4 text-lg font-semibold text-slate-700">No routes available for the selected school.</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(0)}
                                                    className="font-semibold text-sky-700 underline hover:text-sky-800"
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
                                                            ? 'border-brand-primary bg-brand-primary/5'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50'
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
                                                                <span className="font-bold text-slate-900">{route.name}</span>
                                                                <p className="mt-1 text-sm font-medium text-slate-500">
                                                                    Vehicle: {route.vehicle?.make} {route.vehicle?.model} ({route.vehicle?.license_plate})
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-sm px-2 py-1 rounded border font-semibold ${route.available_seats > 0
                                                                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                                    : 'border-rose-200 bg-rose-50 text-rose-700'
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
                                        <h3 className="mb-4 text-xl font-bold text-slate-900">Pickup and Dropoff Location</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-base font-semibold text-slate-700">
                                                    Pickup Address <span className="text-red-300">*</span>
                                                </label>
                                                <textarea
                                                    value={data.pickup_address}
                                                    onChange={(e) => setData('pickup_address', e.target.value)}
                                                    placeholder="Enter the full address where the student will be picked up"
                                                    rows={3}
                                                    className="form-control block w-full"
                                                    required
                                                />
                                                {errors.pickup_address && (
                                                    <p className="text-red-300 text-sm mt-1 font-semibold">{errors.pickup_address}</p>
                                                )}
                                                <p className="mt-2 text-sm font-medium text-slate-500">
                                                    This address will be used for daily pickup. Make sure it's accurate and complete.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Select Plan */}
                                {step === 4 && (
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="h-8 w-2 rounded-full bg-brand-primary"></div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Select Subscription Plan</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="mb-3 ml-1 block text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                                                    Duration
                                                </label>
                                                <div className="space-y-3">
                                                    {['weekly', 'monthly', 'academic_term', 'annual'].map((plan) => (
                                                        <label
                                                            key={plan}
                                                            className={`block p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${data.plan_type === plan
                                                                ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="plan_type"
                                                                        value={plan}
                                                                        checked={data.plan_type === plan}
                                                                        onChange={(e) => setData('plan_type', e.target.value)}
                                                                        className="h-5 w-5 text-brand-primary focus:ring-brand-primary"
                                                                    />
                                                                    <span className="ml-4 font-black uppercase tracking-wide text-slate-900">
                                                                        {plan === 'academic_term' ? 'Academic Term' : plan.replace('_', ' ')}
                                                                    </span>
                                                                </div>
                                                                <div className="text-right">
                                                                    {planPrices[plan] ? (
                                                                        <span className="text-xl font-black text-amber-600">
                                                                            {planPrices[plan].formatted}
                                                                        </span>
                                                                    ) : (
                                                                        <div className="h-6 w-20 animate-pulse rounded bg-slate-200"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                    {loading && <p className="ml-1 animate-pulse text-xs font-black uppercase tracking-[0.2em] text-slate-500">Refreshing current rates...</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="mb-3 ml-1 block text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="form-control w-full"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-3 ml-1 block text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                                                        Trip Type
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${data.trip_type === 'one_way'
                                                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_type"
                                                                value="one_way"
                                                                checked={data.trip_type === 'one_way'}
                                                                onChange={(e) => setData('trip_type', e.target.value)}
                                                                className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                                                            />
                                                            <span className="ml-3 text-sm font-black uppercase tracking-widest text-slate-900">One Way</span>
                                                        </label>
                                                        <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${data.trip_type === 'two_way'
                                                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="trip_type"
                                                                value="two_way"
                                                                checked={data.trip_type === 'two_way'}
                                                                onChange={(e) => setData('trip_type', e.target.value)}
                                                                className="h-4 w-4 text-brand-primary focus:ring-brand-primary"
                                                            />
                                                            <span className="ml-3 text-sm font-black uppercase tracking-widest text-slate-900">Two Way</span>
                                                        </label>
                                                    </div>
                                                    {errors.trip_type && (
                                                        <p className="text-red-400 text-xs mt-2 font-bold uppercase ml-1">{errors.trip_type}</p>
                                                    )}
                                                </div>
                                                {data.trip_type === 'one_way' && (
                                                    <div>
                                                        <label className="mb-3 ml-1 block text-sm font-black uppercase tracking-[0.2em] text-slate-500">Service</label>
                                                        <p className="mb-2 text-xs text-slate-500">One way: choose pickup only or dropoff only</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {['pickup_only', 'dropoff_only'].map((value) => (
                                                                <label key={value} className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                                                    data.trip_direction === value ? 'border-brand-primary bg-brand-primary/5 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                                }`}>
                                                                    <input
                                                                        type="radio"
                                                                        name="trip_direction"
                                                                        value={value}
                                                                        checked={data.trip_direction === value}
                                                                        onChange={(e) => setData('trip_direction', e.target.value)}
                                                                        className="mr-2"
                                                                    />
                                                                    <span className="text-sm font-black uppercase text-slate-900">
                                                                        {value === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {errors.trip_direction && (
                                                            <p className="text-red-400 text-xs mt-2 font-bold uppercase ml-1">{errors.trip_direction}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Review */}
                                {step === 5 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="h-8 w-2 rounded-full bg-amber-500"></div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Review Final Summary</h3>
                                        </div>

                                        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Student</p>
                                                        <p className="text-xl font-black text-slate-900">{students.find(s => s.id == data.student_id)?.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Assigned Route</p>
                                                        <p className="text-xl font-black text-slate-900">{selectedRoute?.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Billing Plan</p>
                                                        <p className="text-xl font-black uppercase text-slate-900">{data.plan_type.replace('_', ' ')}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Start Date</p>
                                                        <p className="text-xl font-black text-slate-900">{new Date(data.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Trip Type</p>
                                                        <p className="text-xl font-black uppercase text-slate-900">{data.trip_type.replace('_', ' ')}</p>
                                                    </div>
                                                    {data.trip_type === 'one_way' && (
                                                        <div>
                                                            <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Service</p>
                                                            <p className="text-xl font-black uppercase text-slate-900">
                                                                {data.trip_direction === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Pickup Information</p>
                                                        <p className="text-sm font-bold leading-relaxed text-slate-700">{data.pickup_address || 'Daily Home Pickup'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {price && (
                                                <div className="mt-4 border-t border-slate-200 pt-8">
                                                    <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-6">
                                                        <div>
                                                            <p className="text-sm font-black uppercase tracking-widest text-slate-700">Total Subscription Amount</p>
                                                            <p className="mt-1 text-xs font-bold uppercase text-slate-500">Inclusive of all services & taxes</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-4xl font-black text-amber-700">
                                                                {price.formatted}
                                                            </span>
                                                        </div>
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
                                            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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




