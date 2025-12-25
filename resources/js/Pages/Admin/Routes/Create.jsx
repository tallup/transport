import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ drivers, vehicles }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        driver_id: '',
        vehicle_id: '',
        capacity: '',
        active: true,
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
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Create Route</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Route Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="driver_id" className="block text-base font-bold text-white mb-2">
                                            Driver
                                        </label>
                                        <select
                                            id="driver_id"
                                            value={data.driver_id}
                                            onChange={(e) => setData('driver_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        >
                                            <option value="" className="bg-indigo-700">Select Driver (Optional)</option>
                                            {drivers.map((driver) => (
                                                <option key={driver.id} value={driver.id} className="bg-indigo-700">
                                                    {driver.name} ({driver.email})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.driver_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="vehicle_id" className="block text-base font-bold text-white mb-2">
                                            Vehicle *
                                        </label>
                                        <select
                                            id="vehicle_id"
                                            value={data.vehicle_id}
                                            onChange={(e) => handleVehicleChange(e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="" className="bg-indigo-700">Select Vehicle</option>
                                            {vehicles.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id} className="bg-indigo-700">
                                                    {vehicle.license_plate} ({vehicle.type}, Capacity: {vehicle.capacity})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.vehicle_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="capacity" className="block text-base font-bold text-white mb-2">
                                            Capacity *
                                        </label>
                                        <input
                                            id="capacity"
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            min="1"
                                            required
                                            disabled
                                        />
                                        <p className="mt-1 text-sm font-semibold text-white/80">Automatically set from vehicle capacity</p>
                                        <InputError message={errors.capacity} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <Checkbox
                                                id="active"
                                                checked={data.active}
                                                onChange={(e) => setData('active', e.target.checked)}
                                            />
                                            <label htmlFor="active" className="ml-2 text-base font-bold text-white">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/routes"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
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


