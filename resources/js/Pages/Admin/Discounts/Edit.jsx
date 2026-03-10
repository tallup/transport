import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ discount, routes }) {
    const { data, setData, put, processing, errors } = useForm({
        name: discount.name || '',
        type: discount.type || 'percentage',
        value: discount.value ?? '',
        start_date: discount.start_date ? discount.start_date.slice(0, 10) : '',
        end_date: discount.end_date ? discount.end_date.slice(0, 10) : '',
        scope: discount.scope || 'all',
        route_id: discount.route_id || '',
        plan_type: discount.plan_type || '',
        min_children: discount.min_children != null ? String(discount.min_children) : '2',
        active: discount.active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/discounts/${discount.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Discount" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit Discount</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                    <div>
                                        <label htmlFor="type" className="block text-base font-bold text-white mb-2">
                                            Discount type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="percentage" className="bg-indigo-700">Percentage off</option>
                                            <option value="fixed" className="bg-indigo-700">Fixed amount off</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="value" className="block text-base font-bold text-white mb-2">
                                            Value *
                                        </label>
                                        <div className="mt-1 relative flex items-center">
                                            {data.type === 'fixed' && (
                                                <span className="absolute left-3 text-white font-semibold">$</span>
                                            )}
                                            <input
                                                id="value"
                                                type="number"
                                                step={data.type === 'percentage' ? 1 : 0.01}
                                                min="0"
                                                max={data.type === 'percentage' ? 100 : undefined}
                                                value={data.value}
                                                onChange={(e) => setData('value', e.target.value)}
                                                className={`block w-full glass-input text-white placeholder-gray-300 ${data.type === 'fixed' ? 'pl-7' : ''}`}
                                                required
                                            />
                                            {data.type === 'percentage' && (
                                                <span className="absolute right-3 text-white font-semibold">%</span>
                                            )}
                                        </div>
                                        <InputError message={errors.value} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="start_date" className="block text-base font-bold text-white mb-2">
                                            Start date
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        />
                                        <InputError message={errors.start_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="block text-base font-bold text-white mb-2">
                                            End date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        />
                                        <InputError message={errors.end_date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="scope" className="block text-base font-bold text-white mb-2">
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
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="all" className="bg-indigo-700">All bookings</option>
                                            <option value="route" className="bg-indigo-700">Specific route</option>
                                            <option value="plan_type" className="bg-indigo-700">Specific plan type</option>
                                            <option value="multi_child" className="bg-indigo-700">Multi-child / Sibling</option>
                                        </select>
                                        <InputError message={errors.scope} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    {data.scope === 'multi_child' && (
                                        <div className="md:col-span-2">
                                            <label htmlFor="min_children" className="block text-base font-bold text-white mb-2">
                                                Minimum number of children *
                                            </label>
                                            <input
                                                id="min_children"
                                                type="number"
                                                min="2"
                                                max="255"
                                                value={data.min_children}
                                                onChange={(e) => setData('min_children', e.target.value)}
                                                className="mt-1 block w-full glass-input text-white"
                                                required
                                            />
                                            <p className="mt-1 text-sm text-white/80">Discount applies when parent books for this many children or more</p>
                                            <InputError message={errors.min_children} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    {data.scope === 'route' && (
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
                                                <option value="" className="bg-indigo-700">Select route</option>
                                                {routes.map((route) => (
                                                    <option key={route.id} value={route.id} className="bg-indigo-700">
                                                        {route.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    )}

                                    {data.scope === 'plan_type' && (
                                        <div className="md:col-span-2">
                                            <label htmlFor="plan_type" className="block text-base font-bold text-white mb-2">
                                                Plan type *
                                            </label>
                                            <select
                                                id="plan_type"
                                                value={data.plan_type}
                                                onChange={(e) => setData('plan_type', e.target.value)}
                                                className="mt-1 block w-full glass-input text-white"
                                                required
                                            >
                                                <option value="" className="bg-indigo-700">Select plan type</option>
                                                <option value="weekly" className="bg-indigo-700">Weekly</option>
                                                <option value="monthly" className="bg-indigo-700">Monthly</option>
                                                <option value="academic_term" className="bg-indigo-700">Academic Term</option>
                                                <option value="annual" className="bg-indigo-700">Annual</option>
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
                                            <label htmlFor="active" className="ml-2 text-base font-bold text-white">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/discounts"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Discount'}
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
