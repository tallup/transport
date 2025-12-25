import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
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
        dropoff_point_id: '',
        plan_type: 'weekly',
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Create Booking</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="student_id" value="Student *" />
                                    <Select
                                        id="student_id"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="">Select Student</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} ({student.parent?.name})
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.student_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="route_id" value="Route *" />
                                    <Select
                                        id="route_id"
                                        value={data.route_id}
                                        onChange={(e) => handleRouteChange(e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="">Select Route</option>
                                        {routes.map((route) => (
                                            <option key={route.id} value={route.id}>
                                                {route.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.route_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="pickup_point_id" value="Pickup Point *" />
                                    <Select
                                        id="pickup_point_id"
                                        value={data.pickup_point_id}
                                        onChange={(e) => setData('pickup_point_id', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                        disabled={!selectedRouteId}
                                    >
                                        <option value="">Select Pickup Point</option>
                                        {availablePickupPoints.map((point) => (
                                            <option key={point.id} value={point.id}>
                                                {point.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.pickup_point_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="dropoff_point_id" value="Dropoff Point (Optional)" />
                                    <Select
                                        id="dropoff_point_id"
                                        value={data.dropoff_point_id}
                                        onChange={(e) => setData('dropoff_point_id', e.target.value)}
                                        className="mt-1 block w-full"
                                        disabled={!selectedRouteId}
                                    >
                                        <option value="">Select Dropoff Point (Optional)</option>
                                        {availablePickupPoints.map((point) => (
                                            <option key={point.id} value={point.id}>
                                                {point.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.dropoff_point_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="plan_type" value="Plan Type *" />
                                    <Select
                                        id="plan_type"
                                        value={data.plan_type}
                                        onChange={(e) => setData('plan_type', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="bi_weekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="semester">Semester</option>
                                        <option value="annual">Annual</option>
                                    </Select>
                                    <InputError message={errors.plan_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <Select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Start Date *" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="end_date" value="End Date" />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/bookings"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Booking'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


