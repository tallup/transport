import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function BookingsIndex({ bookings }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">My Bookings</h2>
                                <Link
                                    href="/parent/bookings/create"
                                    className="glass-button px-4 py-2 rounded-lg"
                                >
                                    New Booking
                                </Link>
                            </div>

                            {bookings && bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="text-lg font-bold text-white">{booking.student?.name}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            booking.status === 'active' ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                                                            booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                                            booking.status === 'cancelled' ? 'bg-red-500/30 text-red-100 border-red-400/50' :
                                                            'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                                        }`}>
                                                            {booking.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base font-semibold text-white/90">
                                                        <div>
                                                            <span className="font-bold text-white">Route:</span> {booking.route?.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-white">Pickup:</span> {booking.pickup_address || booking.pickup_point?.name || 'Not set'}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-white">Plan:</span> {booking.plan_type?.replace('_', '-').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-white">Start:</span> {new Date(booking.start_date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {booking.status === 'active' || booking.status === 'expired' ? (
                                                        <Link
                                                            href={`/parent/bookings/${booking.id}/rebook`}
                                                            className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-md text-white font-bold hover:bg-blue-500/50 transition text-sm"
                                                        >
                                                            Rebook
                                                        </Link>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-white text-lg font-semibold mb-4">No bookings yet.</p>
                                    <Link
                                        href="/parent/bookings/create"
                                        className="glass-button px-4 py-2 rounded-lg inline-block"
                                    >
                                        Create Your First Booking
                                    </Link>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

