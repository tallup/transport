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
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Pickup Point</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="route_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Route *
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => setData('route_id', e.target.value)}
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

                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Name *
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

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="mb-2 block text-base font-semibold text-slate-700">
                                            Address *
                                        </label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="form-control"
                                            rows="3"
                                            required
                                        />
                                        <InputError message={errors.address} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="latitude" className="mb-2 block text-base font-semibold text-slate-700">
                                            Latitude
                                        </label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.latitude} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="longitude" className="mb-2 block text-base font-semibold text-slate-700">
                                            Longitude
                                        </label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="0.00000001"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.longitude} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="sequence_order" className="mb-2 block text-base font-semibold text-slate-700">
                                            Sequence Order *
                                        </label>
                                        <input
                                            id="sequence_order"
                                            type="number"
                                            value={data.sequence_order}
                                            onChange={(e) => setData('sequence_order', e.target.value)}
                                            className="form-control"
                                            min="0"
                                            required
                                        />
                                        <InputError message={errors.sequence_order} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="pickup_time" className="mb-2 block text-base font-semibold text-slate-700">
                                            Pickup Time *
                                        </label>
                                        <input
                                            id="pickup_time"
                                            type="time"
                                            value={data.pickup_time}
                                            onChange={(e) => setData('pickup_time', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.pickup_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="dropoff_time" className="mb-2 block text-base font-semibold text-slate-700">
                                            Dropoff Time *
                                        </label>
                                        <input
                                            id="dropoff_time"
                                            type="time"
                                            value={data.dropoff_time}
                                            onChange={(e) => setData('dropoff_time', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.dropoff_time} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/pickup-points"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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


