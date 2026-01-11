import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function ShowBooking({ booking, price }) {
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

                    <GlassCard className="overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-white drop-shadow-lg mb-2">
                                        Booking Details
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                                            booking.status === 'active' ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                                            booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                            booking.status === 'cancelled' ? 'bg-red-500/30 text-red-100 border-red-400/50' :
                                            booking.status === 'completed' ? 'bg-blue-500/30 text-blue-100 border-blue-400/50' :
                                            'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                        }`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                        {booking.status === 'pending' && (
                                            <Link
                                                href={`/parent/bookings/${booking.id}/edit`}
                                                className="px-4 py-2 bg-yellow-500/30 backdrop-blur-sm border border-yellow-400/50 rounded-md text-white font-bold hover:bg-yellow-500/50 transition text-sm"
                                            >
                                                Edit Booking
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {booking.status === 'pending' && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/checkout`}
                                        className="px-4 py-2 bg-green-500/30 backdrop-blur-sm border border-green-400/50 rounded-md text-white font-bold hover:bg-green-500/50 transition"
                                    >
                                        Pay Now
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Student Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Student Information
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Name:</span>
                                        <p className="text-white font-bold text-lg">{booking.student?.name}</p>
                                    </div>
                                    {booking.student?.school && (
                                        <div>
                                            <span className="text-white/70 font-semibold">School:</span>
                                            <p className="text-white font-semibold">{booking.student.school.name}</p>
                                        </div>
                                    )}
                                    {booking.student?.grade && (
                                        <div>
                                            <span className="text-white/70 font-semibold">Grade:</span>
                                            <p className="text-white font-semibold">{booking.student.grade}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Route Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Route Information
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Route:</span>
                                        <p className="text-white font-bold text-lg">{booking.route?.name || 'N/A'}</p>
                                    </div>
                                    {booking.route?.vehicle && (
                                        <div>
                                            <span className="text-white/70 font-semibold">Vehicle:</span>
                                            <p className="text-white font-semibold">
                                                {booking.route.vehicle.make} {booking.route.vehicle.model} 
                                                {booking.route.vehicle.license_plate && ` (${booking.route.vehicle.license_plate})`}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pickup Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Pickup Information
                                    </h3>
                                    {booking.pickup_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Pickup Point:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.pickup_point.address}</p>
                                            </div>
                                            {booking.pickup_point.pickup_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Pickup Time:</span>
                                                    <p className="text-white font-semibold">{formatTime(booking.pickup_point.pickup_time)}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.pickup_address ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Pickup Address:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_address}</p>
                                            </div>
                                            {booking.route?.pickup_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Pickup Time:</span>
                                                    <p className="text-white font-semibold">{formatTime(booking.route.pickup_time)}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-white/70">No pickup information provided</p>
                                    )}
                                </div>

                                {/* Dropoff Information */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Dropoff Information
                                    </h3>
                                    {booking.dropoff_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Dropoff Point:</span>
                                                <p className="text-white font-bold text-lg">{booking.dropoff_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.dropoff_point.address}</p>
                                            </div>
                                            {booking.dropoff_point.dropoff_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Dropoff Time:</span>
                                                    <p className="text-white font-semibold">{formatTime(booking.dropoff_point.dropoff_time)}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.pickup_point ? (
                                        <>
                                            <div>
                                                <span className="text-white/70 font-semibold">Dropoff Point:</span>
                                                <p className="text-white font-bold text-lg">{booking.pickup_point.name}</p>
                                                <p className="text-white/80 text-sm mt-1">{booking.pickup_point.address}</p>
                                            </div>
                                            {booking.pickup_point.dropoff_time && (
                                                <div>
                                                    <span className="text-white/70 font-semibold">Dropoff Time:</span>
                                                    <p className="text-white font-semibold">{formatTime(booking.pickup_point.dropoff_time)}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : booking.route?.dropoff_time ? (
                                        <div>
                                            <span className="text-white/70 font-semibold">Dropoff Location:</span>
                                            <p className="text-white font-semibold">{booking.student?.school?.name || 'School'}</p>
                                            <div className="mt-2">
                                                <span className="text-white/70 font-semibold">Dropoff Time:</span>
                                                <p className="text-white font-semibold">{formatTime(booking.route.dropoff_time)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-white/70">Dropoff information not specified</p>
                                    )}
                                </div>

                                {/* Booking Details */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-white/30 pb-2">
                                        Booking Details
                                    </h3>
                                    <div>
                                        <span className="text-white/70 font-semibold">Plan Type:</span>
                                        <p className="text-white font-semibold">
                                            {booking.plan_type === 'academic_term' ? 'Academic Term' : booking.plan_type.replace('_', '-').toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Trip Type:</span>
                                        <p className="text-white font-semibold">
                                            {booking.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 font-semibold">Start Date:</span>
                                        <p className="text-white font-semibold">
                                            {new Date(booking.start_date).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    {booking.end_date && (
                                        <div>
                                            <span className="text-white/70 font-semibold">End Date:</span>
                                            <p className="text-white font-semibold">
                                                {new Date(booking.end_date).toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    )}
                                    {price && (
                                        <div className="border-t border-white/30 pt-4 mt-4">
                                            <span className="text-white/70 font-semibold">Total Price:</span>
                                            <p className="text-white font-extrabold text-2xl text-green-200 mt-1">
                                                {price.formatted}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-white/30 flex gap-3 flex-wrap">
                                {booking.status === 'pending' && (
                                    <>
                                        <Link
                                            href={`/parent/bookings/${booking.id}/edit`}
                                            className="px-4 py-2 bg-yellow-500/30 backdrop-blur-sm border border-yellow-400/50 rounded-md text-white font-bold hover:bg-yellow-500/50 transition"
                                        >
                                            Edit Booking
                                        </Link>
                                        <Link
                                            href={`/parent/bookings/${booking.id}/checkout`}
                                            className="px-4 py-2 bg-green-500/30 backdrop-blur-sm border border-green-400/50 rounded-md text-white font-bold hover:bg-green-500/50 transition"
                                        >
                                            Complete Payment
                                        </Link>
                                    </>
                                )}
                                {(booking.status === 'active' || booking.status === 'expired') && new Date(booking.start_date) > new Date() && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/edit`}
                                        className="px-4 py-2 bg-yellow-500/30 backdrop-blur-sm border border-yellow-400/50 rounded-md text-white font-bold hover:bg-yellow-500/50 transition"
                                    >
                                        Edit Booking
                                    </Link>
                                )}
                                {(booking.status === 'active' || booking.status === 'expired') && (
                                    <Link
                                        href={`/parent/bookings/${booking.id}/rebook`}
                                        className="px-4 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 rounded-md text-white font-bold hover:bg-purple-500/50 transition"
                                    >
                                        Rebook
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



