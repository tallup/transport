import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
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
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Pricing Rules</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage transport pricing configurations</p>
                            </div>
                            <Link
                                href="/admin/pricing-rules/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add Pricing Rule
                            </Link>
                        </div>
                    </div>

                    {pricingRules.data && pricingRules.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pricingRules.data.map((rule) => (
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
                                                    ${parseFloat(rule.amount).toFixed(2)} {rule.currency}
                                                </h3>
                                                <p className="text-sm text-white/70 font-medium truncate">
                                                    {rule.route?.name || 'Global Rule'}
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
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-brand-primary border border-blue-400/50">
                                                {formatPlanType(rule.plan_type)}
                                            </span>
                                        </div>
                                        {rule.vehicle_type && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-gray-500/30 text-brand-primary border border-gray-400/50 capitalize">
                                                    {rule.vehicle_type}
                                                </span>
                                            </div>
                                        )}
                                        {!rule.vehicle_type && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                <p className="text-sm text-white/90 font-medium">All Vehicle Types</p>
                                            </div>
                                        )}
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
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No pricing rules found.</p>
                            </div>
                        </GlassCard>
                    )}

                    {pricingRules.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {pricingRules.links.map((link, index) => {
                                    const baseClass = `px-4 py-2.5 rounded-xl font-bold text-sm ${
                                        link.active
                                            ? 'bg-yellow-400/35 text-brand-primary border-2 border-yellow-400 shadow-sm'
                                            : 'bg-yellow-400/20 text-white border-2 border-yellow-400/80 hover:bg-yellow-400/30 hover:border-yellow-400'
                                    } ${!link.url ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`;
                                    return link.url ? (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => router.get(link.url)}
                                            className={baseClass}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className={baseClass}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


