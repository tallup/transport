import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Bell,
    CalendarClock,
    ClipboardList,
    GraduationCap,
    Plus,
    Route,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({
    students,
    activeBookings,
    activeBookingsCount,
    upcomingPickups,
    transportHistory,
    notifications,
    notificationsUnreadCount = 0,
}) {
    const { auth } = usePage().props;
    const pickupsPerPage = 3;
    const [pickupsPage, setPickupsPage] = useState(1);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const recentBookings = transportHistory?.slice(0, 5) || [];
    const totalUpcomingPickups = upcomingPickups?.length || 0;
    const totalPickupsPages = Math.max(1, Math.ceil(totalUpcomingPickups / pickupsPerPage));

    useEffect(() => {
        if (pickupsPage > totalPickupsPages) setPickupsPage(totalPickupsPages);
        if (pickupsPage < 1) setPickupsPage(1);
    }, [pickupsPage, totalPickupsPages]);

    const pagedUpcomingPickups = useMemo(() => {
        const list = upcomingPickups || [];
        const start = (pickupsPage - 1) * pickupsPerPage;
        return list.slice(start, start + pickupsPerPage);
    }, [upcomingPickups, pickupsPage]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="container space-y-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Welcome back, {auth?.user?.name?.split(' ')[0] || 'User'}
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">{formattedDate}</p>
                        </div>
                        <Link href="/parent/bookings/create">
                            <GlassButton className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Booking
                            </GlassButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Link href="/parent/students">
                            <GlassCard className="h-full">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Students</p>
                                        <p className="mt-2 text-3xl font-semibold text-slate-900">{students?.length || 0}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                                        <GraduationCap className="h-5 w-5 text-slate-600" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>

                        <Link href="/parent/bookings">
                            <GlassCard className="h-full">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Active Bookings</p>
                                        <p className="mt-2 text-3xl font-semibold text-slate-900">{activeBookingsCount ?? activeBookings?.length ?? 0}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                                        <ClipboardList className="h-5 w-5 text-slate-600" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>

                        <GlassCard className="h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Upcoming Pickups</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{upcomingPickups?.length || 0}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                                    <CalendarClock className="h-5 w-5 text-slate-600" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <GlassCard className="lg:col-span-2">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Upcoming Pickups</h3>
                                <div className="flex items-center gap-2">
                                    {totalUpcomingPickups > pickupsPerPage && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setPickupsPage((p) => Math.max(1, p - 1))}
                                                disabled={pickupsPage <= 1}
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
                                            >
                                                Prev
                                            </button>
                                            <span className="text-xs font-medium text-slate-500">{pickupsPage} / {totalPickupsPages}</span>
                                            <button
                                                type="button"
                                                onClick={() => setPickupsPage((p) => Math.min(totalPickupsPages, p + 1))}
                                                disabled={pickupsPage >= totalPickupsPages}
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </>
                                    )}
                                    <Link href="/parent/bookings" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
                                        View all
                                    </Link>
                                </div>
                            </div>
                            {(upcomingPickups && upcomingPickups.length > 0) ? (
                                <div className="space-y-3">
                                    {pagedUpcomingPickups.map((pickup, index) => (
                                        <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{pickup.student}</p>
                                                    <p className="mt-1 text-sm text-slate-600">{pickup.route}</p>
                                                    <p className="mt-2 text-xs text-slate-500">{pickup.pickup_point} - {pickup.pickup_time}</p>
                                                </div>
                                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                                    {pickup.date_label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-sm text-slate-500">No upcoming pickups</p>
                            )}
                        </GlassCard>

                        <GlassCard>
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                                <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                    <Bell className="h-3.5 w-3.5" />
                                    {notificationsUnreadCount > 0 ? notificationsUnreadCount : notifications?.length || 0}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {(notifications && notifications.length > 0) ? (
                                    notifications.map((notification, index) => (
                                        <div key={notification.id ?? index} className="rounded-xl border border-slate-200 bg-white p-3">
                                            <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                                            <p className="mt-1 text-xs text-slate-500">{notification.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-sm text-slate-500">No notifications</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    <GlassCard>
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Recent Bookings</h3>
                            <Link href="/parent/bookings" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
                                View all
                            </Link>
                        </div>
                        {recentBookings.length > 0 ? (
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={`/parent/bookings/${booking.id}`}
                                        className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{booking.student}</p>
                                                <p className="mt-1 text-sm text-slate-600">{booking.route}</p>
                                                <p className="mt-1 text-xs text-slate-500">{booking.start_date} - {booking.end_date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Route className="h-4 w-4 text-slate-400" />
                                                <StatusBadge
                                                    type="booking"
                                                    status={booking.status}
                                                    variant="light"
                                                    label={booking.status.replace(/_/g, ' ').toUpperCase()}
                                                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="mb-4 text-sm text-slate-500">No bookings yet</p>
                                <Link href="/parent/bookings/create">
                                    <GlassButton>Create your first booking</GlassButton>
                                </Link>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
