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
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit Vehicle</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Vehicle Type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="bus">Bus</option>
                                            <option value="van">Van</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="license_plate" className="mb-2 block text-base font-semibold text-slate-700">
                                            License Plate *
                                        </label>
                                        <input
                                            id="license_plate"
                                            type="text"
                                            value={data.license_plate}
                                            onChange={(e) => setData('license_plate', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.license_plate} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="registration_number" className="mb-2 block text-base font-semibold text-slate-700">
                                            Registration Number *
                                        </label>
                                        <input
                                            id="registration_number"
                                            type="text"
                                            value={data.registration_number}
                                            onChange={(e) => setData('registration_number', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.registration_number} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="make" className="mb-2 block text-base font-semibold text-slate-700">
                                            Make *
                                        </label>
                                        <input
                                            id="make"
                                            type="text"
                                            value={data.make}
                                            onChange={(e) => setData('make', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.make} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="model" className="mb-2 block text-base font-semibold text-slate-700">
                                            Model *
                                        </label>
                                        <input
                                            id="model"
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.model} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="year" className="mb-2 block text-base font-semibold text-slate-700">
                                            Year *
                                        </label>
                                        <input
                                            id="year"
                                            type="number"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            className="form-control"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            required
                                        />
                                        <InputError message={errors.year} className="mt-2 text-red-300 font-semibold" />
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
                                        />
                                        <InputError message={errors.capacity} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="last_maintenance_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            Last Maintenance Date
                                        </label>
                                        <input
                                            id="last_maintenance_date"
                                            type="date"
                                            value={data.last_maintenance_date ? (typeof data.last_maintenance_date === 'string' ? data.last_maintenance_date.split('T')[0] : data.last_maintenance_date) : ''}
                                            onChange={(e) => setData('last_maintenance_date', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.last_maintenance_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="next_maintenance_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            Next Maintenance Date
                                        </label>
                                        <input
                                            id="next_maintenance_date"
                                            type="date"
                                            value={data.next_maintenance_date ? (typeof data.next_maintenance_date === 'string' ? data.next_maintenance_date.split('T')[0] : data.next_maintenance_date) : ''}
                                            onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.next_maintenance_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="mb-2 block text-base font-semibold text-slate-700">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="retired">Retired</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/vehicles"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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


