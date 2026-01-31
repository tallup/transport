import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Show({ booking }) {
    const { auth } = usePage().props;

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

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

    return (
        <AdminLayout>
            <Head title="Booking Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Booking Details</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">View and manage booking information</p>
                            </div>
                            <div className="flex gap-3">
                                {(booking.status === 'pending' || booking.status === 'awaiting_approval') && (
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
                                <Link
                                    href={`/admin/bookings/${booking.id}/edit`}
                                    className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href="/admin/bookings"
                                    className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                            booking.status === 'active' ? 'bg-green-500/30 text-green-200 border border-green-400/50' :
                            booking.status === 'pending' || booking.status === 'awaiting_approval' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50' :
                            booking.status === 'cancelled' ? 'bg-red-500/30 text-red-200 border border-red-400/50' :
                            'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                        }`}>
                            {formatStatus(booking.status)}
                        </span>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Student & Parent Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Student & Parent</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Student</p>
                                    <p className="text-lg font-extrabold text-white">{booking.student?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Parent</p>
                                    <p className="text-lg font-extrabold text-white">{booking.student?.parent?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Email</p>
                                    <p className="text-base font-semibold text-white/90 break-all">{booking.student?.parent?.email || 'N/A'}</p>
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
                                <h3 className="text-xl font-extrabold text-brand-primary">Route & Driver</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Route</p>
                                    <p className="text-lg font-extrabold text-white">{booking.route?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Driver</p>
                                    <p className="text-lg font-extrabold text-white">{booking.route?.driver?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Vehicle</p>
                                    <p className="text-base font-semibold text-white/90">
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
                                <h3 className="text-xl font-extrabold text-brand-primary">Booking Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Plan Type</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {booking.plan_type?.replace('_', '-').toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Trip Type</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {booking.trip_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                                    </p>
                                </div>
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
                                <h3 className="text-xl font-extrabold text-brand-primary">Dates</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Start Date</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {booking.start_date ? new Date(booking.start_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">End Date</p>
                                    <p className="text-lg font-extrabold text-white">
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
                                <h3 className="text-xl font-extrabold text-brand-primary">Pickup Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Point</p>
                                    <p className="text-lg font-extrabold text-white">{booking.pickup_point?.name || booking.pickupPoint?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Address</p>
                                    <p className="text-base font-semibold text-white/90 break-words">{booking.pickup_address || 'N/A'}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

