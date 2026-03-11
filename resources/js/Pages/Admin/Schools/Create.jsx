import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        phone: '',
        active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/schools');
    };

    return (
        <AdminLayout>
            <Head title="Create School" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create School</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            School Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="form-control"
                                            placeholder="e.g. Jefferson Elementary"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="mb-2 block text-base font-semibold text-slate-700">
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="form-control"
                                            placeholder="Full street address"
                                        />
                                        <InputError message={errors.address} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="mb-2 block text-base font-semibold text-slate-700">
                                            Phone
                                        </label>
                                        <input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="form-control"
                                            placeholder="555-1234"
                                        />
                                        <InputError message={errors.phone} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="active" className="mb-2 block text-base font-semibold text-slate-700">
                                            Status
                                        </label>
                                        <select
                                            id="active"
                                            value={data.active ? 'true' : 'false'}
                                            onChange={(e) => setData('active', e.target.value === 'true')}
                                            className="form-control"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                        <InputError message={errors.active} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-4 border-t border-slate-200 pt-6">
                                    <Link
                                        href="/admin/schools"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create School'}
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
