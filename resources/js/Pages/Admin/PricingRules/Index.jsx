import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
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
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="mb-2 text-4xl font-extrabold text-slate-900">Pricing Rules</h1>
                                <p className="text-lg font-medium text-slate-500">Manage transport pricing configurations</p>
                            </div>
                            <Link
                                href="/admin/pricing-rules/create"
                                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                Add Pricing Rule
                            </Link>
                        </div>
                    </div>

                    {pricingRules.data && pricingRules.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pricingRules.data.map((rule) => (
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
                                                    ${parseFloat(rule.amount).toFixed(2)} {rule.currency}
                                                </h3>
                                                <p className="truncate text-sm font-medium text-slate-500">
                                                    {rule.route?.name || 'Global Rule'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                                            rule.active 
                                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 bg-slate-100 text-slate-600'
                                        }`}>
                                            {rule.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                                                {formatPlanType(rule.plan_type)}
                                            </span>
                                        </div>
                                        {rule.vehicle_type && (
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                                                    {rule.vehicle_type}
                                                </span>
                                            </div>
                                        )}
                                        {!rule.vehicle_type && (
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                <p className="text-sm font-medium text-slate-600">All Vehicle Types</p>
                                            </div>
                                        )}
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
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
                                    <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-slate-900">No pricing rules found.</p>
                            </div>
                        </GlassCard>
                    )}

                    <PaginationLinks links={pricingRules.links} />
                </div>
            </div>
        </AdminLayout>
    );
}


