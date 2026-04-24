import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ route, drivers, vehicles, schools = [] }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: route.name || '',
        driver_id: route.driver_id || '',
        vehicle_id: route.vehicle_id || '',
        capacity: route.capacity || '',
        service_type: route.service_type || 'both',
        pickup_time: route.pickup_time ? (route.pickup_time.includes('T') ? route.pickup_time.split('T')[1].substring(0, 5) : route.pickup_time.substring(0, 5)) : '',
        dropoff_time: route.dropoff_time ? (route.dropoff_time.includes('T') ? route.dropoff_time.split('T')[1].substring(0, 5) : route.dropoff_time.substring(0, 5)) : '',
        active: route.active ?? true,
        schools: route.schools?.map(s => s.id) || [],
    });

    const handleVehicleChange = (vehicleId) => {
        setData('vehicle_id', vehicleId);
        const vehicle = vehicles.find(v => v.id == vehicleId);
        if (vehicle) {
            setData('capacity', vehicle.capacity);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/routes/${route.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Route" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit Route</h2>
                            
                            {route.capacity > 0 && typeof route.occupancy_percentage !== 'undefined' && (
                                <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                                    route.occupancy_percentage >= 100 ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                    route.occupancy_percentage >= 85 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                    'bg-emerald-50 border-emerald-200 text-emerald-800'
                                }`}>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                        route.occupancy_percentage >= 100 ? 'bg-rose-100 text-rose-600' :
                                        route.occupancy_percentage >= 85 ? 'bg-amber-100 text-amber-600' :
                                        'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {route.occupancy_percentage >= 100 
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            }
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">
                                            {route.occupancy_percentage >= 100 ? 'Capacity Full!' : 
                                             route.occupancy_percentage >= 85 ? 'Approaching Capacity' : 'Healthy Capacity'}
                                        </h3>
                                        <p className="text-sm font-medium opacity-90 mt-0.5">
                                            This route currently has {route.active_bookings_count} active bookings out of {route.capacity} seats ({route.occupancy_percentage}% filled).
                                        </p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="w-32 h-2.5 bg-white/50 rounded-full overflow-hidden border border-black/5">
                                            <div 
                                                className={`h-full transition-all duration-500 ${
                                                    route.occupancy_percentage >= 100 ? 'bg-rose-500' :
                                                    route.occupancy_percentage >= 85 ? 'bg-amber-500' :
                                                    'bg-emerald-500'
                                                }`}
                                                style={{ width: `${Math.min(100, route.occupancy_percentage)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            <option value="am">One Way Route Pickup Only</option>
                                            <option value="pm">One Way Route Dropoff Only</option>
                                            <option value="both">Two Way Pickup and Dropoff</option>
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
                                        {processing ? 'Updating...' : 'Update Route'}
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
