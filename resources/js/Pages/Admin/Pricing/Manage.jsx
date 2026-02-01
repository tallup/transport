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
            preserveScroll: true,
        });
    };

    const handleDelete = (ruleId) => {
        if (confirm('Are you sure you want to delete this pricing rule?')) {
            setDeleting(ruleId);
            router.delete(`/admin/pricing-rules/${ruleId}`, {
                onFinish: () => setDeleting(null),
                preserveScroll: true,
            });
        }
    };

    const getScopeBadge = (rule) => {
        if (rule.route_id) {
            return (
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/30 text-brand-primary border border-yellow-400/50">
                    Route: {rule.route_name}
                </span>
            );
        }
        if (rule.vehicle_type) {
            return (
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-brand-primary border border-blue-400/50">
                    Vehicle: {rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1)}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-500/30 text-brand-primary border border-green-400/50">
                Global
            </span>
        );
    };

    const formatPlanType = (planType) => {
        return planType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Manage Pricing" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Pricing Management</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">
                                    Manage pricing rules for all plan types. Pricing follows priority: Route-specific &gt; Vehicle-specific &gt; Global
                                </p>
                            </div>
                            <Link
                                href="/admin/pricing-rules/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add Pricing Rule
                            </Link>
                        </div>
                    </div>

                    {Object.entries(planTypes).map(([planTypeKey, planTypeLabel]) => {
                        const rules = pricingRules[planTypeKey] || [];
                        
                        return (
                            <div key={planTypeKey} className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-xl flex items-center justify-center border-2 border-yellow-400/50">
                                        <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-brand-primary">{planTypeLabel} Pricing</h2>
                                </div>
                                
                                {rules.length === 0 ? (
                                    <GlassCard className="p-12">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                <svg className="w-8 h-8 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-brand-primary text-lg font-bold mb-2">No pricing rules configured</p>
                                            <p className="text-white/70 text-sm mb-4">No pricing rules configured for {planTypeLabel}.</p>
                                            <Link
                                                href={`/admin/pricing-rules/create?plan_type=${planTypeKey}`}
                                                className="px-4 py-2 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-sm font-bold rounded-lg hover:bg-brand-primary/30 transition-all inline-block"
                                            >
                                                Create one now
                                            </Link>
                                        </div>
                                    </GlassCard>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {rules.map((rule) => (
                                            <GlassCard key={rule.id} className="p-6 hover:scale-[1.02] transition-all">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-extrabold text-white truncate">
                                                                {rule.currency} {parseFloat(rule.amount).toFixed(2)}
                                                            </h3>
                                                            <p className="text-sm text-white/70 font-medium truncate">
                                                                {formatPlanType(rule.plan_type)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                        rule.active
                                                            ? 'bg-green-500/30 text-brand-primary border border-green-400/50'
                                                            : 'bg-gray-500/30 text-brand-primary border border-gray-400/50'
                                                    }`}>
                                                        {rule.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        {getScopeBadge(rule)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                        <p className="text-sm text-white/90 font-medium">
                                                            Vehicle: {rule.vehicle_type ? rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1) : 'All Types'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Card Actions */}
                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                                    <Link
                                                        href={`/admin/pricing-rules/${rule.id}/edit`}
                                                        className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleActive(rule.id)}
                                                        disabled={toggling === rule.id}
                                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${
                                                            rule.active
                                                                ? 'bg-orange-500/20 border border-orange-400/50 text-orange-200 hover:bg-orange-500/30'
                                                                : 'bg-green-500/20 border border-green-400/50 text-green-200 hover:bg-green-500/30'
                                                        }`}
                                                    >
                                                        {toggling === rule.id 
                                                            ? 'Processing...' 
                                                            : rule.active 
                                                                ? 'Deactivate' 
                                                                : 'Activate'
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rule.id)}
                                                        disabled={deleting === rule.id}
                                                        className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                                    >
                                                        {deleting === rule.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Info Card */}
                    <GlassCard className="mt-8 bg-blue-500/10 border-blue-400/30">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border-2 border-blue-400/50">
                                        <svg className="h-5 w-5 !text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-extrabold text-brand-primary mb-2">Pricing Priority</h3>
                                    <div className="text-sm text-white/90">
                                        <p className="mb-3">Pricing is determined by the following priority order:</p>
                                        <ol className="list-decimal list-inside space-y-2 text-white/80">
                                            <li><strong className="text-brand-primary">Route-specific:</strong> If a pricing rule exists for a specific route, it takes precedence.</li>
                                            <li><strong className="text-brand-primary">Vehicle-specific:</strong> If no route-specific rule exists, vehicle-type pricing is used.</li>
                                            <li><strong className="text-brand-primary">Global:</strong> If neither route nor vehicle-specific rules exist, global pricing is applied.</li>
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


