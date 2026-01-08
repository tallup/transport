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
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Create Pricing Rule</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="plan_type" className="block text-base font-bold text-white mb-2">
                                            Plan Type *
                                        </label>
                                        <select
                                            id="plan_type"
                                            value={data.plan_type}
                                            onChange={(e) => setData('plan_type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="weekly" className="bg-indigo-700">Weekly</option>
                                            <option value="bi_weekly" className="bg-indigo-700">Bi-Weekly</option>
                                            <option value="monthly" className="bg-indigo-700">Monthly</option>
                                            <option value="academic_term" className="bg-indigo-700">Academic Term</option>
                                            <option value="annual" className="bg-indigo-700">Annual</option>
                                        </select>
                                        <InputError message={errors.plan_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="route_id" className="block text-base font-bold text-white mb-2">
                                            Route (Optional)
                                        </label>
                                        <select
                                            id="route_id"
                                            value={data.route_id}
                                            onChange={(e) => setData('route_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        >
                                            <option value="" className="bg-indigo-700">Global (All Routes)</option>
                                            {routes.map((route) => (
                                                <option key={route.id} value={route.id} className="bg-indigo-700">
                                                    {route.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-sm font-semibold text-white/80">Leave empty for global pricing</p>
                                        <InputError message={errors.route_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="vehicle_type" className="block text-base font-bold text-white mb-2">
                                            Vehicle Type (Optional)
                                        </label>
                                        <select
                                            id="vehicle_type"
                                            value={data.vehicle_type}
                                            onChange={(e) => setData('vehicle_type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                        >
                                            <option value="" className="bg-indigo-700">All Vehicles</option>
                                            <option value="bus" className="bg-indigo-700">Bus</option>
                                            <option value="van" className="bg-indigo-700">Van</option>
                                        </select>
                                        <p className="mt-1 text-sm font-semibold text-white/80">Leave empty for all vehicles</p>
                                        <InputError message={errors.vehicle_type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="amount" className="block text-base font-bold text-white mb-2">
                                            Amount *
                                        </label>
                                        <div className="mt-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-white sm:text-sm font-semibold">$</span>
                                            </div>
                                            <input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="block w-full glass-input text-white placeholder-gray-300 pl-7"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.amount} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="currency" className="block text-base font-bold text-white mb-2">
                                            Currency *
                                        </label>
                                        <input
                                            id="currency"
                                            type="text"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value.toUpperCase())}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
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
                                            <label htmlFor="active" className="ml-2 text-base font-bold text-white">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/pricing-rules"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
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


