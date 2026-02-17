import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';

export default function Dashboard({
    students,
    bookings,
    activeBookings,
    activeBookingsCount,
    upcomingPickups,
    paymentHistory,
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

    const firstName = auth?.user?.name?.split(' ')[0] || 'User';

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-b from-black/30 via-transparent to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                    {/* Hero / Welcome */}
                    <header className="mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-yellow-400/90 uppercase tracking-wider mb-1">
                                    Dashboard
                                </p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                    Hi, {firstName}
                                </h1>
                                <p className="mt-2 text-base text-white/70 font-medium">
                                    {formattedDate}
                                </p>
                            </div>
                            <Link
                                href="/parent/bookings/create"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-brand-primary bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                New Booking
                            </Link>
                        </div>
                    </header>

                    {/* Stats - Modern cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                        <Link
                            href="/parent/students"
                            className="group relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Students</p>
                                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                                        {students?.length ?? 0}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white/50">Registered</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors">
                                    <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/parent/bookings"
                            className="group relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Bookings</p>
                                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                                        {activeBookingsCount ?? activeBookings?.length ?? 0}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white/50">Active</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-white/5 backdrop-blur-sm p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Pickups</p>
                                    <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                                        {upcomingPickups?.length ?? 0}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white/50">Next 14 days</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Two columns: Pickups + Notifications */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
                        {/* Upcoming Pickups - 2/3 */}
                        <GlassCard className="lg:col-span-2 rounded-2xl border-2 border-yellow-400/40 overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <h2 className="text-xl font-bold text-white">Upcoming Pickups</h2>
                                    <div className="flex items-center gap-3">
                                        {totalUpcomingPickups > pickupsPerPage && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setPickupsPage((p) => Math.max(1, p - 1))}
                                                    disabled={pickupsPage <= 1}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-yellow-400/60 bg-yellow-400/10 text-white hover:bg-yellow-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    Prev
                                                </button>
                                                <span className="text-sm font-semibold text-white/70 px-2">
                                                    {pickupsPage}/{totalPickupsPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setPickupsPage((p) => Math.min(totalPickupsPages, p + 1))}
                                                    disabled={pickupsPage >= totalPickupsPages}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-yellow-400/60 bg-yellow-400/10 text-white hover:bg-yellow-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                        <Link
                                            href="/parent/bookings"
                                            className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition"
                                        >
                                            View all →
                                        </Link>
                                    </div>
                                </div>

                                {upcomingPickups?.length > 0 ? (
                                    <ul className="space-y-4">
                                        {pagedUpcomingPickups.map((pickup, i) => (
                                            <li key={`${pickup.date}-${pickup.student}-${i}`}>
                                                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-yellow-400/20 hover:border-yellow-400/40 hover:bg-white/10 transition-all">
                                                    <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="font-bold text-white">{pickup.student}</span>
                                                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-yellow-400/20 text-yellow-200 border border-yellow-400/40">
                                                                {pickup.date_label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-white/80 font-medium">{pickup.route}</p>
                                                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/60">
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                </svg>
                                                                {pickup.pickup_point}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {pickup.pickup_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-14 rounded-2xl bg-white/5 border border-dashed border-yellow-400/30">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-white font-semibold mb-1">No upcoming pickups</p>
                                        <p className="text-sm text-white/50">Your next pickup will show here</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Notifications - 1/3 */}
                        <GlassCard className="rounded-2xl border-2 border-yellow-400/40 overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                                    {((notificationsUnreadCount ?? 0) > 0 || (notifications?.length > 0)) && (
                                        <span className="flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-yellow-400/30 text-brand-primary text-xs font-bold border border-yellow-400/50">
                                            {notificationsUnreadCount > 0 ? notificationsUnreadCount : notifications.length}
                                        </span>
                                    )}
                                </div>

                                {notifications?.length > 0 ? (
                                    <ul className="space-y-3">
                                        {notifications.map((n, idx) => (
                                            <li
                                                key={n.id ?? idx}
                                                className={`rounded-xl border p-4 transition-all ${
                                                    n.type === 'success'
                                                        ? 'bg-emerald-500/10 border-emerald-400/30'
                                                        : n.type === 'error'
                                                        ? 'bg-red-500/10 border-red-400/30'
                                                        : 'bg-sky-500/10 border-sky-400/30'
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            n.type === 'success'
                                                                ? 'bg-emerald-500/20'
                                                                : n.type === 'error'
                                                                ? 'bg-red-500/20'
                                                                : 'bg-sky-500/20'
                                                        }`}
                                                    >
                                                        {n.type === 'success' ? (
                                                            <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : n.type === 'error' ? (
                                                            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white leading-snug">{n.message}</p>
                                                        <p className="mt-1 text-xs font-medium text-white/50">{n.time}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-10 rounded-2xl bg-white/5 border border-dashed border-yellow-400/30">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-white/50">No notifications</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </section>

                    {/* Recent Bookings */}
                    <GlassCard className="rounded-2xl border-2 border-yellow-400/40 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
                                <Link
                                    href="/parent/bookings"
                                    className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition"
                                >
                                    View all →
                                </Link>
                            </div>

                            {recentBookings.length > 0 ? (
                                <ul className="space-y-3">
                                    {recentBookings.map((booking) => (
                                        <li key={booking.id}>
                                            <Link
                                                href={`/parent/bookings/${booking.id}`}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-yellow-400/20 hover:border-yellow-400/50 hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-bold text-white group-hover:text-yellow-200 transition">{booking.student}</span>
                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                                                                booking.status === 'active'
                                                                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                                                                    : booking.status === 'pending' || booking.status === 'awaiting_approval'
                                                                    ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40'
                                                                    : booking.status === 'cancelled'
                                                                    ? 'bg-red-500/20 text-red-200 border-red-400/40'
                                                                    : 'bg-white/10 text-white/80 border-white/20'
                                                            }`}
                                                        >
                                                            {booking.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-white/70 font-medium">{booking.route}</p>
                                                    <p className="text-xs text-white/50 mt-0.5">
                                                        {booking.start_date} — {booking.end_date}
                                                    </p>
                                                </div>
                                                <svg
                                                    className="w-5 h-5 text-white/40 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-14 rounded-2xl bg-white/5 border border-dashed border-yellow-400/30">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-white font-semibold mb-2">No bookings yet</p>
                                    <Link
                                        href="/parent/bookings/create"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-brand-primary bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all"
                                    >
                                        Create your first booking
                                    </Link>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
