import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import StatusBadge from '@/Components/StatusBadge';

export default function Show({ booking }) {
    const { auth, flash } = usePage().props;
    const [partialAmount, setPartialAmount] = useState('');
    const [refunding, setRefunding] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    const handleApprove = () => {
        if (confirm('Approve this booking and activate it?')) {
            router.post(`/admin/bookings/${booking.id}/approve`, {}, { preserveScroll: true });
        }
    };

    const handleCancel = () => {
        if (confirm('Cancel this booking?')) {
            router.post(`/admin/bookings/${booking.id}/cancel`, {}, { preserveScroll: true });
        }
    };

    const canRefund = (booking.payment_id || booking.payment_method === 'stripe') &&
        !['refunded', 'cancelled'].includes(booking.status);

    const handleFullRefund = () => {
        if (!confirm('Process a full refund for this booking? This cannot be undone.')) return;
        setRefunding(true);
        router.post(route('admin.bookings.refund', booking.id), {}, {
            preserveScroll: true,
            onFinish: () => setRefunding(false),
        });
    };

    const handlePartialRefund = () => {
        const amount = parseFloat(partialAmount);
        if (!partialAmount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid refund amount.');
            return;
        }
        if (!confirm(`Process a partial refund of $${amount.toFixed(2)}?`)) return;
        setRefunding(true);
        router.post(route('admin.bookings.refund', booking.id), { amount: amount }, {
            preserveScroll: true,
            onFinish: () => setRefunding(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Booking Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showFlash && flash?.success && (
                        <div className="mb-6 rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium shadow">
                            {flash.success}
                        </div>
                    )}
                    {showFlash && flash?.error && (
                        <div className="mb-6 rounded-xl bg-amber-600/90 border-2 border-amber-500 text-white px-4 py-3 font-medium shadow">
                            {flash.error}
                        </div>
                    )}
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="mb-2 text-4xl font-extrabold text-text-primary">Booking Details</h1>
                                <p className="text-lg font-medium text-text-secondary">View and manage booking information</p>
                            </div>
                            <div className="flex gap-3">
                                {booking.status === 'awaiting_approval' && (
                                    <GlassButton
                                        type="button"
                                        variant="success"
                                        onClick={handleApprove}
                                        className="px-6 py-3"
                                    >
                                        Approve Booking
                                    </GlassButton>
                                )}
                                {['pending', 'awaiting_approval', 'active'].includes(booking.status) && (
                                    <GlassButton
                                        type="button"
                                        variant="danger"
                                        onClick={handleCancel}
                                        className="px-6 py-3"
                                    >
                                        Cancel Booking
                                    </GlassButton>
                                )}
                                {canRefund && (
                                    <GlassButton
                                        type="button"
                                        variant="secondary"
                                        onClick={handleFullRefund}
                                        disabled={refunding}
                                        className="px-6 py-3"
                                    >
                                        {refunding ? 'Processing…' : 'Full Refund'}
                                    </GlassButton>
                                )}
                                <Link
                                    href={`/admin/bookings/${booking.id}/edit`}
                                    className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href="/admin/bookings"
                                    className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        {booking.status === 'pending' && (
                            <p className="mb-2 text-sm text-amber-700">Parent must complete payment before this booking can be approved. You will be notified when payment is received.</p>
                        )}
                        <StatusBadge type="booking" status={booking.status} variant="light" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" />
                    </div>

                    {/* Partial refund (when eligible) */}
                    {canRefund && (
                        <GlassCard className="mb-6 flex flex-wrap items-end gap-4 p-4">
                            <span className="font-semibold text-slate-700">Partial refund:</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="Amount ($)"
                                value={partialAmount}
                                onChange={(e) => setPartialAmount(e.target.value)}
                                className="form-control w-32"
                            />
                            <GlassButton
                                type="button"
                                variant="secondary"
                                onClick={handlePartialRefund}
                                disabled={refunding || !partialAmount}
                                className="px-4 py-2"
                            >
                                {refunding ? 'Processing…' : 'Refund amount'}
                            </GlassButton>
                        </GlassCard>
                    )}

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Student & Parent Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                {booking.student?.profile_picture_url ? (
                                    <img src={booking.student.profile_picture_url} alt={booking.student?.name} className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-yellow-400/50" />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                        <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-slate-900">Student & Parent</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Student</p>
                                    <p className="text-lg font-bold text-slate-900">{booking.student?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Parent</p>
                                    <p className="text-lg font-bold text-slate-900">{booking.student?.parent?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                                    <p className="break-all text-base font-medium text-slate-700">{booking.student?.parent?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Route & Driver Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Route & Driver</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Route</p>
                                    <p className="text-lg font-bold text-slate-900">{booking.route?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Driver</p>
                                    <p className="text-lg font-bold text-slate-900">{booking.route?.driver?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle</p>
                                    <p className="text-base font-medium text-slate-700">
                                        {booking.route?.vehicle
                                            ? `${booking.route.vehicle.make} ${booking.route.vehicle.model} (${booking.route.vehicle.license_plate})`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Booking Info Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Booking Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Plan Type</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {booking.plan_type?.replace('_', '-').toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Trip Type</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {booking.trip_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                {booking.trip_type === 'one_way' && (
                                    <div>
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Service</p>
                                        <p className="text-lg font-bold text-slate-900">
                                            {booking.trip_direction === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Dates Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Dates</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Start Date</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {booking.start_date ? new Date(booking.start_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">End Date</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {booking.end_date ? new Date(booking.end_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        }) : 'Ongoing'}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Pickup Details Card */}
                        <GlassCard className="p-6 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Pickup Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Point</p>
                                    <p className="text-lg font-bold text-slate-900">{booking.pickup_point?.name || booking.pickupPoint?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Address</p>
                                    <p className="break-words text-base font-medium text-slate-700">{booking.pickup_address || 'N/A'}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

