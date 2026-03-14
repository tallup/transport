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
        pickup_address: booking.pickup_address || '',
        dropoff_point_id: booking.dropoff_point_id || '',
        plan_type: booking.plan_type || 'weekly',
        trip_type: booking.trip_type || 'two_way',
        trip_direction: booking.trip_direction || 'both',
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
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit Booking</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="student_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Student *
                                        </label>
                                        <select
                                            id="student_id"
                                            value={data.student_id}
                                            onChange={(e) => setData('student_id', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Select Student</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name} ({student.parent?.name})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.student_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="route_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Route *
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => handleRouteChange(e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Select Route</option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {route.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="pickup_point_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Pickup Point (Optional)
                                        </label>
                                        <select
                                            id="pickup_point_id"
                                            value={data.pickup_point_id}
                                            onChange={(e) => setData('pickup_point_id', e.target.value)}
                                            className="form-control"
                                            disabled={!selectedRouteId}
                                        >
                                            <option value="">Select Pickup Point</option>
                                            {availablePickupPoints.map((point) => (
                                                <option key={point.id} value={point.id}>
                                                    {point.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.pickup_point_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="dropoff_point_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Dropoff Point (Optional)
                                        </label>
                                        <select
                                            id="dropoff_point_id"
                                            value={data.dropoff_point_id}
                                            onChange={(e) => setData('dropoff_point_id', e.target.value)}
                                            className="form-control"
                                            disabled={!selectedRouteId}
                                        >
                                            <option value="">Select Dropoff Point (Optional)</option>
                                            {availablePickupPoints.map((point) => (
                                                <option key={point.id} value={point.id}>
                                                    {point.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.dropoff_point_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="pickup_address" className="mb-2 block text-base font-semibold text-slate-700">
                                            Pickup Address (Optional - if no point selected)
                                        </label>
                                        <input
                                            id="pickup_address"
                                            type="text"
                                            value={data.pickup_address}
                                            onChange={(e) => setData('pickup_address', e.target.value)}
                                            className="form-control"
                                            placeholder="Enter precise custom pickup address"
                                        />
                                        <InputError message={errors.pickup_address} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="plan_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Plan Type *
                                        </label>
                                        <select
                                            id="plan_type"
                                            value={data.plan_type}
                                            onChange={(e) => setData('plan_type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="academic_term">Academic Term</option>
                                            <option value="annual">Annual</option>
                                        </select>
                                        <InputError message={errors.plan_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="trip_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Trip Type *
                                        </label>
                                        <select
                                            id="trip_type"
                                            value={data.trip_type}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setData('trip_type', v);
                                                if (v === 'two_way') setData('trip_direction', 'both');
                                                else if (data.trip_direction === 'both') setData('trip_direction', 'pickup_only');
                                            }}
                                            className="form-control"
                                            required
                                        >
                                            <option value="one_way">One Way</option>
                                            <option value="two_way">Two Way</option>
                                        </select>
                                        <InputError message={errors.trip_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    {data.trip_type === 'one_way' && (
                                        <div>
                                            <label htmlFor="trip_direction" className="mb-2 block text-base font-semibold text-slate-700">Service (one way only)</label>
                                            <select
                                                id="trip_direction"
                                                value={data.trip_direction}
                                                onChange={(e) => setData('trip_direction', e.target.value)}
                                                className="form-control"
                                            >
                                                <option value="pickup_only">Pickup only</option>
                                                <option value="dropoff_only">Dropoff only</option>
                                            </select>
                                            <InputError message={errors.trip_direction} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="status" className="mb-2 block text-base font-semibold text-slate-700">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="awaiting_approval">Awaiting Approval</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="expired">Expired</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="start_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            Start Date *
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            End Date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.end_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/bookings"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
