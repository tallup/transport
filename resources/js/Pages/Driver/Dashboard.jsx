import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bus,
    Clock3,
    MapPinned,
    Route,
    Users,
} from 'lucide-react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import Timeline from '@/Components/Timeline';
import GlassButton from '@/Components/GlassButton';

export default function Dashboard({
    route,
    stats,
    todaySchedule,
    performanceMetrics,
    studentsList,
    canCompleteRoute,
    isRouteCompleted,
    canStartTrip,
    isTripStarted,
}) {
    const { auth } = usePage().props;
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [startTripSubmitting, setStartTripSubmitting] = useState(false);

    const handleCompleteRoute = async (e) => {
        e.preventDefault();
        if (!route || !canCompleteRoute) return;

        setSubmitting(true);
        try {
            const response = await window.axios.post(`/driver/routes/${route.id}/mark-complete`, { notes });
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
            alert('An error occurred while marking the route as complete');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartTrip = async (e) => {
        e.preventDefault();
        if (!route || !canStartTrip || isTripStarted) return;

        setStartTripSubmitting(true);
        try {
            const response = await window.axios.post(`/driver/routes/${route.id}/start-trip`);
            const data = response.data;

            if (data.success) {
                router.reload();
            } else {
                alert(data.message || 'Failed to start trip');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred while starting the trip';
            alert(message);
        } finally {
            setStartTripSubmitting(false);
        }
    };

    return (
        <DriverLayout>
            <Head title="Driver Dashboard" />

            <div className="driver-page-shell py-10">
                <div className="container space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Welcome, {auth?.user?.name || 'Driver'}
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 md:text-base">
                            Your route details and today schedule.
                        </p>
                    </div>

                    {!route ? (
                        <GlassCard>
                            <div className="py-10 text-center">
                                <h3 className="text-lg font-semibold text-slate-900">No Route Assigned</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    No active route has been assigned yet. Contact the administrator.
                                </p>
                                <p className="mt-1 text-xs text-slate-500">Account: {auth?.user?.email || 'Unknown'}</p>
                            </div>
                        </GlassCard>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <GlassCard>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Route Name</p>
                                            <p className="mt-2 text-xl font-semibold text-slate-900">{stats.route_name}</p>
                                        </div>
                                        <Route className="h-5 w-5 text-slate-500" />
                                    </div>
                                </GlassCard>
                                <GlassCard>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Vehicle</p>
                                            <p className="mt-2 text-xl font-semibold text-slate-900">{stats.vehicle}</p>
                                        </div>
                                        <Bus className="h-5 w-5 text-slate-500" />
                                    </div>
                                </GlassCard>
                                <GlassCard>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Total Students</p>
                                            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total_students}</p>
                                        </div>
                                        <Users className="h-5 w-5 text-slate-500" />
                                    </div>
                                </GlassCard>
                                <GlassCard>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Pickup Time</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.pickup_time || 'N/A'}</p>
                                            {stats.dropoff_time && (
                                                <p className="mt-1 text-xs text-slate-500">Dropoff: {stats.dropoff_time}</p>
                                            )}
                                        </div>
                                        <Clock3 className="h-5 w-5 text-slate-500" />
                                    </div>
                                </GlassCard>
                            </div>

                            {isRouteCompleted && (
                                <GlassCard>
                                    <p className="text-sm font-medium text-amber-700">
                                        This route has already been completed today.
                                    </p>
                                </GlassCard>
                            )}

                            <GlassCard>
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900">Today Schedule</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {!isRouteCompleted && (
                                            isTripStarted ? (
                                                <GlassButton variant="secondary" disabled>
                                                    Trip started
                                                </GlassButton>
                                            ) : canStartTrip ? (
                                                <GlassButton
                                                    onClick={handleStartTrip}
                                                    disabled={startTripSubmitting}
                                                >
                                                    {startTripSubmitting ? 'Starting...' : 'Start Trip'}
                                                </GlassButton>
                                            ) : null
                                        )}
                                        {canCompleteRoute && (
                                            <GlassButton
                                                variant="success"
                                                onClick={() => setShowCompletionModal(true)}
                                            >
                                                Complete Route
                                            </GlassButton>
                                        )}
                                        <Link href="/driver/roster">
                                            <GlassButton variant="secondary">View Roster</GlassButton>
                                        </Link>
                                    </div>
                                </div>

                                {todaySchedule && todaySchedule.length > 0 ? (
                                    <Timeline items={todaySchedule} />
                                ) : (
                                    <p className="py-8 text-center text-sm text-slate-500">No schedule for today</p>
                                )}
                            </GlassCard>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <GlassCard>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-900">Students & Pickup Schedule</h3>
                                        <Link href="/driver/students-schedule">
                                            <GlassButton variant="secondary" className="text-xs">View details</GlassButton>
                                        </Link>
                                    </div>
                                    <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                                        {(studentsList || []).length > 0 ? (
                                            studentsList.map((student) => (
                                                <div key={`${student.id}-${student.booking_id}`} className="rounded-xl border border-slate-200 bg-white p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                                                            {student.isAbsent && (
                                                                <span className="mt-1 inline-block rounded-lg bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 border border-rose-200">
                                                                    Reported Absent
                                                                </span>
                                                            )}
                                                            <p className="mt-1 text-sm text-slate-600">{student.pickup_point_name}</p>
                                                            {student.pickup_point_address && (
                                                                <p className="mt-1 text-xs text-slate-500">{student.pickup_point_address}</p>
                                                            )}
                                                            <p className="mt-2 text-xs font-medium text-slate-500">
                                                                Pickup: {student.pickup_time}
                                                            </p>
                                                        </div>
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                            #{student.sequence_order}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="py-4 text-center text-sm text-slate-500">No students assigned</p>
                                        )}
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-900">Route Performance</h3>
                                        <Link href="/driver/route-performance">
                                            <GlassButton variant="secondary" className="text-xs">View details</GlassButton>
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-500">On-Time Percentage</p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {performanceMetrics?.on_time_percentage || 0}%
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-500">Total Trips</p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {performanceMetrics?.total_trips || 0}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm font-medium text-slate-500">Avg Students / Trip</p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {performanceMetrics?.average_students_per_trip || 0}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            <GlassCard>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">Route Information</h3>
                                    <Link href="/driver/route-information">
                                        <GlassButton variant="secondary">View details</GlassButton>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Route Name</p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">{route?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Pickup Points</p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">{stats.pickup_points}</p>
                                    </div>
                                    {route?.vehicle && (
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Vehicle</p>
                                                <p className="mt-1 text-base font-semibold text-slate-900">
                                                    {route.vehicle.make} {route.vehicle.model}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">License Plate</p>
                                                <p className="mt-1 text-base font-semibold text-slate-900">{route.vehicle.license_plate}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </GlassCard>
                        </>
                    )}
                </div>
            </div>

            {showCompletionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-md">
                        <h3 className="text-lg font-semibold text-slate-900">Complete Route</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirm route completion after all pickups and dropoffs are finished.
                        </p>
                        <form onSubmit={handleCompleteRoute} className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Notes (optional)
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="form-control resize-none"
                                    placeholder="Add notes about route completion..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
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
                                <GlassButton type="submit" variant="success" disabled={submitting}>
                                    {submitting ? 'Completing...' : 'Complete Route'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </DriverLayout>
    );
}
