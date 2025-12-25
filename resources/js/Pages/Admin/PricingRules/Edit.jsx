import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ pricingRule, routes }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        plan_type: pricingRule.plan_type || 'weekly',
        route_id: pricingRule.route_id || '',
        vehicle_type: pricingRule.vehicle_type || '',
        amount: pricingRule.amount || '',
        currency: pricingRule.currency || 'USD',
        active: pricingRule.active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/pricing-rules/${pricingRule.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Pricing Rule" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Edit Pricing Rule</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="plan_type" value="Plan Type *" />
                                    <Select
                                        id="plan_type"
                                        value={data.plan_type}
                                        onChange={(e) => setData('plan_type', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="bi_weekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="semester">Semester</option>
                                        <option value="annual">Annual</option>
                                    </Select>
                                    <InputError message={errors.plan_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="route_id" value="Route (Optional)" />
                                    <Select
                                        id="route_id"
                                        value={data.route_id}
                                        onChange={(e) => setData('route_id', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="">Global (All Routes)</option>
                                        {routes.map((route) => (
                                            <option key={route.id} value={route.id}>
                                                {route.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <p className="mt-1 text-sm text-gray-500">Leave empty for global pricing</p>
                                    <InputError message={errors.route_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="vehicle_type" value="Vehicle Type (Optional)" />
                                    <Select
                                        id="vehicle_type"
                                        value={data.vehicle_type}
                                        onChange={(e) => setData('vehicle_type', e.target.value)}
                                        className="mt-1 block w-full"
                                    >
                                        <option value="">All Vehicles</option>
                                        <option value="bus">Bus</option>
                                        <option value="van">Van</option>
                                    </Select>
                                    <p className="mt-1 text-sm text-gray-500">Leave empty for all vehicles</p>
                                    <InputError message={errors.vehicle_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="amount" value="Amount *" />
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="block w-full pl-7"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="currency" value="Currency *" />
                                    <TextInput
                                        id="currency"
                                        type="text"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value.toUpperCase())}
                                        className="mt-1 block w-full"
                                        maxLength="3"
                                        required
                                    />
                                    <InputError message={errors.currency} className="mt-2" />
                                </div>

                                <div className="flex items-center">
                                    <Checkbox
                                        id="active"
                                        checked={data.active}
                                        onChange={(e) => setData('active', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="active" value="Active" className="ml-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/pricing-rules"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Pricing Rule'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


