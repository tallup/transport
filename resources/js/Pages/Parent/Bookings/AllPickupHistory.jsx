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
                                    className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-slate-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Bookings
                                </Link>
                                <h1 className="text-4xl font-extrabold text-slate-900">
                                    All Pickup History
                                </h1>
                                <p className="mt-2 font-medium text-slate-500">
                                    Complete pickup history for all your children
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <GlassCard>
                            <div className="text-center">
                                <p className="mb-1 text-sm font-semibold text-slate-500">Total Pickups</p>
                                <p className="text-3xl font-extrabold text-slate-900">{statistics.total}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="mb-1 text-sm font-semibold text-slate-500">Completed</p>
                                <p className="text-3xl font-extrabold text-emerald-600">{statistics.completed}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="mb-1 text-sm font-semibold text-slate-500">AM Pickups</p>
                                <p className="text-3xl font-extrabold text-amber-500">{statistics.am}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <div className="text-center">
                                <p className="mb-1 text-sm font-semibold text-slate-500">PM Pickups</p>
                                <p className="text-3xl font-extrabold text-sky-600">{statistics.pm}</p>
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
                                            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
                                                {pickups[0]?.pickup_date_formatted || date}
                                            </h3>
                                            <p className="font-medium text-slate-500">
                                                {pickups.length} pickup{pickups.length !== 1 ? 's' : ''} on this day
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {pickups.map((pickup) => (
                                                <div
                                                    key={pickup.id}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                                                    pickup.period === 'am'
                                                                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                                        : 'border-sky-200 bg-sky-50 text-sky-700'
                                                                }`}>
                                                                    {pickup.period?.toUpperCase() || 'AM'}
                                                                </span>
                                                                {pickup.completed_at && (
                                                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                                        Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {pickup.booking?.student && (
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    {pickup.booking.student.profile_picture_url ? (
                                                                        <img src={pickup.booking.student.profile_picture_url} alt={pickup.booking.student.name} className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 object-cover" />
                                                                    ) : (
                                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400">
                                                                            <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    <p className="mb-0 text-lg font-bold text-slate-900">
                                                                        {pickup.booking.student.name}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {pickup.booking?.route && (
                                                                <p className="mb-2 text-sm text-slate-500">
                                                                    Route: {pickup.booking.route.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {pickup.completed_at && (
                                                            <div className="text-right">
                                                                <p className="text-xs font-semibold text-slate-500">Completed At</p>
                                                                <p className="font-bold text-slate-900">
                                                                    {pickup.completed_at_formatted || 'N/A'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {pickup.pickup_point && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                            <div>
                                                                <p className="mb-1 text-xs font-semibold text-slate-500">Pickup Location</p>
                                                                <p className="font-bold text-slate-900">{pickup.pickup_point.name}</p>
                                                                <p className="text-sm text-slate-600">{pickup.pickup_point.address}</p>
                                                                {pickup.pickup_point.pickup_time && (
                                                                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                                                                        Time: {formatTime(pickup.pickup_point.pickup_time)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {pickup.driver && (
                                                        <div className="mt-3 flex items-center gap-3 border-t border-slate-200 pt-3">
                                                            {pickup.driver.profile_picture_url && (
                                                                <img src={pickup.driver.profile_picture_url} alt={pickup.driver.name} className="h-10 w-10 rounded-lg border border-slate-200 object-cover" />
                                                            )}
                                                            <div>
                                                                <p className="mb-1 text-xs font-semibold text-slate-500">Driver</p>
                                                                <p className="font-bold text-slate-900">{pickup.driver.name}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {pickup.notes && (
                                                        <div className="mt-3 border-t border-slate-200 pt-3">
                                                            <p className="mb-1 text-xs font-semibold text-slate-500">Notes</p>
                                                            <p className="whitespace-pre-wrap text-sm text-slate-600">{pickup.notes}</p>
                                                        </div>
                                                    )}

                                                    {pickup.booking_id && (
                                                        <div className="mt-3 border-t border-slate-200 pt-3">
                                                            <Link
                                                                href={`/parent/bookings/${pickup.booking_id}`}
                                                                className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
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
                                    className="mx-auto h-12 w-12 text-slate-300"
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
                                <h3 className="mt-4 text-xl font-bold text-slate-900">No Pickup History</h3>
                                <p className="mt-2 font-medium text-slate-500">
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

