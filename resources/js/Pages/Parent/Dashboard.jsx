import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Dashboard({ 
    students, 
    bookings, 
    activeBookings, 
    upcomingPickups, 
    paymentHistory, 
    transportHistory,
    notifications 
}) {
    const { auth } = usePage().props;
    
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                            Welcome, {auth?.user?.name || 'User'}!
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-white/90">Manage your children's transportation</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm sm:text-base font-bold text-white">My Students</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-200 mt-2 drop-shadow">{students?.length || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm sm:text-base font-bold text-white">Active Bookings</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-green-200 mt-2 drop-shadow">
                                        {activeBookings?.length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Link href="/parent/students/enroll">
                            <GlassCard className="cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Add Student</h3>
                                        <p className="text-base font-semibold text-white/90">Register a new student</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>

                        <Link href="/parent/bookings/create">
                            <GlassCard className="cursor-pointer">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Book Transport</h3>
                                        <p className="text-base font-semibold text-white/90">Create a new booking</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Upcoming Pickups */}
                        <GlassCard className="lg:col-span-2">
                            <h3 className="text-xl font-bold text-white mb-4">Upcoming Pickups</h3>
                            <div className="space-y-3">
                                {(upcomingPickups || []).length > 0 ? (
                                    upcomingPickups.map((pickup, index) => (
                                        <div key={index} className="p-4 bg-white/10 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-base font-bold text-white">{pickup.date_label}</p>
                                                    <p className="text-base font-semibold text-white/90 mt-1">{pickup.student}</p>
                                                    <p className="text-sm font-semibold text-white/80 mt-1">
                                                        {pickup.route} • {pickup.pickup_point} • {pickup.pickup_time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white text-lg font-semibold text-center py-8">No upcoming pickups</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Notifications */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
                            <div className="space-y-3">
                                {(notifications || []).map((notification, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                                        <p className="text-base font-bold text-white">{notification.message}</p>
                                        <p className="text-sm font-semibold text-white/80 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                                {(!notifications || notifications.length === 0) && (
                                    <p className="text-white text-base font-semibold text-center py-4">No notifications</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Payment History and Transport History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment History */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Payment History</h3>
                            <div className="space-y-3">
                                {(paymentHistory || []).map((payment, index) => (
                                    <div key={index} className="p-4 bg-white/10 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-base font-bold text-white">${payment.amount.toFixed(2)}</p>
                                                <p className="text-base font-semibold text-white/90 mt-1">{payment.description}</p>
                                                <p className="text-sm font-semibold text-white/80 mt-1">{payment.date}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                                payment.status === 'paid' ? 'bg-green-500/30 text-green-100 border-green-400/50' : 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!paymentHistory || paymentHistory.length === 0) && (
                                    <p className="text-white text-lg font-semibold text-center py-8">No payment history</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Transport History */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Transport History</h3>
                            <div className="space-y-3">
                                {(transportHistory || []).map((booking) => (
                                    <div key={booking.id} className="p-4 bg-white/10 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-base font-bold text-white">{booking.student}</p>
                                                <p className="text-base font-semibold text-white/90 mt-1">{booking.route}</p>
                                                <p className="text-sm font-semibold text-white/80 mt-1">
                                                    {booking.start_date} - {booking.end_date}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                                booking.status === 'active' ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                                                booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                                'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!transportHistory || transportHistory.length === 0) && (
                                    <p className="text-white text-lg font-semibold text-center py-8">No transport history</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
