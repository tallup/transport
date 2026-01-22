import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import ChartCard from '@/Components/ChartCard';
import GlassButton from '@/Components/GlassButton';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ 
    stats, 
    recentBookings, 
    revenueTrends, 
    bookingStatusDistribution,
    upcomingEvents,
    activeRoutes,
    recentActivity
}) {
    const { auth } = usePage().props;
    
    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
    
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                            Welcome, {auth?.user?.name || 'Admin'}!
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-white/90">Here's what's happening with your transport system today.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm sm:text-base font-bold text-white">Total Students</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-200 mt-2 drop-shadow">{stats?.total_students || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Active Routes</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-green-200 mt-2 drop-shadow">{stats?.total_routes || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Total Vehicles</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-purple-200 mt-2 drop-shadow">{stats?.total_vehicles || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Active Bookings</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-yellow-200 mt-2 drop-shadow">{stats?.active_bookings || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Pending Bookings</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-orange-200 mt-2 drop-shadow">{stats?.pending_bookings || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Awaiting Approval</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-amber-200 mt-2 drop-shadow">{stats?.awaiting_approval_bookings || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M5 20h14a2 2 0 001.732-3l-7-12a2 2 0 00-3.464 0l-7 12A2 2 0 005 20z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Total Drivers</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-indigo-200 mt-2 drop-shadow">{stats?.total_drivers || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Total Parents</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-pink-200 mt-2 drop-shadow">{stats?.total_parents || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Total Revenue</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2 drop-shadow">${stats?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Revenue Trends */}
                        <ChartCard title="Revenue Trends (Last 30 Days)">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke="#ffffff" 
                                        tick={{ fill: '#ffffff' }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#ffffff" 
                                        tick={{ fill: '#ffffff' }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255,255,255,0.9)', 
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '8px',
                                            color: '#000000'
                                        }} 
                                    />
                                    <Legend 
                                        wrapperStyle={{ color: '#ffffff' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2}
                                        name="Revenue ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Booking Status Distribution */}
                        <ChartCard title="Booking Status Distribution">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={bookingStatusDistribution || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {(bookingStatusDistribution || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255,255,255,0.9)', 
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '8px',
                                            color: '#000000'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ color: '#ffffff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Quick Actions and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Quick Actions */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/admin/users/create">
                                    <GlassButton variant="primary" className="w-full">
                                        Create User
                                    </GlassButton>
                                </Link>
                                <Link href="/admin/students/create">
                                    <GlassButton variant="secondary" className="w-full">
                                        Add Student
                                    </GlassButton>
                                </Link>
                                <Link href="/admin/routes/create">
                                    <GlassButton variant="success" className="w-full">
                                        Create Route
                                    </GlassButton>
                                </Link>
                                <Link href="/admin/vehicles/create">
                                    <GlassButton variant="primary" className="w-full">
                                        Add Vehicle
                                    </GlassButton>
                                </Link>
                            </div>
                        </GlassCard>

                        {/* Upcoming Events */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
                            <div className="space-y-3">
                                {(upcomingEvents || []).length > 0 ? (
                                    upcomingEvents.slice(0, 5).map((event) => (
                                        <div key={event.id} className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-base font-bold text-white">{event.date_label}</p>
                                            <p className="text-base font-semibold text-white/90">{event.description || event.type}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white text-base font-semibold">No upcoming events</p>
                                )}
                            </div>
                        </GlassCard>

                        {/* Recent Activity */}
                        <GlassCard>
                            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {(recentActivity || []).map((activity, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                                        <p className="text-base font-bold text-white">{activity.message}</p>
                                        <p className="text-sm font-semibold text-white/80 mt-1">{activity.time}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Active Routes */}
                    <GlassCard className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Active Routes</h3>
                            <Link href="/admin/routes">
                                <GlassButton variant="primary">View All</GlassButton>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200/30">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Route</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Vehicle</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Driver</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Bookings</th>
                                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Capacity</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/5 divide-y divide-gray-200/20">
                                    {(activeRoutes || []).slice(0, 5).map((route) => (
                                        <tr key={route.id} className="hover:bg-white/10 transition">
                                            <td className="px-4 py-3 text-base font-bold text-white">{route.name}</td>
                                            <td className="px-4 py-3 text-base font-semibold text-white/90">{route.vehicle}</td>
                                            <td className="px-4 py-3 text-base font-semibold text-white/90">{route.driver}</td>
                                            <td className="px-4 py-3 text-base font-semibold text-white/90">{route.bookings_count}</td>
                                            <td className="px-4 py-3 text-base font-semibold text-white/90">{route.bookings_count}/{route.capacity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* Recent Bookings */}
                    <GlassCard>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
                            <Link href="/admin/bookings">
                                <GlassButton variant="primary">View All</GlassButton>
                            </Link>
                        </div>
                        {recentBookings && recentBookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200/30">
                                    <thead className="bg-white/10">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Student</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Route</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/5 divide-y divide-gray-200/20">
                                        {recentBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-white/10 transition">
                                                <td className="px-4 py-3 text-base font-bold text-white">
                                                    {booking.student?.name}
                                                </td>
                                                <td className="px-4 py-3 text-base font-bold text-white/90">
                                                    {booking.route?.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                                        booking.status === 'active' ? 'bg-green-500/30 text-green-100 border-green-400/50' :
                                                        booking.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                                        'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-base font-bold text-white/90">
                                                    {new Date(booking.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-white text-lg font-semibold text-center py-8">No recent bookings</p>
                        )}
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
