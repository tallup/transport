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
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                    Route: {rule.route_name}
                </span>
            );
        }
        if (rule.vehicle_type) {
            return (
                <span className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                    Vehicle: {rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1)}
                </span>
            );
        }
        return (
            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
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
                                <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Pricing Management</h1>
                                <p className="text-lg font-medium text-slate-500">
                                    Manage pricing rules for all plan types. Pricing follows priority: Route-specific &gt; Vehicle-specific &gt; Global
                                </p>
                            </div>
                            <Link
                                href="/admin/pricing-rules/create"
                                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                                        <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">{planTypeLabel} Pricing</h2>
                                </div>
                                
                                {rules.length === 0 ? (
                                    <GlassCard className="p-12">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
                                                <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="mb-2 text-lg font-bold text-slate-900">No pricing rules configured</p>
                                            <p className="mb-4 text-sm text-slate-500">No pricing rules configured for {planTypeLabel}.</p>
                                            <Link
                                                href={`/admin/pricing-rules/create?plan_type=${planTypeKey}`}
                                                className="inline-block rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-secondary"
                                            >
                                                Create one now
                                            </Link>
                                        </div>
                                    </GlassCard>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {rules.map((rule) => (
                                            <GlassCard key={rule.id} className="p-6 transition-all hover:scale-[1.01]">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-sm">
                                                            <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="truncate text-lg font-extrabold text-slate-900">
                                                                {rule.currency} {parseFloat(rule.amount).toFixed(2)}
                                                            </h3>
                                                            <p className="truncate text-sm font-medium text-slate-500">
                                                                {formatPlanType(rule.plan_type)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                                                        rule.active
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border-slate-200 bg-slate-100 text-slate-600'
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
                                                        <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                        <p className="text-sm font-medium text-slate-600">
                                                            Vehicle: {rule.vehicle_type ? rule.vehicle_type.charAt(0).toUpperCase() + rule.vehicle_type.slice(1) : 'All Types'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Card Actions */}
                                                <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                                    <Link
                                                        href={`/admin/pricing-rules/${rule.id}/edit`}
                                                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleActive(rule.id)}
                                                        disabled={toggling === rule.id}
                                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                                            rule.active
                                                                ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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
                                                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
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
                    <GlassCard className="mt-8 border border-sky-200 bg-sky-50/70">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-white">
                                        <svg className="h-5 w-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-2 text-lg font-extrabold text-slate-900">Pricing Priority</h3>
                                    <div className="text-sm text-slate-600">
                                        <p className="mb-3">Pricing is determined by the following priority order:</p>
                                        <ol className="list-inside list-decimal space-y-2 text-slate-600">
                                            <li><strong className="text-slate-900">Route-specific:</strong> If a pricing rule exists for a specific route, it takes precedence.</li>
                                            <li><strong className="text-slate-900">Vehicle-specific:</strong> If no route-specific rule exists, vehicle-type pricing is used.</li>
                                            <li><strong className="text-slate-900">Global:</strong> If neither route nor vehicle-specific rules exist, global pricing is applied.</li>
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


