import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function RoutePerformance({ route, performanceMetrics, weeklyStats, monthlyStats }) {
    return (
        <DriverLayout>
            <Head title="Route Performance" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                                    Route Performance
                                </h1>
                                {route && (
                                    <p className="text-base sm:text-lg font-semibold text-white/90">
                                        Route: {route.name}
                                    </p>
                                )}
                            </div>
                            <Link href="/driver/dashboard">
                                <GlassButton variant="secondary">Back to Dashboard</GlassButton>
                            </Link>
                        </div>
                    </div>

                    {!route ? (
                        <GlassCard>
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Route Assigned</h3>
                                <p className="mt-2 text-base font-semibold text-white/90">
                                    No active route has been assigned to you yet. Please contact your administrator.
                                </p>
                            </div>
                        </GlassCard>
                    ) : (
                        <>
                            {/* Overall Performance Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">On-Time Percentage</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-teal-200 mt-2 drop-shadow">
                                                {performanceMetrics?.on_time_percentage || 0}%
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Total Trips</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-200 mt-2 drop-shadow">
                                                {performanceMetrics?.total_trips || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Active Trips</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-cyan-200 mt-2 drop-shadow">
                                                {performanceMetrics?.active_trips || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Completed Trips</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-green-200 mt-2 drop-shadow">
                                                {performanceMetrics?.completed_trips || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Total Students</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-purple-200 mt-2 drop-shadow">
                                                {performanceMetrics?.total_students || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Avg Students/Trip</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-yellow-200 mt-2 drop-shadow">
                                                {performanceMetrics?.average_students_per_trip || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Weekly and Monthly Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Weekly Stats */}
                                <GlassCard>
                                    <h3 className="text-xl font-bold text-white mb-4">This Week</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 glass-card rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-semibold text-white">Total Bookings</span>
                                                <span className="text-2xl font-bold text-teal-200">{weeklyStats?.total_bookings || 0}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 glass-card rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-semibold text-white">Active Bookings</span>
                                                <span className="text-2xl font-bold text-cyan-200">{weeklyStats?.active_bookings || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Monthly Stats */}
                                <GlassCard>
                                    <h3 className="text-xl font-bold text-white mb-4">This Month</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 glass-card rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-semibold text-white">Total Bookings</span>
                                                <span className="text-2xl font-bold text-emerald-200">{monthlyStats?.total_bookings || 0}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 glass-card rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-semibold text-white">Active Bookings</span>
                                                <span className="text-2xl font-bold text-green-200">{monthlyStats?.active_bookings || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Performance Summary */}
                            <GlassCard>
                                <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
                                <div className="space-y-4">
                                    <div className="p-4 glass-card rounded-lg">
                                        <p className="text-base font-semibold text-white/90 mb-2">
                                            Your route performance metrics provide insights into your service delivery. 
                                            Track your on-time percentage, total trips, and student capacity to maintain 
                                            excellent service quality.
                                        </p>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-white/70">On-Time Rate</p>
                                                <p className="text-lg font-bold text-teal-200 mt-1">
                                                    {performanceMetrics?.on_time_percentage || 0}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70">Service Efficiency</p>
                                                <p className="text-lg font-bold text-cyan-200 mt-1">
                                                    {performanceMetrics?.average_students_per_trip || 0} students/trip
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70">Active Service</p>
                                                <p className="text-lg font-bold text-green-200 mt-1">
                                                    {performanceMetrics?.active_trips || 0} active trips
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

