import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
import { useState, useEffect } from 'react';

export default function Index({ discounts }) {
    const { auth, flash } = usePage().props;
    const [deleting, setDeleting] = useState(null);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this discount?')) {
            setDeleting(id);
            router.delete(`/admin/discounts/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const formatScope = (discount) => {
        if (discount.scope === 'multi_child' && discount.min_children != null) {
            return `Multi-child (${discount.min_children}+ children)`;
        }
        if (discount.scope === 'route' && discount.route) return `Route: ${discount.route.name}`;
        if (discount.scope === 'plan_type' && discount.plan_type) {
            return discount.plan_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return 'All bookings';
    };

    const formatValue = (discount) => {
        if (discount.type === 'percentage') return `${Number(discount.value)}%`;
        return `$${parseFloat(discount.value).toFixed(2)}`;
    };

    const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

    const data = discounts?.data ?? discounts ?? [];

    return (
        <AdminLayout>
            <Head title="Discounts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Discounts</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Time-based promotions applied to bookings</p>
                            </div>
                            <Link
                                href="/admin/discounts/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add Discount
                            </Link>
                        </div>
                    </div>

                    {showFlash && (flash?.success || flash?.error) && (
                        <div className={`mb-6 px-4 py-3 rounded-xl font-semibold ${
                            flash?.success
                                ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200'
                                : 'bg-amber-600/90 border-2 border-amber-500 text-white'
                        }`}>
                            {flash?.success || flash?.error}
                        </div>
                    )}

                    {data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.map((discount) => (
                                <GlassCard key={discount.id} className="p-6 hover:scale-[1.02] transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-extrabold text-slate-900 truncate">{discount.name}</h3>
                                            <p className="text-sm text-slate-600 font-medium mt-0.5">{formatScope(discount)}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                                                discount.active
                                                    ? 'bg-amber-500/30 text-amber-800 border border-amber-400/50'
                                                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                                            }`}
                                        >
                                            {discount.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500/30 text-amber-800 border border-amber-400/50">
                                                {discount.type === 'percentage' ? 'Percentage' : 'Fixed'}
                                            </span>
                                            <span className="text-slate-900 font-bold">{formatValue(discount)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                                            <span>Start: {formatDate(discount.start_date)}</span>
                                            <span>End: {formatDate(discount.end_date)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                        <Link
                                            href={`/admin/discounts/${discount.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/15 border border-brand-primary/40 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/25 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            disabled={deleting === discount.id}
                                            className="px-3 py-1.5 bg-red-500/15 border border-red-400/50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-500/25 transition-all disabled:opacity-50"
                                        >
                                            {deleting === discount.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <p className="text-slate-900 text-lg font-bold">No discounts yet.</p>
                                <p className="text-slate-600 mt-1">Create a time-based promotion to apply to bookings.</p>
                                <Link
                                    href="/admin/discounts/create"
                                    className="inline-block mt-4 px-5 py-2.5 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30"
                                >
                                    Add Discount
                                </Link>
                            </div>
                        </GlassCard>
                    )}

                    <PaginationLinks links={discounts?.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
