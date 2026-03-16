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
                                    className="mb-4 inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-slate-900"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Booking Details
                                </Link>
                                <h1 className="mb-2 text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
                                    Pickup History
                                </h1>
                                <div className="flex items-center gap-3">
                                    {booking.student?.profile_picture_url ? (
                                        <img src={booking.student.profile_picture_url} alt={booking.student?.name} className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400">
                                            <svg className="h-5 w-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                    <p className="text-base font-semibold text-slate-600 sm:text-lg">
                                        {booking.student?.name} - {booking.route?.name || 'Route'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold text-slate-500">Total Pickups</p>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        {statistics.total}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50">
                                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold text-slate-500">Completed</p>
                                    <p className="text-3xl font-extrabold text-amber-600">
                                        {statistics.completed}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold text-slate-500">Morning (AM)</p>
                                    <p className="text-3xl font-extrabold text-amber-500">
                                        {statistics.am}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold text-slate-500">Afternoon (PM)</p>
                                    <p className="text-3xl font-extrabold text-sky-600">
                                        {statistics.pm}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50">
                                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Booking Information */}
                    <GlassCard className="mb-6">
                        <div className="p-6">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">Booking Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="text-sm font-semibold text-slate-500">Student:</span>
                                    <p className="font-bold text-slate-900">{booking.student?.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-500">Route:</span>
                                    <p className="font-bold text-slate-900">{booking.route?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-500">Plan Type:</span>
                                    <p className="font-bold text-slate-900">
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
                                                    <h3 className="text-2xl font-bold text-slate-900">
                                                        {pickups[0].pickup_date_formatted}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                                        {pickups.length} pickup{pickups.length !== 1 ? 's' : ''} recorded
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {pickups.every(p => p.completed_at) && (
                                                        <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
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
                                                    <div key={pickup.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                                                    pickup.period === 'am'
                                                                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                                        : 'border-sky-200 bg-sky-50 text-sky-700'
                                                                }`}>
                                                                    {pickup.period?.toUpperCase() || 'AM'}
                                                                </span>
                                                                {pickup.completed_at && (
                                                                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Completed
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {pickup.completed_at && (
                                                                <div className="text-right">
                                                                    <span className="text-xs font-semibold text-slate-500">Completed At:</span>
                                                                    <p className="text-sm font-bold text-slate-900">
                                                                        {pickup.completed_at_formatted}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            {/* Pickup Location */}
                                                            <div>
                                                                <span className="text-sm font-semibold text-slate-500">Pickup Location:</span>
                                                                {(pickup.pickup_address || pickup.pickup_point?.address) ? (
                                                                    <>
                                                                        <p className="mt-1 font-bold text-slate-900">
                                                                            {pickup.pickup_address || pickup.pickup_point?.address}
                                                                        </p>
                                                                        {pickup.pickup_point?.pickup_time && (
                                                                            <p className="mt-2 text-xs text-slate-500">
                                                                                Scheduled: {formatTime(pickup.pickup_point.pickup_time)}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className="mt-1 text-sm text-slate-500">Address not set</p>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Driver Information */}
                                                            <div>
                                                                {pickup.driver && (
                                                                    <div className="flex items-center gap-3">
                                                                        {pickup.driver.profile_picture_url ? (
                                                                            <img src={pickup.driver.profile_picture_url} alt={pickup.driver.name} className="h-10 w-10 rounded-lg border border-slate-200 object-cover" />
                                                                        ) : null}
                                                                        <div>
                                                                            <span className="text-sm font-semibold text-slate-500">Driver:</span>
                                                                            <p className="mt-1 font-bold text-slate-900">{pickup.driver.name}</p>
                                                                            {pickup.driver.email && (
                                                                                <p className="mt-1 text-xs text-slate-500">{pickup.driver.email}</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Notes */}
                                                        {pickup.notes && (
                                                            <div className="mt-4 border-t border-slate-200 pt-4">
                                                                <span className="text-sm font-semibold text-slate-500">Notes:</span>
                                                                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{pickup.notes}</p>
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
                                <h3 className="mb-2 text-xl font-bold text-slate-900">No Pickup History</h3>
                                <p className="text-base font-semibold text-slate-600">
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

