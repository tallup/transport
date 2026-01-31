import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function ShowBooking({ booking, price, dailyPickups }) {
    const { auth, flash } = usePage().props;

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

    const formatStatus = (status) => {
        if (status === 'awaiting_approval') {
            return 'AWAITING APPROVAL';
        }
        return status.toUpperCase();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Booking Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/parent/bookings"
                            className="text-white/80 hover:text-white font-semibold mb-4 inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Bookings
                        </Link>
                    </div>

                    {flash?.success && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
                                <p className="text-green-200 font-semibold">{flash.success}</p>
                            </div>
                        </GlassCard>
                    )}

                    {flash?.error && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                <p className="text-red-200 font-semibold">{flash.error}</p>
                            </div>
                        </GlassCard>
                    )}

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Booking Details</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">View your booking information</p>
                            </div>
                            <div className="flex gap-3">
                                {booking.status === 'pending' && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/checkout`}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Pay Now
                                    </Link>
                                )}
                                {booking.status === 'pending' && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/edit`}
                                        className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                    >
                                        Edit Booking
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                            booking.status === 'active' ? 'bg-green-500/30 text-green-200 border border-green-400/50' :
                            booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50' :
                            booking.status === 'awaiting_approval' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50' :
                            booking.status === 'cancelled' ? 'bg-red-500/30 text-red-200 border border-red-400/50' :
                            booking.status === 'completed' ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50' :
                            'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                        }`}>
                            {formatStatus(booking.status)}
                        </span>
                    </div>

                    {booking.status === 'awaiting_approval' && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-amber-500/20 border border-amber-400/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-amber-100 font-semibold">Payment received. Your booking is awaiting admin approval.</p>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Student Information Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Student Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Name</p>
                                    <p className="text-lg font-extrabold text-white">{booking.student?.name || 'N/A'}</p>
                                </div>
                                {booking.student?.school && (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">School</p>
                                        <p className="text-base font-semibold text-white/90">{booking.student.school.name}</p>
                                    </div>
                                )}
                                {booking.student?.grade && (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Grade</p>
                                        <p className="text-base font-semibold text-white/90">{booking.student.grade}</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Route Information Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Route Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Route</p>
                                    <p className="text-lg font-extrabold text-white">{booking.route?.name || 'N/A'}</p>
                                </div>
                                {booking.route?.vehicle && (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Vehicle</p>
                                        <p className="text-base font-semibold text-white/90">
                                            {booking.route.vehicle.make} {booking.route.vehicle.model}
                                            {booking.route.vehicle.license_plate && ` (${booking.route.vehicle.license_plate})`}
                                        </p>
                                    </div>
                                )}
                                {booking.route?.driver && (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Driver</p>
                                        <p className="text-base font-semibold text-white/90">{booking.route.driver.name}</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Booking Details Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Booking Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Plan Type</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {booking.plan_type === 'academic_term' ? 'Academic Term' : booking.plan_type?.replace('_', '-').toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Trip Type</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {booking.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                    </p>
                                </div>
                                {price && (
                                    <div className="pt-4 border-t border-white/20">
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Total Price</p>
                                        <p className="text-2xl font-extrabold text-green-200">{price.formatted}</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Pickup Information Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Pickup Information</h3>
                            </div>
                            <div className="space-y-4">
                                {booking.pickup_point ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Point</p>
                                            <p className="text-lg font-extrabold text-white">{booking.pickup_point.name}</p>
                                            <p className="text-sm text-white/80 mt-1">{booking.pickup_point.address}</p>
                                        </div>
                                        {booking.pickup_point.pickup_time && (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Time</p>
                                                <p className="text-base font-semibold text-green-200">{formatTime(booking.pickup_point.pickup_time)}</p>
                                            </div>
                                        )}
                                    </>
                                ) : booking.pickup_address ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Address</p>
                                            <p className="text-lg font-extrabold text-white">{booking.pickup_address}</p>
                                        </div>
                                        {booking.route?.pickup_time && (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Pickup Time</p>
                                                <p className="text-base font-semibold text-green-200">{formatTime(booking.route.pickup_time)}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-white/70">No pickup information provided</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Dropoff Information Card */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-brand-primary">Dropoff Information</h3>
                            </div>
                            <div className="space-y-4">
                                {booking.dropoff_point ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Point</p>
                                            <p className="text-lg font-extrabold text-white">{booking.dropoff_point.name}</p>
                                            <p className="text-sm text-white/80 mt-1">{booking.dropoff_point.address}</p>
                                        </div>
                                        {booking.dropoff_point.dropoff_time && (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Time</p>
                                                <p className="text-base font-semibold text-green-200">{formatTime(booking.dropoff_point.dropoff_time)}</p>
                                            </div>
                                        )}
                                    </>
                                ) : booking.pickup_point ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Point</p>
                                            <p className="text-lg font-extrabold text-white">{booking.pickup_point.name}</p>
                                            <p className="text-sm text-white/80 mt-1">{booking.pickup_point.address}</p>
                                        </div>
                                        {booking.pickup_point.dropoff_time && (
                                            <div>
                                                <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Time</p>
                                                <p className="text-base font-semibold text-green-200">{formatTime(booking.pickup_point.dropoff_time)}</p>
                                            </div>
                                        )}
                                    </>
                                ) : booking.student?.school ? (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Location</p>
                                        <p className="text-lg font-extrabold text-white">{booking.student.school.name}</p>
                                        {booking.route?.dropoff_time && (
                                            <div className="mt-3">
                                                <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Dropoff Time</p>
                                                <p className="text-base font-semibold text-green-200">{formatTime(booking.route.dropoff_time)}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white/70">Dropoff information not specified</p>
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
                                <h3 className="text-xl font-extrabold text-brand-primary">Dates</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">Start Date</p>
                                    <p className="text-lg font-extrabold text-white">
                                        {new Date(booking.start_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                {booking.end_date && (
                                    <div>
                                        <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-1">End Date</p>
                                        <p className="text-lg font-extrabold text-white">
                                            {new Date(booking.end_date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Action Buttons */}
                    <GlassCard className="mb-6">
                        <div className="p-6">
                            <div className="flex gap-3 flex-wrap">
                                {booking.status === 'pending' && (
                                    <>
                                        <Link
                                            href={`/parent/bookings/${booking.id}/edit`}
                                            className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                        >
                                            Edit Booking
                                        </Link>
                                        <Link
                                            href={`/parent/bookings/${booking.id}/checkout`}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Complete Payment
                                        </Link>
                                    </>
                                )}
                                {(booking.status === 'active' || booking.status === 'expired') && new Date(booking.start_date) > new Date() && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/edit`}
                                        className="px-6 py-3 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                                    >
                                        Edit Booking
                                    </Link>
                                )}
                                {(booking.status === 'active' || booking.status === 'expired') && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/rebook`}
                                        className="px-6 py-3 bg-purple-500/30 border-2 border-purple-400/50 text-white font-bold rounded-xl hover:bg-purple-500/40 transition-all"
                                    >
                                        Rebook
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Pickup History Link */}
                    {dailyPickups && typeof dailyPickups === 'object' && dailyPickups !== null && Object.keys(dailyPickups).length > 0 && (
                        <GlassCard className="mb-6">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-white drop-shadow-lg mb-2">
                                            Pickup History
                                        </h3>
                                        <p className="text-white/70 font-semibold">
                                            {Object.values(dailyPickups || {}).flat().length} pickup{Object.values(dailyPickups || {}).flat().length !== 1 ? 's' : ''} recorded
                                        </p>
                                    </div>
                                    <Link
                                        href={`/parent/bookings/${booking?.id}/pickup-history`}
                                        className="px-6 py-3 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-md text-white font-bold hover:bg-blue-500/50 transition inline-flex items-center gap-2"
                                    >
                                        View Full History
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Enhanced Pickup Details Section */}
                    <GlassCard>
                        <div className="p-6">
                            <h3 className="text-2xl font-extrabold text-white drop-shadow-lg mb-6">
                                Pickup & Dropoff Schedule
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pickup Details */}
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Morning Pickup
                                    </h4>
                                    {booking.pickup_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Location:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.pickup_point.address}</p>
                                                {booking.pickup_point.latitude && booking.pickup_point.longitude && (
                                                    <p className="text-white/60 text-xs mt-1">
                                                        Coordinates: {booking.pickup_point.latitude}, {booking.pickup_point.longitude}
                                                    </p>
                                                )}
                                            </div>
                                            {booking.pickup_point.pickup_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Scheduled Time:</span>
                                                    <p className="text-white font-bold text-lg text-green-300">
                                                        {formatTime(booking.pickup_point.pickup_time)}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.pickup_address ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Location:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_address}</p>
                                                {booking.pickup_latitude && booking.pickup_longitude && (
                                                    <p className="text-white/60 text-xs mt-1">
                                                        Coordinates: {booking.pickup_latitude}, {booking.pickup_longitude}
                                                    </p>
                                                )}
                                            </div>
                                            {booking.route?.pickup_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Scheduled Time:</span>
                                                    <p className="text-white font-bold text-lg text-green-300">
                                                        {formatTime(booking.route.pickup_time)}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-white/70">Pickup location not specified</p>
                                    )}
                                </div>

                                {/* Dropoff Details */}
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Afternoon Dropoff
                                    </h4>
                                    {booking.dropoff_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Location:</span>
                                                <p className="text-white font-bold text-lg">{booking.dropoff_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.dropoff_point.address}</p>
                                                {booking.dropoff_point.latitude && booking.dropoff_point.longitude && (
                                                    <p className="text-white/60 text-xs mt-1">
                                                        Coordinates: {booking.dropoff_point.latitude}, {booking.dropoff_point.longitude}
                                                    </p>
                                                )}
                                            </div>
                                            {booking.dropoff_point.dropoff_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Scheduled Time:</span>
                                                    <p className="text-white font-bold text-lg text-green-300">
                                                        {formatTime(booking.dropoff_point.dropoff_time)}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.pickup_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Location:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.pickup_point.address}</p>
                                            </div>
                                            {booking.pickup_point.dropoff_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Scheduled Time:</span>
                                                    <p className="text-white font-bold text-lg text-green-300">
                                                        {formatTime(booking.pickup_point.dropoff_time)}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.student?.school ? (
                                        <div>
                                            <span className="text-white/70 font-semibold">Location:</span>
                                            <p className="text-white font-bold text-lg">{booking.student.school.name}</p>
                                            {booking.route?.dropoff_time && (
                                                <div className="mt-3">
                                                    <span className="text-white/70 font-semibold">Scheduled Time:</span>
                                                    <p className="text-white font-bold text-lg text-green-300">
                                                        {formatTime(booking.route.dropoff_time)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-white/70">Dropoff location not specified</p>
                                    )}
                                </div>
                            </div>

                            {/* Route Information */}
                            {booking.route && (
                                <div className="mt-6 pt-6 border-t border-white/30">
                                    <h4 className="text-xl font-bold text-white mb-4">Route Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <span className="text-white/70 font-semibold">Route Name:</span>
                                            <p className="text-white font-bold">{booking.route.name}</p>
                                        </div>
                                        {booking.route.vehicle && (
                                            <div>
                                                <span className="text-white/70 font-semibold">Vehicle:</span>
                                                <p className="text-white font-bold">
                                                    {booking.route.vehicle.make} {booking.route.vehicle.model}
                                                </p>
                                                {booking.route.vehicle.license_plate && (
                                                    <p className="text-white/80 text-sm">Plate: {booking.route.vehicle.license_plate}</p>
                                                )}
                                            </div>
                                        )}
                                        {booking.route?.driver && (
                                            <div>
                                                <span className="text-white/70 font-semibold">Driver:</span>
                                                <p className="text-white font-bold">{booking.route.driver.name}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



