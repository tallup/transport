import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Edit({ vehicle }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        type: vehicle.type || 'bus',
        license_plate: vehicle.license_plate || '',
        registration_number: vehicle.registration_number || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        capacity: vehicle.capacity || '',
        last_maintenance_date: vehicle.last_maintenance_date || '',
        next_maintenance_date: vehicle.next_maintenance_date || '',
        status: vehicle.status || 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/vehicles/${vehicle.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Vehicle" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit Vehicle</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="type" className="block text-base font-bold text-white mb-2">
                                            Vehicle Type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="bus" className="bg-indigo-700">Bus</option>
                                            <option value="van" className="bg-indigo-700">Van</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="license_plate" className="block text-base font-bold text-white mb-2">
                                            License Plate *
                                        </label>
                                        <input
                                            id="license_plate"
                                            type="text"
                                            value={data.license_plate}
                                            onChange={(e) => setData('license_plate', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.license_plate} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="registration_number" className="block text-base font-bold text-white mb-2">
                                            Registration Number *
                                        </label>
                                        <input
                                            id="registration_number"
                                            type="text"
                                            value={data.registration_number}
                                            onChange={(e) => setData('registration_number', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.registration_number} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="make" className="block text-base font-bold text-white mb-2">
                                            Make *
                                        </label>
                                        <input
                                            id="make"
                                            type="text"
                                            value={data.make}
                                            onChange={(e) => setData('make', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.make} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="model" className="block text-base font-bold text-white mb-2">
                                            Model *
                                        </label>
                                        <input
                                            id="model"
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.model} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="year" className="block text-base font-bold text-white mb-2">
                                            Year *
                                        </label>
                                        <input
                                            id="year"
                                            type="number"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            required
                                        />
                                        <InputError message={errors.year} className="mt-2 text-red-300 font-semibold" />
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
                                        />
                                        <InputError message={errors.capacity} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="last_maintenance_date" className="block text-base font-bold text-white mb-2">
                                            Last Maintenance Date
                                        </label>
                                        <input
                                            id="last_maintenance_date"
                                            type="date"
                                            value={data.last_maintenance_date ? (typeof data.last_maintenance_date === 'string' ? data.last_maintenance_date.split('T')[0] : data.last_maintenance_date) : ''}
                                            onChange={(e) => setData('last_maintenance_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        />
                                        <InputError message={errors.last_maintenance_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="next_maintenance_date" className="block text-base font-bold text-white mb-2">
                                            Next Maintenance Date
                                        </label>
                                        <input
                                            id="next_maintenance_date"
                                            type="date"
                                            value={data.next_maintenance_date ? (typeof data.next_maintenance_date === 'string' ? data.next_maintenance_date.split('T')[0] : data.next_maintenance_date) : ''}
                                            onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        />
                                        <InputError message={errors.next_maintenance_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-base font-bold text-white mb-2">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="active" className="bg-indigo-700">Active</option>
                                            <option value="maintenance" className="bg-indigo-700">Maintenance</option>
                                            <option value="retired" className="bg-indigo-700">Retired</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/vehicles"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Vehicle'}
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


