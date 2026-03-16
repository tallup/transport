import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
import StatusBadge from '@/Components/StatusBadge';
import { useState } from 'react';

export default function Index({ bookings }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            setDeleting(id);
            router.delete(`/admin/bookings/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleApprove = (id) => {
        if (confirm('Approve this booking and activate it?')) {
            router.post(`/admin/bookings/${id}/approve`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleCancel = (id) => {
        if (confirm('Cancel this booking?')) {
            router.post(`/admin/bookings/${id}/cancel`, {}, {
                preserveScroll: true,
            });
        }
    };

    const formatPlanType = (planType) => {
        return planType.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="mb-2 text-4xl font-extrabold text-text-primary">Bookings</h1>
                                <p className="text-lg font-medium text-text-secondary">Manage all transport bookings</p>
                            </div>
                            <Link
                                href="/admin/bookings/create"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Add Booking
                            </Link>
                        </div>
                    </div>

                    {bookings.data && bookings.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookings.data.map((booking) => (
                                <GlassCard key={booking.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {booking.student?.profile_picture_url ? (
                                                <img src={booking.student.profile_picture_url} alt={booking.student?.name} className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0 border-2 border-yellow-400/50" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate text-lg font-bold text-slate-900">{booking.student?.name || 'N/A'}</h3>
                                                <p className="truncate text-sm font-medium text-slate-500">{booking.route?.name || 'No route'}</p>
                                            </div>
                                        </div>
                                        <StatusBadge type="booking" status={booking.status} />
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="truncate text-sm font-medium text-slate-700">
                                                {booking.pickup_address || 'No pickup address'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                                                {formatPlanType(booking.plan_type)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-medium text-slate-700">
                                                {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'No start date'}
                                                {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                        <Link
                                            href={`/admin/bookings/${booking.id}`}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        {booking.status === 'awaiting_approval' && (
                                            <button
                                                onClick={() => handleApprove(booking.id)}
                                                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {['pending', 'awaiting_approval', 'active'].includes(booking.status) && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/bookings/${booking.id}/edit`}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            disabled={deleting === booking.id}
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            {deleting === booking.id ? 'Deleting...' : 'Delete'}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No bookings found.</p>
                            </div>
                        </GlassCard>
                    )}

                    <PaginationLinks links={bookings.links} />
                </div>
            </div>
        </AdminLayout>
    );
}


