import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ routes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'percentage',
        value: '',
        start_date: '',
        end_date: '',
        scope: 'all',
        route_id: '',
        plan_type: '',
        min_children: '2',
        active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/discounts');
    };

    return (
        <AdminLayout>
            <Head title="Create Discount" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Discount</h2>
                            <p className="mb-6 text-slate-500">Time-based promotion applied to bookings in the selected date range and scope.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            placeholder="e.g. March 2026 promo"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Discount type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="percentage">Percentage off</option>
                                            <option value="fixed">Fixed amount off</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="value" className="mb-2 block text-base font-semibold text-slate-700">
                                            Value *
                                        </label>
                                        <div className="mt-1 relative flex items-center">
                                            {data.type === 'fixed' && (
                                                <span className="absolute left-3 font-semibold text-slate-500">$</span>
                                            )}
                                            <input
                                                id="value"
                                                type="number"
                                                step={data.type === 'percentage' ? 1 : 0.01}
                                                min="0"
                                                max={data.type === 'percentage' ? 100 : undefined}
                                                value={data.value}
                                                onChange={(e) => setData('value', e.target.value)}
                                                className={`form-control ${data.type === 'fixed' ? 'pl-7' : ''}`}
                                                required
                                            />
                                            {data.type === 'percentage' && (
                                                <span className="absolute right-3 font-semibold text-slate-500">%</span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {data.type === 'percentage' ? '0–100' : 'Amount in dollars'}
                                        </p>
                                        <InputError message={errors.value} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="start_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            Start date
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.start_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="mb-2 block text-base font-semibold text-slate-700">
                                            End date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="form-control"
                                        />
                                        <InputError message={errors.end_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="scope" className="mb-2 block text-base font-semibold text-slate-700">
                                            Scope *
                                        </label>
                                        <select
                                            id="scope"
                                            value={data.scope}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setData('scope', v);
                                                if (v !== 'route') setData('route_id', '');
                                                if (v !== 'plan_type') setData('plan_type', '');
                                                if (v === 'multi_child') setData('min_children', '2');
                                            }}
                                            className="form-control"
                                            required
                                        >
                                            <option value="all">All bookings</option>
                                            <option value="route">Specific route</option>
                                            <option value="plan_type">Specific plan type</option>
                                            <option value="multi_child">Multi-child / Sibling</option>
                                        </select>
                                        <p className="mt-1 text-sm text-slate-500">Who gets this discount</p>
                                        <InputError message={errors.scope} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    {data.scope === 'multi_child' && (
                                        <div className="md:col-span-2">
                                            <label htmlFor="min_children" className="mb-2 block text-base font-semibold text-slate-700">
                                                Minimum number of children *
                                            </label>
                                            <input
                                                id="min_children"
                                                type="number"
                                                min="2"
                                                max="255"
                                                value={data.min_children}
                                                onChange={(e) => setData('min_children', e.target.value)}
                                                className="form-control"
                                                required
                                            />
                                            <p className="mt-1 text-sm text-slate-500">Discount applies when parent books for this many children or more (e.g. 2 = 2+ children)</p>
                                            <InputError message={errors.min_children} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    {data.scope === 'route' && (
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
                                                <option value="">Select route</option>
                                                {routes.map((route) => (
                                                    <option key={route.id} value={route.id}>
                                                        {route.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    {data.scope === 'plan_type' && (
                                        <div className="md:col-span-2">
                                            <label htmlFor="plan_type" className="mb-2 block text-base font-semibold text-slate-700">
                                                Plan type *
                                            </label>
                                            <select
                                                id="plan_type"
                                                value={data.plan_type}
                                                onChange={(e) => setData('plan_type', e.target.value)}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select plan type</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="academic_term">Academic Term</option>
                                                <option value="annual">Annual</option>
                                            </select>
                                            <InputError message={errors.plan_type} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <Checkbox
                                                id="active"
                                                checked={data.active}
                                                onChange={(e) => setData('active', e.target.checked)}
                                            />
                                            <label htmlFor="active" className="ml-2 text-base font-semibold text-slate-700">
                                                Active (discount will be applied when dates and scope match)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/discounts"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Discount'}
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
