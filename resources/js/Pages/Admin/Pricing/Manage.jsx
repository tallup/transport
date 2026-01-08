import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import { useState } from 'react';

export default function ManagePricing({ pricingRules, planTypes }) {
    const { auth } = usePage().props;
    const [toggling, setToggling] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const handleToggleActive = (ruleId) => {
        setToggling(ruleId);
        router.post(`/admin/pricing-rules/${ruleId}/toggle-active`, {}, {
            onFinish: () => setToggling(null),
        });
    };

    const handleDelete = (ruleId) => {
        if (confirm('Are you sure you want to delete this pricing rule?')) {
            setDeleting(ruleId);
            router.delete(`/admin/pricing-rules/${ruleId}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getScopeBadge = (rule) => {
        if (rule.route_id) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Route: {rule.route_name}
                </span>
            );
        }
        if (rule.vehicle_type) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Vehicle: {rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1)}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Global
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Manage Pricing" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Pricing Management</h2>
                            <p className="text-sm text-white/80 mt-1">
                                Manage pricing rules for all plan types. Pricing follows priority: Route-specific &gt; Vehicle-specific &gt; Global
                            </p>
                        </div>
                        <Link
                            href="/admin/pricing-rules/create"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Pricing Rule
                        </Link>
                    </div>

                    {Object.entries(planTypes).map(([planTypeKey, planTypeLabel]) => {
                        const rules = pricingRules[planTypeKey] || [];
                        
                        return (
                            <GlassCard key={planTypeKey} className="mb-6">
                                <div className="p-6">
                                    <div className="px-6 py-4 border-b border-white/20 mb-4">
                                        <h3 className="text-lg font-semibold text-white">{planTypeLabel} Pricing</h3>
                                    </div>
                                    
                                    {rules.length === 0 ? (
                                        <div className="text-center py-8 text-white/60">
                                            <p>No pricing rules configured for {planTypeLabel}.</p>
                                            <Link
                                                href={`/admin/pricing-rules/create?plan_type=${planTypeKey}`}
                                                className="text-blue-300 hover:text-blue-100 underline mt-2 inline-block"
                                            >
                                                Create one now
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-white/20">
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Scope</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Vehicle Type</th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase">Price</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase">Status</th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rules.map((rule) => (
                                                        <tr key={rule.id} className="border-b border-white/10 hover:bg-white/5 transition">
                                                            <td className="px-4 py-3">
                                                                {getScopeBadge(rule)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-white/90">
                                                                {rule.vehicle_type ? rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1) : 'All'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                                                                {rule.currency} {parseFloat(rule.amount).toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {rule.active ? (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                        Active
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                        Inactive
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <Link
                                                                        href={`/admin/pricing-rules/${rule.id}/edit`}
                                                                        className="text-blue-300 dark:text-blue-400 hover:text-blue-200 dark:hover:text-blue-300"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                        </svg>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleToggleActive(rule.id)}
                                                                        disabled={toggling === rule.id}
                                                                        className="text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 disabled:opacity-50"
                                                                    >
                                                                        {rule.active ? (
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(rule.id)}
                                                                        disabled={deleting === rule.id}
                                                                        className="text-red-400 dark:text-red-500 hover:text-red-300 dark:hover:text-red-400 disabled:opacity-50"
                                                                    >
                                                                        {deleting === rule.id ? (
                                                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        );
                    })}

                    <GlassCard className="bg-blue-500/10 border-blue-400/30">
                        <div className="p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-200">Pricing Priority</h3>
                                    <div className="mt-2 text-sm text-blue-300">
                                        <p>Pricing is determined by the following priority order:</p>
                                        <ol className="list-decimal list-inside mt-2 space-y-1">
                                            <li><strong>Route-specific:</strong> If a pricing rule exists for a specific route, it takes precedence.</li>
                                            <li><strong>Vehicle-specific:</strong> If no route-specific rule exists, vehicle-type pricing is used.</li>
                                            <li><strong>Global:</strong> If neither route nor vehicle-specific rules exist, global pricing is applied.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}


