import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

// Use the configured axios instance from bootstrap.js which has CSRF token
const axios = window.axios;



export default function Roster({ route, date, isSchoolDay, groupedBookings, message, canCompleteRoute, isRouteCompleted }) {
    const [completing, setCompleting] = useState({});
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);



    const handleCompleteRoute = async (e) => {
        e.preventDefault();
        if (!route || !canCompleteRoute) return;

        setSubmitting(true);
        try {
            const response = await axios.post(`/driver/routes/${route.id}/mark-complete`, { notes });

            const data = response.data;

            if (data.success) {
                setShowCompletionModal(false);
                setNotes('');
                router.reload();
            } else {
                alert(data.message || 'Failed to mark route as complete');
            }
        } catch (error) {
            console.error('Error marking route as complete:', error);
            if (error.message?.includes('419') || error.message?.includes('CSRF')) {
                window.location.href = '/login';
            } else {
                alert('An error occurred while marking the route as complete');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const markPickupPointComplete = async (pickupPointId) => {
        if (!route) return;
        const key = `${pickupPointId}-${route.id}`;
        setCompleting({ ...completing, [key]: true });


        try {
            const response = await axios.post('/driver/pickup-points/mark-complete', {
                pickup_point_id: pickupPointId,
                route_id: route.id,
                date: date || new Date().toISOString().split('T')[0],
            });

            if (response.data.success) {
                // Reload the page to show updated status
                router.reload();
            } else {
                alert(response.data.message || 'Failed to mark trip as complete');
                setCompleting({ ...completing, [key]: false });
            }
        } catch (error) {
            console.error('Error marking trip as complete:', error);

            // Handle CSRF token mismatch
            if (error.response?.status === 419 || error.response?.data?.message?.includes('CSRF')) {
                window.location.href = '/login';
                return;
            }

            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while marking the trip as complete';
            alert(errorMessage);
            setCompleting({ ...completing, [key]: false });
        }
    };

    const markBookingComplete = async (bookingId) => {
        setCompleting({ ...completing, [bookingId]: true });


        try {
            const response = await axios.post(`/driver/bookings/${bookingId}/mark-complete`);

            if (response.data.success) {
                // Reload the page to show updated status
                router.reload();
            } else {
                alert(response.data.message || 'Failed to mark trip as complete');
                setCompleting({ ...completing, [bookingId]: false });
            }
        } catch (error) {
            console.error('Error marking trip as complete:', error);

            // Handle CSRF token mismatch
            if (error.response?.status === 419 || error.response?.data?.message?.includes('CSRF')) {
                window.location.href = '/login';
                return;
            }

            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while marking the trip as complete';
            alert(errorMessage);
            setCompleting({ ...completing, [bookingId]: false });
        }
    };

    return (
        <DriverLayout>
            <Head title="Daily Roster" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                            Daily Roster
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-brand-primary/90">View your schedule and student pickups</p>
                    </div>

                    {message && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                                <p className="text-yellow-200 font-semibold">{message}</p>
                            </div>
                        </GlassCard>
                    )}

                    {/* Route Completion Status */}
                    {isRouteCompleted && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-green-200 font-semibold text-lg">
                                        This route has been completed today.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Complete Route Button */}
                    {canCompleteRoute && (
                        <GlassCard className="mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-bold text-white">All pickups and dropoffs are complete!</p>
                                    <p className="text-sm font-semibold text-white/80 mt-1">Mark this route as complete to proceed.</p>
                                </div>
                                <GlassButton
                                    variant="success"
                                    onClick={() => setShowCompletionModal(true)}
                                >
                                    Complete Route
                                </GlassButton>
                            </div>
                        </GlassCard>
                    )}

                    {!route ? (
                        <GlassCard>
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Routes Assigned</h3>
                                <p className="mt-2 text-base font-semibold text-white/90">
                                    No routes have been assigned to you yet. Please contact your administrator.
                                </p>
                            </div>
                        </GlassCard>
                    ) : (
                        <>
                            {/* Route Information */}
                            <GlassCard className="mb-6">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Route: {route.name}</h3>
                                            {route.vehicle && (
                                                <p className="text-base font-semibold text-white/90 mb-1">
                                                    Vehicle: {route.vehicle.make} {route.vehicle.model} ({route.vehicle.license_plate})
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-white/70">
                                                Date: {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {!isSchoolDay ? (
                                <GlassCard>
                                    <div className="p-6 bg-blue-500/20 border border-blue-400/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-blue-200 font-semibold text-lg">
                                                This is not a school day (holiday or closure).
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            ) : groupedBookings.length === 0 ? (
                                <GlassCard>
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p className="mt-4 text-lg font-semibold text-white">No bookings for this date</p>
                                        <p className="mt-2 text-base font-medium text-white/70">
                                            {route ? `No bookings found for ${route.name} on this date.` : 'No bookings found for the selected date.'}
                                        </p>
                                    </div>
                                </GlassCard>
                            ) : (
                                <div className="space-y-6">
                                    {groupedBookings.map((group, index) => {
                                        const allCompleted = group.bookings.every(b => b.hasDailyPickup);
                                        const someCompleted = group.bookings.some(b => b.hasDailyPickup);
                                        const key = `${group.pickup_point.id}-${route?.id}`;
                                        const isCompleting = completing[key];

                                        return (
                                            <GlassCard key={index}>
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-xl font-bold text-white">
                                                                    {group.pickup_point.name}
                                                                </h3>
                                                                {allCompleted && (
                                                                    <span className="inline-flex px-2 py-1 bg-green-500/30 text-green-100 border border-green-400/50 text-xs font-semibold rounded-full">
                                                                        Completed
                                                                    </span>
                                                                )}
                                                                {someCompleted && !allCompleted && (
                                                                    <span className="inline-flex px-2 py-1 bg-yellow-500/30 text-yellow-100 border border-yellow-400/50 text-xs font-semibold rounded-full">
                                                                        Partial
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm font-semibold text-white/90">
                                                                {group.pickup_point.address}
                                                            </p>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <svg className="w-4 h-4 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-sm font-bold text-green-300">Pickup: {group.pickup_point.pickup_time}</span>
                                                            </div>
                                                            {group.pickup_point.dropoff_time && (
                                                                <p className="text-sm font-semibold text-white/80">Dropoff: {group.pickup_point.dropoff_time}</p>
                                                            )}
                                                            <span className="inline-flex mt-2 px-2 py-1 bg-blue-500/30 text-blue-100 border border-blue-400/50 text-xs font-semibold rounded-full">
                                                                #{group.pickup_point.sequence_order}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {!allCompleted && route && group.pickup_point.id && (
                                                        <div className="mb-4">
                                                            <GlassButton
                                                                variant="success"
                                                                onClick={() => markPickupPointComplete(group.pickup_point.id)}
                                                                disabled={isCompleting}
                                                                className="text-sm py-2 px-4"
                                                            >
                                                                {isCompleting ? 'Marking...' : 'Mark All as Complete'}
                                                            </GlassButton>
                                                        </div>
                                                    )}
                                                    {!group.pickup_point.id && (
                                                        <div className="mb-4">
                                                            <p className="text-sm text-yellow-300 font-semibold">
                                                                Custom addresses must be marked individually
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="border-t border-white/20 pt-4">
                                                        <h4 className="text-base font-bold text-white mb-4">
                                                            Students ({group.bookings.length})
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {group.bookings.map((booking) => {
                                                                const isBookingCompleting = completing[booking.id];
                                                                const isCompleted = booking.hasDailyPickup;

                                                                return (
                                                                    <div
                                                                        key={booking.id}
                                                                        className={`p-4 glass-card rounded-lg border ${isCompleted
                                                                                ? 'border-green-400/50 bg-green-500/10'
                                                                                : 'border-white/20'
                                                                            }`}
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex items-center gap-3 flex-1">
                                                                                {booking.student.profile_picture_url ? (
                                                                                    <img src={booking.student.profile_picture_url} alt={booking.student.name} className="w-10 h-10 rounded-lg object-cover border-2 border-yellow-400/50 flex-shrink-0" />
                                                                                ) : (
                                                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                        <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                )}
                                                                                <div>
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <p className="font-bold text-white text-base">
                                                                                        {booking.student.name}
                                                                                    </p>
                                                                                    {isCompleted && (
                                                                                        <svg className="w-5 h-5 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-sm font-semibold text-white/90 mt-1">
                                                                                    {booking.student.school}
                                                                                </p>
                                                                                {booking.student.grade && (
                                                                                    <p className="text-xs font-medium text-white/70 mt-1">
                                                                                        Grade: {booking.student.grade}
                                                                                    </p>
                                                                                )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right ml-4">
                                                                                {booking.student.emergency_phone && (
                                                                                    <div className="mb-2">
                                                                                        <p className="text-xs font-semibold text-white/70">Emergency</p>
                                                                                        <p className="text-sm font-bold text-white">
                                                                                            {booking.student.emergency_phone}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {!isCompleted && (
                                                                                    <GlassButton
                                                                                        variant="success"
                                                                                        onClick={() => markBookingComplete(booking.id)}
                                                                                        disabled={isBookingCompleting}
                                                                                        className="text-xs py-1 px-2 mt-2"
                                                                                    >
                                                                                        {isBookingCompleting ? '...' : 'Complete'}
                                                                                    </GlassButton>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Route Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Complete Route</h3>
                            <p className="text-white/90 mb-4">
                                Are you sure you want to mark this route as complete? All pickups and dropoffs should be finished.
                            </p>
                            <form onSubmit={handleCompleteRoute}>
                                <div className="mb-4">
                                    <label htmlFor="notes" className="block text-base font-bold text-white mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        className="w-full glass-input text-white placeholder-gray-300 resize-none"
                                        placeholder="Add any notes about the route completion..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <GlassButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setShowCompletionModal(false);
                                            setNotes('');
                                        }}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </GlassButton>
                                    <GlassButton
                                        type="submit"
                                        variant="success"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Completing...' : 'Complete Route'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            )}
        </DriverLayout>
    );
}
