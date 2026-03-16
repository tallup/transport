import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    Car,
    Clock3,
    MapPin,
    Route,
    UserRound,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import StatusBadge from '@/Components/StatusBadge';

export default function ShowBooking({ booking, price, dailyPickups }) {
    const { auth, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
        setShowFlash(true);
    }, [flash?.success, flash?.error]);

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            let date;
            if (typeof timeString === 'string') {
                if (timeString.includes('T') || timeString.includes(' ')) {
                    date = new Date(timeString);
                } else if (timeString.includes(':') && timeString.length <= 8) {
                    date = new Date(`2000-01-01T${timeString}`);
                } else {
                    return timeString;
                }
            } else {
                date = new Date(timeString);
            }
            if (Number.isNaN(date.getTime())) return timeString;
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            return timeString;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Booking Details" />

            <div className="py-10">
                <div className="container space-y-6">
                    <Link
                        href="/parent/bookings"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-secondary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to My Bookings
                    </Link>

                    {showFlash && flash?.success && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                            {flash.success}
                        </div>
                    )}
                    {showFlash && flash?.error && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Booking Details
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">
                                Review status, trip info, route, and schedule.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {booking.status === 'pending' && (
                                <>
                                    <Link href={`/parent/bookings/${booking.id}/checkout`}>
                                        <GlassButton variant="success">Pay Now</GlassButton>
                                    </Link>
                                    <Link href={`/parent/bookings/${booking.id}/edit`}>
                                        <GlassButton variant="secondary">Edit Booking</GlassButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <StatusBadge
                            type="booking"
                            status={booking.status}
                            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium"
                        />
                    </div>

                    {booking.status === 'awaiting_approval' && (
                        <GlassCard>
                            <p className="text-sm font-medium text-amber-700">
                                Payment was received and this booking is awaiting admin approval.
                            </p>
                        </GlassCard>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <GlassCard>
                            <div className="mb-4 flex items-center gap-2">
                                <UserRound className="h-5 w-5 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">Student Information</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <p className="text-slate-900"><span className="font-medium">Name:</span> {booking.student?.name || 'N/A'}</p>
                                {booking.student?.school && <p className="text-slate-700"><span className="font-medium">School:</span> {booking.student.school.name}</p>}
                                {booking.student?.grade && <p className="text-slate-700"><span className="font-medium">Grade:</span> {booking.student.grade}</p>}
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="mb-4 flex items-center gap-2">
                                <Route className="h-5 w-5 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">Route Information</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <p className="text-slate-900"><span className="font-medium">Route:</span> {booking.route?.name || 'N/A'}</p>
                                {booking.route?.vehicle && (
                                    <p className="text-slate-700">
                                        <span className="font-medium">Vehicle:</span> {booking.route.vehicle.make} {booking.route.vehicle.model}
                                        {booking.route.vehicle.license_plate ? ` (${booking.route.vehicle.license_plate})` : ''}
                                    </p>
                                )}
                                {booking.route?.driver && <p className="text-slate-700"><span className="font-medium">Driver:</span> {booking.route.driver.name}</p>}
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="mb-4 flex items-center gap-2">
                                <Car className="h-5 w-5 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">Booking Details</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <p className="text-slate-900">
                                    <span className="font-medium">Plan:</span>{' '}
                                    {booking.plan_type === 'academic_term'
                                        ? 'Academic Term'
                                        : booking.plan_type?.replace('_', '-').toUpperCase() || 'N/A'}
                                </p>
                                <p className="text-slate-700">
                                    <span className="font-medium">Trip type:</span> {booking.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                </p>
                                {booking.trip_type === 'one_way' && (
                                    <p className="text-slate-700">
                                        <span className="font-medium">Service:</span>{' '}
                                        {booking.trip_direction === 'pickup_only' ? 'Pickup only' : 'Dropoff only'}
                                    </p>
                                )}
                                {price && (
                                    <div className="border-t border-slate-200 pt-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-500">Total price</p>
                                        <p className="text-xl font-semibold text-amber-700">{price.formatted}</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <GlassCard>
                            <div className="mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">Morning Pickup</h3>
                            </div>
                            <div className="space-y-3 text-sm text-slate-700">
                                {booking.pickup_address ? (
                                    <>
                                        <p className="text-slate-900 font-medium">{booking.pickup_address}</p>
                                        {booking.route?.pickup_time && (
                                            <p><span className="font-medium">Time:</span> {formatTime(booking.route.pickup_time)}</p>
                                        )}
                                    </>
                                ) : (
                                    <p>Pickup address not specified.</p>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="mb-4 flex items-center gap-2">
                                <Clock3 className="h-5 w-5 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">Afternoon Dropoff</h3>
                            </div>
                            <div className="space-y-3 text-sm text-slate-700">
                                {booking.pickup_address ? (
                                    <>
                                        <p className="text-slate-900 font-medium">{booking.pickup_address}</p>
                                        {booking.route?.dropoff_time && (
                                            <p><span className="font-medium">Time:</span> {formatTime(booking.route.dropoff_time)}</p>
                                        )}
                                    </>
                                ) : booking.student?.school ? (
                                    <>
                                        <p className="text-slate-900 font-medium">{booking.student.school.name}</p>
                                        {booking.route?.dropoff_time && (
                                            <p><span className="font-medium">Time:</span> {formatTime(booking.route.dropoff_time)}</p>
                                        )}
                                    </>
                                ) : (
                                    <p>Dropoff location not specified.</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    <GlassCard>
                        <div className="mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-slate-500" />
                            <h3 className="text-base font-semibold text-slate-900">Booking Dates</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <p className="text-slate-700">
                                <span className="font-medium text-slate-900">Start:</span>{' '}
                                {new Date(booking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {booking.end_date && (
                                <p className="text-slate-700">
                                    <span className="font-medium text-slate-900">End:</span>{' '}
                                    {new Date(booking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </GlassCard>

                    {dailyPickups && typeof dailyPickups === 'object' && Object.keys(dailyPickups).length > 0 && (
                        <GlassCard>
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Pickup History</h3>
                                    <p className="text-sm text-slate-600">
                                        {Object.values(dailyPickups || {}).flat().length} pickup
                                        {Object.values(dailyPickups || {}).flat().length !== 1 ? 's' : ''} recorded
                                    </p>
                                </div>
                                <Link href={`/parent/bookings/${booking?.id}/pickup-history`}>
                                    <GlassButton variant="secondary">View Full History</GlassButton>
                                </Link>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
