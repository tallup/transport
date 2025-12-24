import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ route, drivers, vehicles }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: route.name || '',
        driver_id: route.driver_id || '',
        vehicle_id: route.vehicle_id || '',
        capacity: route.capacity || '',
        active: route.active ?? true,
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
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Edit Route</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Route Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="driver_id" value="Driver" />
                                    <Select
                                        id="driver_id"
                                        value={data.driver_id}
                                        onChange={(e) => setData('driver_id', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="">Select Driver (Optional)</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.name} ({driver.email})
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.driver_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="vehicle_id" value="Vehicle *" />
                                    <Select
                                        id="vehicle_id"
                                        value={data.vehicle_id}
                                        onChange={(e) => handleVehicleChange(e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.license_plate} ({vehicle.type}, Capacity: {vehicle.capacity})
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.vehicle_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="capacity" value="Capacity *" />
                                    <TextInput
                                        id="capacity"
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className="mt-1 block w-full"
                                        min="1"
                                        required
                                        disabled
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Automatically set from vehicle capacity</p>
                                    <InputError message={errors.capacity} className="mt-2" />
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="active"
                                        checked={data.active}
                                        onChange={(e) => setData('active', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="active" value="Active" className="ml-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/routes"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Route'}
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

