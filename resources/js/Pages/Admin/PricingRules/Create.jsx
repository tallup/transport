import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ routes }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        plan_type: 'weekly',
        trip_type: 'two_way',
        route_id: '',
        vehicle_type: '',
        amount: '',
        currency: 'USD',
        active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/pricing-rules');
    };

    return (
        <AdminLayout>
            <Head title="Create Pricing Rule" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Pricing Rule</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="plan_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Plan Type *
                                        </label>
                                        <select
                                            id="plan_type"
                                            value={data.plan_type}
                                            onChange={(e) => setData('plan_type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="academic_term">Academic Term</option>
                                            <option value="annual">Annual</option>
                                        </select>
                                        <InputError message={errors.plan_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="trip_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Trip Type *
                                        </label>
                                        <select
                                            id="trip_type"
                                            value={data.trip_type}
                                            onChange={(e) => setData('trip_type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="one_way">One Way</option>
                                            <option value="two_way">Two Way</option>
                                        </select>
                                        <p className="mt-1 text-sm font-medium text-slate-500">One way: pick up only or drop off only. Two way: both pick up and drop off</p>
                                        <InputError message={errors.trip_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="route_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Route (Optional)
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => setData('route_id', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="">Global (All Routes)</option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id}>
                                                    {route.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-sm font-medium text-slate-500">Leave empty for global pricing</p>
                                        <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="vehicle_type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Vehicle Type (Optional)
                                        </label>
                                        <select
                                            id="vehicle_type"
                                            value={data.vehicle_type}
                                            onChange={(e) => setData('vehicle_type', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="">All Vehicles</option>
                                            <option value="bus">Bus</option>
                                            <option value="van">Van</option>
                                        </select>
                                        <p className="mt-1 text-sm font-medium text-slate-500">Leave empty for all vehicles</p>
                                        <InputError message={errors.vehicle_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="amount" className="mb-2 block text-base font-semibold text-slate-700">
                                            Amount *
                                        </label>
                                        <div className="mt-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-sm font-semibold text-slate-500">$</span>
                                            </div>
                                            <input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="form-control pl-7"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.amount} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="currency" className="mb-2 block text-base font-semibold text-slate-700">
                                            Currency *
                                        </label>
                                        <input
                                            id="currency"
                                            type="text"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value.toUpperCase())}
                                            className="form-control"
                                            maxLength="3"
                                            required
                                        />
                                        <InputError message={errors.currency} className="mt-2 text-red-300 font-semibold" />
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
                                        href="/admin/pricing-rules"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Pricing Rule'}
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


