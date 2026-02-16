import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function PickupHistory({ booking, dailyPickups, statistics }) {
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
                                    href={`/parent/bookings/${booking.id}`}
                                    className="text-white/80 hover:text-white font-semibold mb-4 inline-flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Booking Details
                                </Link>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                                    Pickup History
                                </h1>
                                <p className="text-base sm:text-lg font-semibold text-white/90">
                                    {booking.student?.name} - {booking.route?.name || 'Route'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70 mb-1">Total Pickups</p>
                                    <p className="text-3xl font-extrabold text-white">
                                        {statistics.total}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70 mb-1">Completed</p>
                                    <p className="text-3xl font-extrabold text-green-200">
                                        {statistics.completed}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70 mb-1">Morning (AM)</p>
                                    <p className="text-3xl font-extrabold text-yellow-200">
                                        {statistics.am}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/70 mb-1">Afternoon (PM)</p>
                                    <p className="text-3xl font-extrabold text-blue-200">
                                        {statistics.pm}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Booking Information */}
                    <GlassCard className="mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Booking Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="text-white/70 font-semibold text-sm">Student:</span>
                                    <p className="text-white font-bold">{booking.student?.name}</p>
                                </div>
                                <div>
                                    <span className="text-white/70 font-semibold text-sm">Route:</span>
                                    <p className="text-white font-bold">{booking.route?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-white/70 font-semibold text-sm">Plan Type:</span>
                                    <p className="text-white font-bold">
                                        {booking.plan_type === 'academic_term' ? 'Academic Term' : booking.plan_type.replace('_', '-').toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Pickup History */}
                    {dailyPickups && Object.keys(dailyPickups).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(dailyPickups)
                                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                                .map(([date, pickups]) => (
                                    <GlassCard key={date}>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">
                                                        {pickups[0].pickup_date_formatted}
                                                    </h3>
                                                    <p className="text-sm font-semibold text-white/70 mt-1">
                                                        {pickups.length} pickup{pickups.length !== 1 ? 's' : ''} recorded
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {pickups.every(p => p.completed_at) && (
                                                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/30 text-green-100 border border-green-400/50 rounded-full text-sm font-semibold">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            All Completed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {pickups.map((pickup) => (
                                                    <div key={pickup.id} className="glass-card rounded-lg p-4 border border-white/20">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    pickup.period === 'am'
                                                                        ? 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                                                                        : 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                                                                }`}>
                                                                    {pickup.period?.toUpperCase() || 'AM'}
                                                                </span>
                                                                {pickup.completed_at && (
                                                                    <span className="flex items-center gap-1 text-green-300 text-sm font-semibold">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {pickup.completed_at && (
                                                                <div className="text-right">
                                                                    <span className="text-white/70 font-semibold text-xs">Completed At:</span>
                                                                    <p className="text-white font-bold text-sm">
                                                                        {pickup.completed_at_formatted}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            {/* Pickup Location */}
                                                            <div>
                                                                <span className="text-white/70 font-semibold text-sm">Pickup Location:</span>
                                                                {pickup.pickup_point ? (
                                                                    <>
                                                                        <p className="text-white font-bold mt-1">{pickup.pickup_point.name}</p>
                                                                        <p className="text-white/80 text-sm mt-1">{pickup.pickup_point.address}</p>
                                                                        {pickup.pickup_point.pickup_time && (
                                                                            <p className="text-white/70 text-xs mt-2">
                                                                                Scheduled: {formatTime(pickup.pickup_point.pickup_time)}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className="text-white/70 text-sm mt-1">Custom address</p>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Driver Information */}
                                                            <div>
                                                                {pickup.driver && (
                                                                    <>
                                                                        <span className="text-white/70 font-semibold text-sm">Driver:</span>
                                                                        <p className="text-white font-bold mt-1">{pickup.driver.name}</p>
                                                                        {pickup.driver.email && (
                                                                            <p className="text-white/70 text-xs mt-1">{pickup.driver.email}</p>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Notes */}
                                                        {pickup.notes && (
                                                            <div className="mt-4 pt-4 border-t border-yellow-400/30">
                                                                <span className="text-white/70 font-semibold text-sm">Notes:</span>
                                                                <p className="text-white/90 text-sm mt-1 whitespace-pre-wrap">{pickup.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-12">
                                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-xl font-bold text-white mb-2">No Pickup History</h3>
                                <p className="text-base font-semibold text-white/90">
                                    No pickups have been recorded for this booking yet.
                                </p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

