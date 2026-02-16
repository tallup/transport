import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Edit({ school }) {
    const { data, setData, put, processing, errors } = useForm({
        name: school.name || '',
        address: school.address || '',
        phone: school.phone || '',
        active: school.active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/schools/${school.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit School" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-brand-primary mb-6">Edit School</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-base font-bold text-brand-primary mb-2">
                                            School Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-white/40"
                                            placeholder="e.g. Jefferson Elementary"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-base font-bold text-brand-primary mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-white/40"
                                            placeholder="Full street address"
                                        />
                                        <InputError message={errors.address} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-base font-bold text-brand-primary mb-2">
                                            Phone
                                        </label>
                                        <input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-white/40"
                                            placeholder="555-1234"
                                        />
                                        <InputError message={errors.phone} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="active" className="block text-base font-bold text-brand-primary mb-2">
                                            Status
                                        </label>
                                        <select
                                            id="active"
                                            value={data.active ? 'true' : 'false'}
                                            onChange={(e) => setData('active', e.target.value === 'true')}
                                            className="mt-1 block w-full glass-input text-white"
                                        >
                                            <option value="true" className="bg-brand-primary">Active</option>
                                            <option value="false" className="bg-brand-primary">Inactive</option>
                                        </select>
                                        <InputError message={errors.active} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-yellow-400/40">
                                    <Link
                                        href="/admin/schools"
                                        className="px-4 py-2 bg-white/10 border-2 border-yellow-400/60 rounded-xl text-brand-primary font-bold hover:bg-white/20 hover:border-yellow-400 transition-all"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
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
