import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { useState, useEffect } from 'react';

export default function Edit({ booking, students, routes }) {
    const { auth } = usePage().props;
    const [selectedRouteId, setSelectedRouteId] = useState(booking.route_id || '');
    const [availablePickupPoints, setAvailablePickupPoints] = useState(booking.route?.pickup_points || []);

    const { data, setData, put, processing, errors } = useForm({
        student_id: booking.student_id || '',
        route_id: booking.route_id || '',
        pickup_point_id: booking.pickup_point_id || '',
        dropoff_point_id: booking.dropoff_point_id || '',
        plan_type: booking.plan_type || 'weekly',
        trip_type: booking.trip_type || 'two_way',
        status: booking.status || 'pending',
        start_date: booking.start_date ? (typeof booking.start_date === 'string' ? booking.start_date.split('T')[0] : booking.start_date) : '',
        end_date: booking.end_date ? (typeof booking.end_date === 'string' ? booking.end_date.split('T')[0] : booking.end_date) : '',
    });

    useEffect(() => {
        if (selectedRouteId) {
            const selectedRoute = routes.find(r => r.id == selectedRouteId);
            if (selectedRoute && selectedRoute.pickup_points) {
                setAvailablePickupPoints(selectedRoute.pickup_points);
            } else {
                setAvailablePickupPoints([]);
            }
        }
    }, [selectedRouteId]);

    const handleRouteChange = (routeId) => {
        setSelectedRouteId(routeId);
        setData('route_id', routeId);
        setData('pickup_point_id', '');
        setData('dropoff_point_id', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/bookings/${booking.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Booking" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit Booking</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="student_id" className="block text-base font-bold text-white mb-2">
                                            Student *
                                        </label>
                                        <select
                                            id="student_id"
                                            value={data.student_id}
                                            onChange={(e) => setData('student_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="" className="bg-indigo-700">Select Student</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id} className="bg-indigo-700">
                                                    {student.name} ({student.parent?.name})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.student_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="route_id" className="block text-base font-bold text-white mb-2">
                                            Route *
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => handleRouteChange(e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="" className="bg-indigo-700">Select Route</option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id} className="bg-indigo-700">
                                                    {route.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="pickup_point_id" className="block text-base font-bold text-white mb-2">
                                            Pickup Point *
                                        </label>
                                        <select
                                            id="pickup_point_id"
                                            value={data.pickup_point_id}
                                            onChange={(e) => setData('pickup_point_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                            disabled={!selectedRouteId}
                                        >
                                            <option value="" className="bg-indigo-700">Select Pickup Point</option>
                                            {availablePickupPoints.map((point) => (
                                                <option key={point.id} value={point.id} className="bg-indigo-700">
                                                    {point.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.pickup_point_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="dropoff_point_id" className="block text-base font-bold text-white mb-2">
                                            Dropoff Point (Optional)
                                        </label>
                                        <select
                                            id="dropoff_point_id"
                                            value={data.dropoff_point_id}
                                            onChange={(e) => setData('dropoff_point_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            disabled={!selectedRouteId}
                                        >
                                            <option value="" className="bg-indigo-700">Select Dropoff Point (Optional)</option>
                                            {availablePickupPoints.map((point) => (
                                                <option key={point.id} value={point.id} className="bg-indigo-700">
                                                    {point.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.dropoff_point_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="plan_type" className="block text-base font-bold text-white mb-2">
                                            Plan Type *
                                        </label>
                                        <select
                                            id="plan_type"
                                            value={data.plan_type}
                                            onChange={(e) => setData('plan_type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="weekly" className="bg-indigo-700">Weekly</option>
                                            <option value="monthly" className="bg-indigo-700">Monthly</option>
                                            <option value="academic_term" className="bg-indigo-700">Academic Term</option>
                                            <option value="annual" className="bg-indigo-700">Annual</option>
                                        </select>
                                        <InputError message={errors.plan_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="trip_type" className="block text-base font-bold text-white mb-2">
                                            Trip Type *
                                        </label>
                                        <select
                                            id="trip_type"
                                            value={data.trip_type}
                                            onChange={(e) => setData('trip_type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="one_way" className="bg-indigo-700">One Way</option>
                                            <option value="two_way" className="bg-indigo-700">Two Way</option>
                                        </select>
                                        <InputError message={errors.trip_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-base font-bold text-white mb-2">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="pending" className="bg-indigo-700">Pending</option>
                                            <option value="awaiting_approval" className="bg-indigo-700">Awaiting Approval</option>
                                            <option value="active" className="bg-indigo-700">Active</option>
                                            <option value="completed" className="bg-indigo-700">Completed</option>
                                            <option value="expired" className="bg-indigo-700">Expired</option>
                                            <option value="cancelled" className="bg-indigo-700">Cancelled</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="start_date" className="block text-base font-bold text-white mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="block text-base font-bold text-white mb-2">
                                            End Date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        />
                                        <InputError message={errors.end_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/bookings"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Booking'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
