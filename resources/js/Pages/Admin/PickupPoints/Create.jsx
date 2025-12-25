import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';

export default function Create({ routes }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        route_id: '',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        sequence_order: 0,
        pickup_time: '',
        dropoff_time: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/pickup-points');
    };

    return (
        <AdminLayout>
            <Head title="Create Pickup Point" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Create Pickup Point</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="route_id" value="Route *" />
                                    <Select
                                        id="route_id"
                                        value={data.route_id}
                                        onChange={(e) => setData('route_id', e.target.value)}
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
                                    <InputLabel htmlFor="name" value="Name *" />
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
                                    <InputLabel htmlFor="address" value="Address *" />
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="latitude" value="Latitude" />
                                        <TextInput
                                            id="latitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.latitude} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="longitude" value="Longitude" />
                                        <TextInput
                                            id="longitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.longitude} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="sequence_order" value="Sequence Order *" />
                                    <TextInput
                                        id="sequence_order"
                                        type="number"
                                        value={data.sequence_order}
                                        onChange={(e) => setData('sequence_order', e.target.value)}
                                        className="mt-1 block w-full"
                                        min="0"
                                        required
                                    />
                                    <InputError message={errors.sequence_order} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="pickup_time" value="Pickup Time *" />
                                        <TextInput
                                            id="pickup_time"
                                            type="time"
                                            value={data.pickup_time}
                                            onChange={(e) => setData('pickup_time', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.pickup_time} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="dropoff_time" value="Dropoff Time *" />
                                        <TextInput
                                            id="dropoff_time"
                                            type="time"
                                            value={data.dropoff_time}
                                            onChange={(e) => setData('dropoff_time', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.dropoff_time} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/pickup-points"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Pickup Point'}
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


