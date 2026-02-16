import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import { useState } from 'react';

export default function BookingsIndex({ bookings }) {
    const { auth, flash } = usePage().props;
    const [cancelling, setCancelling] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const formatStatus = (status) => {
        if (status === 'awaiting_approval') {
            return 'AWAITING APPROVAL';
        }
        return status.toUpperCase();
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
            case 'completed':
                return 'bg-blue-500/30 text-brand-primary border border-blue-400/50';
            case 'expired':
                return 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
            default:
                return 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
        }
    };

    const formatPlanType = (planType) => {
        if (!planType) return 'N/A';
        return planType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleCancel = (bookingId) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            setCancelling(bookingId);
            router.post(`/parent/bookings/${bookingId}/cancel`, {}, {
                onFinish: () => setCancelling(null),
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (bookingId, status) => {
        if (confirm(`Are you sure you want to permanently delete this ${status} booking? This action cannot be undone.`)) {
            setDeleting(bookingId);
            router.delete(`/parent/bookings/${bookingId}`, {
                onFinish: () => setDeleting(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Success / Error messages */}
                    {(flash?.success || flash?.error) && (
                        <div className={`mb-6 px-6 py-4 rounded-xl font-bold shadow-md ${
                            flash.success
                                ? 'bg-emerald-600 border-2 border-emerald-500 text-white'
                                : 'bg-red-600 border-2 border-red-500 text-white'
                        }`}>
                            {flash.success || flash.error}
                        </div>
                    )}

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">My Bookings</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage all your transport bookings</p>
                            </div>
                            <Link
                                href="/parent/bookings/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                New Booking
                            </Link>
                        </div>
                    </div>

                    {bookings && bookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookings.map((booking) => (
                                <GlassCard key={booking.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                                                {booking.pickup_address || booking.pickup_point?.name || 'No pickup point'}
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
                                                Start: {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                                                {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-yellow-400/40">
                                        <Link
                                            href={`/parent/bookings/${booking.id}`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            View
                                        </Link>
                                        {booking.status === 'pending' && (
                                            <>
                                                <Link
                                                    href={`/parent/bookings/${booking.id}/edit`}
                                                    className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 text-xs font-bold rounded-lg hover:bg-yellow-500/30 transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/parent/bookings/${booking.id}/checkout`}
                                                    className="px-3 py-1.5 bg-green-500/20 border border-green-400/50 text-green-200 text-xs font-bold rounded-lg hover:bg-green-500/30 transition-all"
                                                >
                                                    Pay Now
                                                </Link>
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancelling === booking.id}
                                                    className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'awaiting_approval' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={cancelling === booking.id}
                                                className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                            >
                                                {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                            </button>
                                        )}
                                        {booking.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancelling === booking.id}
                                                    className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                                <Link
                                                    href={`/parent/bookings/${booking.id}/rebook`}
                                                    className="px-3 py-1.5 bg-purple-500/20 border border-purple-400/50 text-purple-200 text-xs font-bold rounded-lg hover:bg-purple-500/30 transition-all"
                                                >
                                                    Rebook
                                                </Link>
                                            </>
                                        )}
                                        {(booking.status === 'active' || booking.status === 'expired') && new Date(booking.start_date) > new Date() && (
                                            <Link
                                                href={`/parent/bookings/${booking.id}/edit`}
                                                className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 text-xs font-bold rounded-lg hover:bg-yellow-500/30 transition-all"
                                            >
                                                Edit
                                            </Link>
                                        )}
                                        {booking.status === 'expired' && (
                                            <Link
                                                href={`/parent/bookings/${booking.id}/rebook`}
                                                className="px-3 py-1.5 bg-purple-500/20 border border-purple-400/50 text-purple-200 text-xs font-bold rounded-lg hover:bg-purple-500/30 transition-all"
                                            >
                                                Rebook
                                            </Link>
                                        )}
                                        {(booking.status === 'cancelled' || booking.status === 'completed') && (
                                            <button
                                                onClick={() => handleDelete(booking.id, booking.status)}
                                                disabled={deleting === booking.id}
                                                className="px-3 py-1.5 bg-red-600/20 border border-red-500/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-600/30 transition-all disabled:opacity-50"
                                            >
                                                {deleting === booking.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        )}
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
                                <p className="text-brand-primary text-lg font-bold mb-2">No bookings yet.</p>
                                <p className="text-white/70 text-sm mb-4">Get started by creating your first booking.</p>
                                <Link
                                    href="/parent/bookings/create"
                                    className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all inline-block"
                                >
                                    Create Your First Booking
                                </Link>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

