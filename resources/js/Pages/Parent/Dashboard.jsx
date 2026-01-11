import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Dashboard({ 
    students, 
    bookings, 
    activeBookings, 
    activeBookingsCount,
    upcomingPickups, 
    paymentHistory, 
    transportHistory,
    notifications 
}) {
    const { auth } = usePage().props;
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const pendingBookings = activeBookings?.filter(b => b.status === 'pending') || [];
    const activeBookingsList = activeBookings?.filter(b => b.status === 'active') || [];
    const recentBookings = transportHistory?.slice(0, 5) || [];
    
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section with Date */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                                    Welcome back, {auth?.user?.name?.split(' ')[0] || 'User'}!
                                </h1>
                                <p className="text-lg font-semibold text-white/80">{formattedDate}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex gap-3">
                                <Link
                                    href="/parent/bookings/create"
                                    className="glass-button px-6 py-3 rounded-lg font-bold text-base hover:scale-105 transition-transform"
                                >
                                    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Booking
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Enhanced */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Students Card */}
                        <Link href="/parent/students">
                            <GlassCard className="cursor-pointer hover:bg-white/10 transition-all hover:scale-105 duration-200 border-2 border-transparent hover:border-blue-400/50">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                                            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-200/80 bg-blue-500/20 px-2 py-1 rounded-full">
                                            Total
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-extrabold text-white">{students?.length || 0}</p>
                                            <p className="text-sm font-semibold text-white/70 mt-1">Registered Students</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>

                        {/* Active Bookings Card */}
                        <Link href="/parent/bookings">
                            <GlassCard className="cursor-pointer hover:bg-white/10 transition-all hover:scale-105 duration-200 border-2 border-transparent hover:border-green-400/50">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-green-400/30">
                                            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold text-green-200/80 bg-green-500/20 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-extrabold text-white">{activeBookingsCount ?? activeBookings?.length ?? 0}</p>
                                            <p className="text-sm font-semibold text-white/70 mt-1">Active Bookings</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>

                        {/* Upcoming Pickups Card */}
                        <GlassCard className="border-2 border-transparent hover:border-cyan-400/50 transition-all">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                                        <svg className="w-6 h-6 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-cyan-200/80 bg-cyan-500/20 px-2 py-1 rounded-full">
                                        Next 14 Days
                                    </span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-extrabold text-white">{upcomingPickups?.length || 0}</p>
                                        <p className="text-sm font-semibold text-white/70 mt-1">Upcoming Pickups</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Quick Actions - Redesigned */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href="/parent/students/enroll">
                            <GlassCard className="cursor-pointer hover:bg-white/10 transition-all hover:scale-105 duration-200 group">
                                <div className="p-6 flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform border border-blue-400/30">
                                        <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1">Add Student</h3>
                                        <p className="text-sm font-semibold text-white/70">Register a new student</p>
                                    </div>
                                    <svg className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </GlassCard>
                        </Link>

                        <Link href="/parent/bookings">
                            <GlassCard className="cursor-pointer hover:bg-white/10 transition-all hover:scale-105 duration-200 group">
                                <div className="p-6 flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform border border-green-400/30">
                                        <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1">My Bookings</h3>
                                        <p className="text-sm font-semibold text-white/70">View all bookings</p>
                                    </div>
                                    <svg className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </GlassCard>
                        </Link>

                        <Link href="/parent/students">
                            <GlassCard className="cursor-pointer hover:bg-white/10 transition-all hover:scale-105 duration-200 group">
                                <div className="p-6 flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform border border-purple-400/30">
                                        <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1">My Students</h3>
                                        <p className="text-sm font-semibold text-white/70">Manage students</p>
                                    </div>
                                    <svg className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </GlassCard>
                        </Link>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Upcoming Pickups - Enhanced */}
                        <GlassCard className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Upcoming Pickups</h3>
                                <Link 
                                    href="/parent/bookings"
                                    className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {(upcomingPickups && upcomingPickups.length > 0) ? (
                                    upcomingPickups.slice(0, 5).map((pickup, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/15">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                                                        <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <p className="text-lg font-bold text-white">{pickup.student}</p>
                                                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-200 text-xs font-semibold rounded-full border border-blue-400/30">
                                                                {pickup.date_label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-white/80 mb-1">{pickup.route}</p>
                                                        <div className="flex items-center gap-4 text-xs font-medium text-white/60">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {pickup.pickup_point}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {pickup.pickup_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-16 w-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-white text-lg font-semibold mb-2">No upcoming pickups</p>
                                        <p className="text-white/60 text-sm">Your next pickup will appear here</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Notifications - Enhanced */}
                        <GlassCard>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Notifications</h3>
                                {(notifications && notifications.length > 0) && (
                                    <span className="px-2 py-1 bg-blue-500/30 text-blue-200 text-xs font-bold rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {(notifications && notifications.length > 0) ? (
                                    notifications.map((notification, index) => (
                                        <div 
                                            key={index} 
                                            className={`p-4 rounded-xl border ${
                                                notification.type === 'success' ? 'bg-green-500/10 border-green-400/30' :
                                                notification.type === 'error' ? 'bg-red-500/10 border-red-400/30' :
                                                'bg-blue-500/10 border-blue-400/30'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    notification.type === 'success' ? 'bg-green-500/20' :
                                                    notification.type === 'error' ? 'bg-red-500/20' :
                                                    'bg-blue-500/20'
                                                }`}>
                                                    {notification.type === 'success' ? (
                                                        <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : notification.type === 'error' ? (
                                                        <svg className="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white mb-1">{notification.message}</p>
                                                    <p className="text-xs font-medium text-white/60">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-white/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <p className="text-white/60 text-sm">No notifications</p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Recent Bookings */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Recent Bookings</h3>
                            <Link 
                                href="/parent/bookings"
                                className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition"
                            >
                                View All →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="space-y-3">
                                {recentBookings.length > 0 ? (
                                    recentBookings.map((booking) => (
                                        <Link
                                            key={booking.id}
                                            href={`/parent/bookings/${booking.id}`}
                                            className="block p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/15 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-base font-bold text-white group-hover:text-blue-200 transition">
                                                                {booking.student}
                                                            </p>
                                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                                                                booking.status === 'active' ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                                                                booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                                                booking.status === 'cancelled' ? 'bg-red-500/30 text-red-100 border-red-400/50' :
                                                                'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                                            }`}>
                                                                {booking.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-white/80 mb-1">{booking.route}</p>
                                                        <p className="text-xs font-medium text-white/60">
                                                            {booking.start_date} - {booking.end_date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-16 w-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p className="text-white text-lg font-semibold mb-2">No bookings yet</p>
                                        <Link
                                            href="/parent/bookings/create"
                                            className="glass-button px-4 py-2 rounded-lg inline-block text-sm"
                                        >
                                            Create Your First Booking
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
