import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function BookingsIndex({ bookings }) {
    const { auth, flash } = usePage().props;
    const [cancelling, setCancelling] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
        setShowFlash(true);
    }, [flash?.success, flash?.error]);

    const formatStatus = (status) => {
        if (status === 'awaiting_approval') return 'AWAITING APPROVAL';
        return status.toUpperCase();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'pending':
                return 'bg-rose-50 text-rose-700 border-rose-200 font-bold'; // More urgent
            case 'awaiting_approval':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'completed':
                return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'expired':
                return 'bg-slate-100 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatPlanType = (planType) => {
        if (!planType) return 'N/A';
        return planType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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

            <div className="py-10">
                <div className="container space-y-8">
                    {showFlash && (flash?.success || flash?.error) && (
                        <div
                            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                                flash.success
                                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                                    : 'border-rose-200 bg-rose-50 text-rose-800'
                            }`}
                        >
                            {flash.success || flash.error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                My Bookings
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">
                                Review, update, and manage your transport bookings.
                            </p>
                        </div>
                        <Link href="/parent/bookings/create">
                            <GlassButton className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Booking
                            </GlassButton>
                        </Link>
                    </div>

                    {bookings && bookings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {bookings.map((booking) => (
                                <GlassCard key={booking.id}>
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            {booking.student?.profile_picture_url ? (
                                                <img
                                                    src={booking.student.profile_picture_url}
                                                    alt={booking.student?.name}
                                                    className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600">
                                                    <Calendar className="h-5 w-5" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h3 className="truncate text-base font-semibold text-slate-900">
                                                    {booking.student?.name || 'N/A'}
                                                </h3>
                                                <p className="truncate text-sm text-slate-600">
                                                    {booking.route?.name || 'No route'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {formatStatus(booking.status)}
                                        </span>
                                    </div>

                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex items-start gap-2 text-slate-600">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span className="truncate">
                                                {booking.pickup_address || booking.pickup_point?.name || 'No pickup point'}
                                            </span>
                                        </div>
                                        <div className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {formatPlanType(booking.plan_type)}
                                        </div>
                                        <div className="flex items-start gap-2 text-slate-600">
                                            <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>
                                                Start: {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                                                {booking.end_date ? ` - ${new Date(booking.end_date).toLocaleDateString()}` : ''}
                                            </span>
                                        </div>
                                        </div>

                                    {booking.status === 'pending' && (
                                        <div className="mt-4 rounded-lg bg-rose-50 p-3 border border-rose-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Payment Required</span>
                                            </div>
                                            <Link href={`/parent/bookings/${booking.id}/checkout`} className="text-xs font-extrabold text-rose-700 hover:underline">
                                                Pay Now →
                                            </Link>
                                        </div>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                        <Link href={`/parent/bookings/${booking.id}`}>
                                            <GlassButton variant="secondary" className="h-8 px-3 text-xs">View</GlassButton>
                                        </Link>

                                        {booking.status === 'pending' && (
                                            <>
                                                <Link href={`/parent/bookings/${booking.id}/edit`}>
                                                    <GlassButton variant="secondary" className="h-8 px-3 text-xs">Edit</GlassButton>
                                                </Link>
                                                <Link href={`/parent/bookings/${booking.id}/checkout`}>
                                                    <GlassButton variant="success" className="h-8 px-3 text-xs">Pay Now</GlassButton>
                                                </Link>
                                                <GlassButton
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancelling === booking.id}
                                                    variant="danger"
                                                    className="h-8 px-3 text-xs"
                                                >
                                                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                                </GlassButton>
                                            </>
                                        )}

                                        {booking.status === 'awaiting_approval' && (
                                            <GlassButton
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={cancelling === booking.id}
                                                variant="danger"
                                                className="h-8 px-3 text-xs"
                                            >
                                                {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                            </GlassButton>
                                        )}

                                        {booking.status === 'active' && (
                                            <>
                                                <GlassButton
                                                    onClick={() => handleCancel(booking.id)}
                                                    disabled={cancelling === booking.id}
                                                    variant="danger"
                                                    className="h-8 px-3 text-xs"
                                                >
                                                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                                </GlassButton>
                                                <Link href={`/parent/bookings/${booking.id}/rebook`}>
                                                    <GlassButton variant="secondary" className="h-8 px-3 text-xs">Rebook</GlassButton>
                                                </Link>
                                            </>
                                        )}

                                        {(booking.status === 'active' || booking.status === 'expired') &&
                                            new Date(booking.start_date) > new Date() && (
                                                <Link href={`/parent/bookings/${booking.id}/edit`}>
                                                    <GlassButton variant="secondary" className="h-8 px-3 text-xs">Edit</GlassButton>
                                                </Link>
                                            )}

                                        {booking.status === 'expired' && (
                                            <Link href={`/parent/bookings/${booking.id}/rebook`}>
                                                <GlassButton variant="secondary" className="h-8 px-3 text-xs">Rebook</GlassButton>
                                            </Link>
                                        )}

                                        {(booking.status === 'cancelled' || booking.status === 'completed') && (
                                            <GlassButton
                                                onClick={() => handleDelete(booking.id, booking.status)}
                                                disabled={deleting === booking.id}
                                                variant="danger"
                                                className="h-8 px-3 text-xs"
                                            >
                                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                {deleting === booking.id ? 'Deleting...' : 'Delete'}
                                            </GlassButton>
                                        )}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                    <Calendar className="h-7 w-7 text-slate-500" />
                                </div>
                                <p className="mt-4 text-lg font-semibold text-slate-900">No bookings yet</p>
                                <p className="mt-1 text-sm text-slate-600">Create your first booking to get started.</p>
                                <Link href="/parent/bookings/create" className="mt-5 inline-flex">
                                    <GlassButton className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create First Booking
                                    </GlassButton>
                                </Link>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
