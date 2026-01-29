import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function AllPickupHistory({ bookings, dailyPickups, pickupsByBooking, statistics }) {
    // Helper function to format time
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        
        try {
            let date;
            if (typeof timeString === 'string') {
                if (timeString.includes('T') || timeString.includes(' ')) {
                    date = new Date(timeString);
                } else if (timeString.includes(':') && timeString.length <= 8) {
                    date = new Date('2000-01-01T' + timeString);
                } else {
                    return timeString;
                }
            } else {
                date = new Date(timeString);
            }
            
            if (isNaN(date.getTime())) {
                return timeString;
            }
            
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        } catch (e) {
            return timeString;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pickup History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Link
                                    href="/parent/bookings"
                                    className="text-brand-primary hover:text-brand-primary/80 font-semibold mb-2 inline-flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Bookings
                                </Link>
                                <h1 className="text-4xl font-extrabold text-brand-primary drop-shadow-lg">
                                    All Pickup History
                                </h1>
                                <p className="text-brand-primary/80 mt-2 font-semibold">
                                    Complete pickup history for all your children
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <GlassCard>
                            <div className="text-center">
                                <p className="text-white/70 text-sm font-semibold mb-1">Total Pickups</p>
                                <p className="text-3xl font-extrabold text-white">{statistics.total}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="text-white/70 text-sm font-semibold mb-1">Completed</p>
                                <p className="text-3xl font-extrabold text-green-400">{statistics.completed}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="text-white/70 text-sm font-semibold mb-1">AM Pickups</p>
                                <p className="text-3xl font-extrabold text-yellow-400">{statistics.am}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="text-white/70 text-sm font-semibold mb-1">PM Pickups</p>
                                <p className="text-3xl font-extrabold text-blue-400">{statistics.pm}</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Daily Pickups List */}
                    {dailyPickups && Object.keys(dailyPickups).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(dailyPickups)
                                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                                .map(([date, pickups]) => (
                                    <GlassCard key={date} className="mb-6">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-extrabold text-white mb-2">
                                                {pickups[0]?.pickup_date_formatted || date}
                                            </h3>
                                            <p className="text-white/70 font-semibold">
                                                {pickups.length} pickup{pickups.length !== 1 ? 's' : ''} on this day
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {pickups.map((pickup) => (
                                                <div
                                                    key={pickup.id}
                                                    className="p-4 glass-card rounded-lg border border-white/20 bg-white/5"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                                    pickup.period === 'am'
                                                                        ? 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                                                                        : 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                                                                }`}>
                                                                    {pickup.period?.toUpperCase() || 'AM'}
                                                                </span>
                                                                {pickup.completed_at && (
                                                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500/30 text-green-100 border border-green-400/50">
                                                                        Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {pickup.booking?.student && (
                                                                <p className="text-white font-bold text-lg mb-1">
                                                                    {pickup.booking.student.name}
                                                                </p>
                                                            )}
                                                            {pickup.booking?.route && (
                                                                <p className="text-white/70 text-sm mb-2">
                                                                    Route: {pickup.booking.route.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {pickup.completed_at && (
                                                            <div className="text-right">
                                                                <p className="text-white/70 text-xs font-semibold">Completed At</p>
                                                                <p className="text-white font-bold">
                                                                    {pickup.completed_at_formatted || 'N/A'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {pickup.pickup_point && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                            <div>
                                                                <p className="text-white/70 text-xs font-semibold mb-1">Pickup Location</p>
                                                                <p className="text-white font-bold">{pickup.pickup_point.name}</p>
                                                                <p className="text-white/80 text-sm">{pickup.pickup_point.address}</p>
                                                                {pickup.pickup_point.pickup_time && (
                                                                    <p className="text-green-300 text-sm mt-1 font-semibold">
                                                                        Time: {formatTime(pickup.pickup_point.pickup_time)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {pickup.driver && (
                                                        <div className="mt-3 pt-3 border-t border-white/20">
                                                            <p className="text-white/70 text-xs font-semibold mb-1">Driver</p>
                                                            <p className="text-white font-bold">{pickup.driver.name}</p>
                                                        </div>
                                                    )}

                                                    {pickup.notes && (
                                                        <div className="mt-3 pt-3 border-t border-white/20">
                                                            <p className="text-white/70 text-xs font-semibold mb-1">Notes</p>
                                                            <p className="text-white/90 text-sm whitespace-pre-wrap">{pickup.notes}</p>
                                                        </div>
                                                    )}

                                                    {pickup.booking_id && (
                                                        <div className="mt-3 pt-3 border-t border-white/20">
                                                            <Link
                                                                href={`/parent/bookings/${pickup.booking_id}`}
                                                                className="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center gap-1"
                                                            >
                                                                View Booking Details
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-white/50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Pickup History</h3>
                                <p className="mt-2 text-white/70 font-semibold">
                                    No pickup records found for your bookings.
                                </p>
                                <div className="mt-6">
                                    <Link href="/parent/bookings">
                                        <GlassButton variant="primary">
                                            View My Bookings
                                        </GlassButton>
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

