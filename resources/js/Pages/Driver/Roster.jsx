import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Roster({ routes, selectedRoute, date: initialDate, isSchoolDay, groupedBookings, message }) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedRouteId, setSelectedRouteId] = useState(selectedRoute?.id || null);
    const [completing, setCompleting] = useState({});

    const markPickupPointComplete = async (pickupPointId, routeId) => {
        const key = `${pickupPointId}-${routeId}`;
        setCompleting({ ...completing, [key]: true });

        try {
            const response = await fetch('/driver/pickup-points/mark-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    pickup_point_id: pickupPointId,
                    route_id: routeId,
                    date: selectedDate,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Reload the page to show updated status
                router.reload({ only: ['groupedBookings'] });
            } else {
                alert(data.message || 'Failed to mark trip as complete');
            }
        } catch (error) {
            console.error('Error marking trip as complete:', error);
            alert('An error occurred while marking the trip as complete');
        } finally {
            setCompleting({ ...completing, [key]: false });
        }
    };

    const markBookingComplete = async (bookingId) => {
        setCompleting({ ...completing, [bookingId]: true });

        try {
            const response = await fetch(`/driver/bookings/${bookingId}/mark-complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });

            const data = await response.json();

            if (data.success) {
                // Reload the page to show updated status
                router.reload({ only: ['groupedBookings'] });
            } else {
                alert(data.message || 'Failed to mark trip as complete');
            }
        } catch (error) {
            console.error('Error marking trip as complete:', error);
            alert('An error occurred while marking the trip as complete');
        } finally {
            setCompleting({ ...completing, [bookingId]: false });
        }
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get('/driver/roster', { 
            date: newDate,
            route_id: selectedRouteId 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRouteChange = (e) => {
        const routeId = e.target.value ? parseInt(e.target.value) : null;
        setSelectedRouteId(routeId);
        router.get('/driver/roster', { 
            date: selectedDate,
            route_id: routeId 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <DriverLayout>
            <Head title="Daily Roster" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                            Daily Roster
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-white/90">View your schedule and student pickups</p>
                    </div>

                    {/* Filters */}
                    <GlassCard className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-base font-bold text-white mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="w-full glass-input text-white font-semibold py-2 px-4 rounded-lg"
                                />
                            </div>
                            {routes && routes.length > 1 && (
                                <div>
                                    <label className="block text-base font-bold text-white mb-2">
                                        Select Route
                                    </label>
                                    <select
                                        value={selectedRouteId || ''}
                                        onChange={handleRouteChange}
                                        className="w-full glass-input text-white font-semibold py-2 px-4 rounded-lg"
                                    >
                                        <option value="">All Routes</option>
                                        {routes.map((route) => (
                                            <option key={route.id} value={route.id} className="bg-gray-800">
                                                {route.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {message && (
                        <GlassCard className="mb-6">
                            <div className="p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                                <p className="text-yellow-200 font-semibold">{message}</p>
                            </div>
                        </GlassCard>
                    )}

                    {routes && routes.length === 0 ? (
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
                            {selectedRoute && (
                                <GlassCard className="mb-6">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Route: {selectedRoute.name}</h3>
                                                {selectedRoute.vehicle && (
                                                    <p className="text-base font-semibold text-white/90 mb-1">
                                                        Vehicle: {selectedRoute.vehicle.make} {selectedRoute.vehicle.model} ({selectedRoute.vehicle.license_plate})
                                                    </p>
                                                )}
                                                <p className="text-sm font-medium text-white/70">
                                                    Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
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
                            )}

                            {!isSchoolDay ? (
                                <GlassCard>
                                    <div className="p-6 bg-blue-500/20 border border-blue-400/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            {selectedRoute ? `No bookings found for ${selectedRoute.name} on this date.` : 'No bookings found for the selected date.'}
                                        </p>
                                    </div>
                                </GlassCard>
                            ) : (
                                <div className="space-y-6">
                                    {groupedBookings.map((group, index) => {
                                        const allCompleted = group.bookings.every(b => b.status === 'completed');
                                        const someCompleted = group.bookings.some(b => b.status === 'completed');
                                        const key = `${group.pickup_point.id}-${selectedRoute?.id}`;
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
                                                                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                                                    {!allCompleted && selectedRoute && (
                                                        <div className="mb-4">
                                                            <GlassButton
                                                                variant="success"
                                                                onClick={() => markPickupPointComplete(group.pickup_point.id, selectedRoute.id)}
                                                                disabled={isCompleting}
                                                                className="text-sm py-2 px-4"
                                                            >
                                                                {isCompleting ? 'Marking...' : 'Mark All as Complete'}
                                                            </GlassButton>
                                                        </div>
                                                    )}

                                                <div className="border-t border-white/20 pt-4">
                                                    <h4 className="text-base font-bold text-white mb-4">
                                                        Students ({group.bookings.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {group.bookings.map((booking) => {
                                                            const isBookingCompleting = completing[booking.id];
                                                            const isCompleted = booking.status === 'completed';

                                                            return (
                                                                <div
                                                                    key={booking.id}
                                                                    className={`p-4 glass-card rounded-lg border ${
                                                                        isCompleted 
                                                                            ? 'border-green-400/50 bg-green-500/10' 
                                                                            : 'border-white/20'
                                                                    }`}
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <p className="font-bold text-white text-base">
                                                                                    {booking.student.name}
                                                                                </p>
                                                                                {isCompleted && (
                                                                                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            </GlassCard>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}
