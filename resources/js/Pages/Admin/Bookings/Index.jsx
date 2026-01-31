import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/30 text-brand-primary border border-green-400/50';
            case 'pending':
                return 'bg-yellow-500/30 text-brand-primary border border-yellow-400/50';
            case 'awaiting_approval':
                return 'bg-amber-500/30 text-brand-primary border border-amber-400/50';
            case 'cancelled':
                return 'bg-red-500/30 text-brand-primary border border-red-400/50';
            case 'expired':
                return 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
            default:
                return 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
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
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Bookings</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage all transport bookings</p>
                            </div>
                            <Link
                                href="/admin/bookings/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
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
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-extrabold text-white truncate">{booking.student?.name || 'N/A'}</h3>
                                                <p className="text-sm text-white/70 font-medium truncate">{booking.route?.name || 'No route'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(booking.status)}`}>
                                            {formatStatus(booking.status)}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium truncate">
                                                {booking.pickupPoint?.name || booking.pickup_address || 'No pickup point'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-brand-primary border border-blue-400/50">
                                                {formatPlanType(booking.plan_type)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium">
                                                {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'No start date'}
                                                {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                        <Link
                                            href={`/admin/bookings/${booking.id}`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            View
                                        </Link>
                                        {(booking.status === 'pending' || booking.status === 'awaiting_approval') && (
                                            <button
                                                onClick={() => handleApprove(booking.id)}
                                                className="px-3 py-1.5 bg-green-500/20 border border-green-400/50 text-green-200 text-xs font-bold rounded-lg hover:bg-green-500/30 transition-all"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {['pending', 'awaiting_approval', 'active'].includes(booking.status) && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/bookings/${booking.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            disabled={deleting === booking.id}
                                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
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

                    {bookings.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {bookings.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg ${
                                            link.active
                                                ? 'bg-brand-primary/30 text-brand-primary border-2 border-brand-primary/50'
                                                : 'bg-white/10 border-2 border-white/30 text-white hover:bg-white/20'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


