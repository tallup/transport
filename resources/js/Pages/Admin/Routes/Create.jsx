import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ drivers, vehicles, schools = [] }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        driver_id: '',
        vehicle_id: '',
        capacity: '',
        service_type: 'both',
        pickup_time: '',
        dropoff_time: '',
        active: true,
        schools: [],
    });

    const selectedVehicle = vehicles.find(v => v.id == data.vehicle_id);

    const handleVehicleChange = (vehicleId) => {
        setData('vehicle_id', vehicleId);
        const vehicle = vehicles.find(v => v.id == vehicleId);
        if (vehicle) {
            setData('capacity', vehicle.capacity);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/routes');
    };

    return (
        <AdminLayout>
            <Head title="Create Route" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Route</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Route Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="driver_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Driver
                                        </label>
                                        <select
                                            id="driver_id"
                                            value={data.driver_id}
                                            onChange={(e) => setData('driver_id', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="">Select Driver (Optional)</option>
                                            {drivers.map((driver) => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name} ({driver.email})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.driver_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="vehicle_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Vehicle *
                                        </label>
                                        <select
                                            id="vehicle_id"
                                            value={data.vehicle_id}
                                            onChange={(e) => handleVehicleChange(e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicles.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.license_plate} ({vehicle.type}, Capacity: {vehicle.capacity})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.vehicle_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="capacity" className="mb-2 block text-base font-semibold text-slate-700">
                                            Capacity *
                                        </label>
                                        <input
                                            id="capacity"
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="form-control"
                                            min="1"
                                            required
                                            disabled
                                        />
                                        <p className="mt-1 text-sm font-medium text-slate-500">Automatically set from vehicle capacity</p>
                                        <InputError message={errors.capacity} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="service_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Service Type *
                                        </label>
                                        <select
                                            id="service_type"
                                            value={data.service_type}
                                            onChange={(e) => setData('service_type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="am">AM Only</option>
                                            <option value="pm">PM Only</option>
                                            <option value="both">Both AM & PM</option>
                                        </select>
                                        <InputError message={errors.service_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="pickup_time" className="mb-2 block text-base font-semibold text-slate-700">
                                            Pickup Time
                                        </label>
                                        <input
                                            id="pickup_time"
                                            type="time"
                                            value={data.pickup_time}
                                            onChange={(e) => setData('pickup_time', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.pickup_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="dropoff_time" className="mb-2 block text-base font-semibold text-slate-700">
                                            Dropoff Time
                                        </label>
                                        <input
                                            id="dropoff_time"
                                            type="time"
                                            value={data.dropoff_time}
                                            onChange={(e) => setData('dropoff_time', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.dropoff_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-base font-semibold text-slate-700">
                                            Schools (Select all that apply)
                                        </label>
                                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            {schools.length > 0 ? (
                                                schools.map((school) => (
                                                    <label key={school.id} className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-white">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.schools?.includes(school.id) || false}
                                                            onChange={(e) => {
                                                                const currentSchools = data.schools || [];
                                                                if (e.target.checked) {
                                                                    setData('schools', [...currentSchools, school.id]);
                                                                } else {
                                                                    setData('schools', currentSchools.filter(id => id !== school.id));
                                                                }
                                                            }}
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="font-medium text-slate-700">{school.name}</span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-500">No schools available. Please add schools first.</p>
                                            )}
                                        </div>
                                        <InputError message={errors.schools} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <Checkbox
                                                id="active"
                                                checked={data.active}
                                                onChange={(e) => setData('active', e.target.checked)}
                                            />
                                            <label htmlFor="active" className="ml-2 text-base font-semibold text-slate-700">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/routes"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Route'}
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


