import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

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
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Create Pickup Point</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="route_id" className="block text-base font-bold text-white mb-2">
                                            Route *
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => setData('route_id', e.target.value)}
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

                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Name *
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

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-base font-bold text-white mb-2">
                                            Address *
                                        </label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            rows="3"
                                            required
                                        />
                                        <InputError message={errors.address} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="latitude" className="block text-base font-bold text-white mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                        />
                                        <InputError message={errors.latitude} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="longitude" className="block text-base font-bold text-white mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                        />
                                        <InputError message={errors.longitude} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="sequence_order" className="block text-base font-bold text-white mb-2">
                                            Sequence Order *
                                        </label>
                                        <input
                                            id="sequence_order"
                                            type="number"
                                            value={data.sequence_order}
                                            onChange={(e) => setData('sequence_order', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            min="0"
                                            required
                                        />
                                        <InputError message={errors.sequence_order} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="pickup_time" className="block text-base font-bold text-white mb-2">
                                            Pickup Time *
                                        </label>
                                        <input
                                            id="pickup_time"
                                            type="time"
                                            value={data.pickup_time}
                                            onChange={(e) => setData('pickup_time', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        />
                                        <InputError message={errors.pickup_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="dropoff_time" className="block text-base font-bold text-white mb-2">
                                            Dropoff Time *
                                        </label>
                                        <input
                                            id="dropoff_time"
                                            type="time"
                                            value={data.dropoff_time}
                                            onChange={(e) => setData('dropoff_time', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        />
                                        <InputError message={errors.dropoff_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/pickup-points"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Pickup Point'}
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


