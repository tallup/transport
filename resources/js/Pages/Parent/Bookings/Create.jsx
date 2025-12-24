import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function CreateBooking({ students, routes }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(1);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [availableSeats, setAvailableSeats] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
        student_id: '',
        route_id: '',
        pickup_point_id: '',
        plan_type: '',
        start_date: new Date().toISOString().split('T')[0],
    });

    // Load pickup points when route is selected
    useEffect(() => {
        if (data.route_id) {
            const route = routes.find(r => r.id === parseInt(data.route_id));
            setSelectedRoute(route);
            setPickupPoints(route?.pickup_points || []);
            checkCapacity(data.route_id);
        } else {
            setPickupPoints([]);
            setSelectedRoute(null);
        }
    }, [data.route_id]);

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
        post('/parent/bookings');
    };

    const nextStep = () => {
        if (step === 1 && !data.student_id) return;
        if (step === 2 && !data.route_id) return;
        if (step === 3 && !data.pickup_point_id) return;
        if (step === 4 && !data.plan_type) return;
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Book Transport Service</h2>

                            {/* Step Indicator */}
                            <div className="mb-8">
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="flex items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    step >= s
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {s}
                                            </div>
                                            {s < 5 && (
                                                <div
                                                    className={`w-16 h-1 mx-2 ${
                                                        step > s ? 'bg-blue-500' : 'bg-gray-200'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>Student</span>
                                    <span>Route</span>
                                    <span>Pickup</span>
                                    <span>Plan</span>
                                    <span>Review</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Select Student */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Select Student</h3>
                                        {students.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 mb-4">No students registered yet.</p>
                                                <a
                                                    href="/parent/students/create"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Add a student first
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {students.map((student) => (
                                                    <label
                                                        key={student.id}
                                                        className={`block p-4 border rounded-lg cursor-pointer ${
                                                            data.student_id == student.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-300'
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
                                                        <span className="font-semibold">{student.name}</span>
                                                        <span className="text-gray-600 ml-2">- {student.school}</span>
                                                    </label>
                                                ))}
                                                {errors.student_id && (
                                                    <p className="text-red-500 text-sm">{errors.student_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Select Route */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Select Route</h3>
                                        <div className="space-y-4">
                                            {routes.map((route) => (
                                                <label
                                                    key={route.id}
                                                    className={`block p-4 border rounded-lg cursor-pointer ${
                                                        data.route_id == route.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-300'
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
                                                            <span className="font-semibold">{route.name}</span>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Vehicle: {route.vehicle?.make} {route.vehicle?.model} ({route.vehicle?.license_plate})
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-sm px-2 py-1 rounded ${
                                                                route.available_seats > 0
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {route.available_seats} seats available
                                                            </span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                            {errors.route_id && (
                                                <p className="text-red-500 text-sm">{errors.route_id}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Select Pickup Point */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Select Pickup Point</h3>
                                        {pickupPoints.length === 0 ? (
                                            <p className="text-gray-500">Please select a route first.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {pickupPoints.map((point) => (
                                                    <label
                                                        key={point.id}
                                                        className={`block p-4 border rounded-lg cursor-pointer ${
                                                            data.pickup_point_id == point.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="pickup_point_id"
                                                            value={point.id}
                                                            checked={data.pickup_point_id == point.id}
                                                            onChange={(e) => setData('pickup_point_id', e.target.value)}
                                                            className="mr-3"
                                                        />
                                                        <div>
                                                            <span className="font-semibold">{point.name}</span>
                                                            <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Pickup: {point.pickup_time} | Dropoff: {point.dropoff_time}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ))}
                                                {errors.pickup_point_id && (
                                                    <p className="text-red-500 text-sm">{errors.pickup_point_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 4: Select Plan */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Select Plan</h3>
                                        <div className="space-y-4">
                                            {['weekly', 'bi_weekly', 'monthly', 'semester', 'annual'].map((plan) => (
                                                <label
                                                    key={plan}
                                                    className={`block p-4 border rounded-lg cursor-pointer ${
                                                        data.plan_type === plan
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-300'
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
                                                        <span className="font-semibold capitalize">
                                                            {plan.replace('_', '-')}
                                                        </span>
                                                        {price && data.plan_type === plan && (
                                                            <span className="text-lg font-bold text-green-600">
                                                                {price.formatted}
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                            {loading && <p className="text-gray-500">Calculating price...</p>}
                                            {errors.plan_type && (
                                                <p className="text-red-500 text-sm">{errors.plan_type}</p>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                            {errors.start_date && (
                                                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Review */}
                                {step === 5 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>
                                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                            <div>
                                                <span className="font-semibold">Student:</span>{' '}
                                                {students.find(s => s.id == data.student_id)?.name}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Route:</span>{' '}
                                                {selectedRoute?.name}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Pickup Point:</span>{' '}
                                                {pickupPoints.find(p => p.id == data.pickup_point_id)?.name}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Plan:</span>{' '}
                                                {data.plan_type.replace('_', '-').toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Start Date:</span>{' '}
                                                {new Date(data.start_date).toLocaleDateString()}
                                            </div>
                                            {price && (
                                                <div className="border-t pt-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-semibold">Total:</span>
                                                        <span className="text-2xl font-bold text-green-600">
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
                                        disabled={step === 1}
                                        className={`px-4 py-2 rounded ${
                                            step === 1
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gray-500 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    {step < 5 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Proceed to Payment'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

