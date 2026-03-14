import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GlassButton from '@/Components/GlassButton';
import GlassCard from '@/Components/GlassCard';
import Select from '@/Components/Select';
import { useState, useEffect } from 'react';

export default function Create({ students, routes }) {
    const { auth } = usePage().props;
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [availablePickupPoints, setAvailablePickupPoints] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        route_id: '',
        pickup_point_id: '',
        pickup_address: '',
        dropoff_point_id: '',
        plan_type: 'weekly',
        trip_type: 'two_way',
        trip_direction: 'both',
        status: 'pending',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (selectedRouteId) {
            const selectedRoute = routes.find(r => r.id == selectedRouteId);
            if (selectedRoute && selectedRoute.pickup_points) {
                setAvailablePickupPoints(selectedRoute.pickup_points);
            } else {
                setAvailablePickupPoints([]);
            }
            setData('pickup_point_id', '');
            setData('dropoff_point_id', '');
        } else {
            setAvailablePickupPoints([]);
        }
    }, [selectedRouteId]);

    // Auto-calculate end date based on plan type and start date
    useEffect(() => {
        if (data.start_date && data.plan_type) {
            const startDate = new Date(data.start_date);
            let endDate = new Date(startDate);

            switch (data.plan_type) {
                case 'weekly':
                    endDate.setDate(endDate.getDate() + 7);
                    break;
                case 'monthly':
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'academic_term':
                    endDate.setMonth(endDate.getMonth() + 6);
                    break;
                case 'annual':
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default:
                    return;
            }

            // Format date as YYYY-MM-DD
            const formattedEndDate = endDate.toISOString().split('T')[0];
            setData('end_date', formattedEndDate);
        }
    }, [data.start_date, data.plan_type]);

    const handleRouteChange = (routeId) => {
        setSelectedRouteId(routeId);
        setData('route_id', routeId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/bookings');
    };

    return (
        <AdminLayout>
            <Head title="Create Booking" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Booking</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="student_id" className="mb-2 block text-base font-semibold text-slate-700">Student *</label>
                                    <Select
                                        id="student_id"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Select Student</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id} className="text-gray-900">
                                                {student.name} ({student.parent?.name})
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.student_id} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="route_id" className="mb-2 block text-base font-semibold text-slate-700">Route *</label>
                                    <Select
                                        id="route_id"
                                        value={data.route_id}
                                        onChange={(e) => handleRouteChange(e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">Select Route</option>
                                        {routes.map((route) => (
                                            <option key={route.id} value={route.id} className="text-gray-900">
                                                {route.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.route_id} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="pickup_point_id" className="mb-2 block text-base font-semibold text-slate-700">Pickup Point (Optional)</label>
                                    <Select
                                        id="pickup_point_id"
                                        value={data.pickup_point_id}
                                        onChange={(e) => setData('pickup_point_id', e.target.value)}
                                        className="form-control"
                                        disabled={!selectedRouteId}
                                    >
                                        <option value="">Select Pickup Point</option>
                                        {availablePickupPoints.map((point) => (
                                            <option key={point.id} value={point.id} className="text-gray-900">
                                                {point.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.pickup_point_id} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="dropoff_point_id" className="mb-2 block text-base font-semibold text-slate-700">Dropoff Point (Optional)</label>
                                    <Select
                                        id="dropoff_point_id"
                                        value={data.dropoff_point_id}
                                        onChange={(e) => setData('dropoff_point_id', e.target.value)}
                                        className="form-control"
                                        disabled={!selectedRouteId}
                                    >
                                        <option value="">Select Dropoff Point (Optional)</option>
                                        {availablePickupPoints.map((point) => (
                                            <option key={point.id} value={point.id} className="text-gray-900">
                                                {point.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.dropoff_point_id} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="pickup_address" className="mb-2 block text-base font-semibold text-slate-700">
                                        Pickup Address (Optional - if no point selected)
                                    </label>
                                    <TextInput
                                        id="pickup_address"
                                        type="text"
                                        value={data.pickup_address}
                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                        className="form-control"
                                        placeholder="Enter precise custom pickup address"
                                    />
                                    <InputError message={errors.pickup_address} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="plan_type" className="mb-2 block text-base font-semibold text-slate-700">Plan Type *</label>
                                    <Select
                                        id="plan_type"
                                        value={data.plan_type}
                                        onChange={(e) => setData('plan_type', e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="weekly" className="text-gray-900">Weekly</option>
                                        <option value="monthly" className="text-gray-900">Monthly</option>
                                        <option value="academic_term" className="text-gray-900">Academic Term</option>
                                        <option value="annual" className="text-gray-900">Annual</option>
                                    </Select>
                                    <InputError message={errors.plan_type} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="trip_type" className="mb-2 block text-base font-semibold text-slate-700">Trip Type *</label>
                                    <Select
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
                                        <option value="one_way" className="text-gray-900">One Way</option>
                                        <option value="two_way" className="text-gray-900">Two Way</option>
                                    </Select>
                                    <InputError message={errors.trip_type} className="mt-2" />
                                </div>

                                {data.trip_type === 'one_way' && (
                                    <div>
                                        <label htmlFor="trip_direction" className="mb-2 block text-base font-semibold text-slate-700">Service (one way only)</label>
                                        <Select
                                            id="trip_direction"
                                            value={data.trip_direction}
                                            onChange={(e) => setData('trip_direction', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="pickup_only" className="text-gray-900">Pickup only</option>
                                            <option value="dropoff_only" className="text-gray-900">Dropoff only</option>
                                        </Select>
                                        <InputError message={errors.trip_direction} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="status" className="mb-2 block text-base font-semibold text-slate-700">Status *</label>
                                    <Select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="pending" className="text-gray-900">Pending</option>
                                        <option value="awaiting_approval" className="text-gray-900">Awaiting Approval</option>
                                        <option value="active" className="text-gray-900">Active</option>
                                        <option value="completed" className="text-gray-900">Completed</option>
                                        <option value="expired" className="text-gray-900">Expired</option>
                                        <option value="cancelled" className="text-gray-900">Cancelled</option>
                                    </Select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="start_date" className="mb-2 block text-base font-semibold text-slate-700">Start Date *</label>
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="mb-2 block text-base font-semibold text-slate-700">End Date (Auto-calculated)</label>
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="form-control"
                                            readOnly={!!(data.start_date && data.plan_type)}
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                        {data.start_date && data.plan_type && (
                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                Automatically calculated based on plan type
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link href="/admin/bookings">
                                        <GlassButton variant="secondary" type="button" className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                                            Cancel
                                        </GlassButton>
                                    </Link>
                                    <GlassButton variant="primary" type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Booking'}
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


