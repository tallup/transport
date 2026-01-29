import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ pricingRules }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this pricing rule?')) {
            setDeleting(id);
            router.delete(`/admin/pricing-rules/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const formatPlanType = (planType) => {
        return planType.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Pricing Rules" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Pricing Rules</h2>
                                <Link
                                    href="/admin/pricing-rules/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Pricing Rule
                                </Link>
                            </div>

                            {pricingRules.data && pricingRules.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/20">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Plan Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Route
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Vehicle Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Currency
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Active
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                            {pricingRules.data.map((rule) => (
                                                <tr key={rule.id} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                            {formatPlanType(rule.plan_type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {rule.route?.name || 'Global'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {rule.vehicle_type ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/30 text-gray-200 border border-gray-400/50 capitalize">
                                                                {rule.vehicle_type}
                                                            </span>
                                                        ) : (
                                                            <span className="text-base font-semibold text-white/90">All</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        ${parseFloat(rule.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {rule.currency}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                            rule.active ? 'bg-green-500/30 text-green-100 border-green-400/50' : 'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                                        }`}>
                                                            {rule.active ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                                                        <Link
                                                            href={`/admin/pricing-rules/${rule.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4 font-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(rule.id)}
                                                            disabled={deleting === rule.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50 font-semibold"
                                                        >
                                                            {deleting === rule.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white text-lg font-semibold">No pricing rules found.</p>
                            )}

                            {pricingRules.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {pricingRules.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-lg ${
                                                    link.active
                                                        ? 'glass-button text-white'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


