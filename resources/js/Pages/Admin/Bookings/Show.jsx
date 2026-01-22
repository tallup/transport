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
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Booking Details</h2>
                        <div className="flex gap-3">
                            {(booking.status === 'pending' || booking.status === 'awaiting_approval') && (
                                <GlassButton
                                    type="button"
                                    variant="success"
                                    onClick={handleApprove}
                                >
                                    Approve Booking
                                </GlassButton>
                            )}
                            {['pending', 'awaiting_approval', 'active'].includes(booking.status) && (
                                <GlassButton
                                    type="button"
                                    variant="danger"
                                    onClick={handleCancel}
                                >
                                    Cancel Booking
                                </GlassButton>
                            )}
                            <Link
                                href={`/admin/bookings/${booking.id}/edit`}
                                className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                            >
                                Edit
                            </Link>
                            <Link
                                href="/admin/bookings"
                                className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                            >
                                Back
                            </Link>
                        </div>
                    </div>

                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Student & Parent
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Student:</span>
                                        <p className="text-white font-bold">{booking.student?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Parent:</span>
                                        <p className="text-white font-bold">{booking.student?.parent?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Parent Email:</span>
                                        <p className="text-white font-bold">{booking.student?.parent?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Route & Driver
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Route:</span>
                                        <p className="text-white font-bold">{booking.route?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Driver:</span>
                                        <p className="text-white font-bold">{booking.route?.driver?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Vehicle:</span>
                                        <p className="text-white font-bold">
                                            {booking.route?.vehicle
                                                ? `${booking.route.vehicle.make} ${booking.route.vehicle.model} (${booking.route.vehicle.license_plate})`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Booking Info
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Status:</span>
                                        <p className="text-white font-bold">{formatStatus(booking.status)}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Plan Type:</span>
                                        <p className="text-white font-bold">
                                            {booking.plan_type?.replace('_', '-').toUpperCase() || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Trip Type:</span>
                                        <p className="text-white font-bold">
                                            {booking.trip_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Dates
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Start Date:</span>
                                        <p className="text-white font-bold">
                                            {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">End Date:</span>
                                        <p className="text-white font-bold">
                                            {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Pickup Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-white/70 font-semibold">Pickup Point:</span>
                                            <p className="text-white font-bold">{booking.pickup_point?.name || booking.pickupPoint?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/70 font-semibold">Pickup Address:</span>
                                            <p className="text-white font-bold">{booking.pickup_address || 'N/A'}</p>
                                        </div>
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

