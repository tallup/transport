import { Head, Link, usePage } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import Timeline from '@/Components/Timeline';
import GlassButton from '@/Components/GlassButton';

export default function Dashboard({ route, stats, todaySchedule, nextPickupPoints, performanceMetrics, studentsList }) {
    const { auth } = usePage().props;
    
    return (
        <DriverLayout>
            <Head title="Driver Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                            Welcome, {auth?.user?.name || 'Driver'}!
                        </h1>
                        <p className="text-base sm:text-lg font-semibold text-white/90">Your route information and today's schedule</p>
                    </div>

                    {!route ? (
                        <GlassCard>
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Route Assigned</h3>
                                <p className="mt-2 text-base font-semibold text-white/90">
                                    No route has been assigned to you yet. Please contact your administrator.
                                </p>
                            </div>
                        </GlassCard>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Route Name</p>
                                            <p className="text-2xl sm:text-3xl font-extrabold text-teal-200 mt-2 drop-shadow">{stats.route_name}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Vehicle</p>
                                            <p className="text-xl font-bold text-green-200 mt-2">{stats.vehicle}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Total Students</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-200 mt-2 drop-shadow">{stats.total_students}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Today's Bookings</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-cyan-200 mt-2 drop-shadow">{stats.today_bookings}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Today's Schedule Timeline */}
                            <GlassCard className="mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Today's Schedule</h3>
                                    <Link href="/driver/roster">
                                        <GlassButton variant="primary">View Full Roster</GlassButton>
                                    </Link>
                                </div>
                                {todaySchedule && todaySchedule.length > 0 ? (
                                    <Timeline items={todaySchedule} />
                                ) : (
                                    <p className="text-white text-lg font-semibold text-center py-8">No schedule for today</p>
                                )}
                            </GlassCard>

                            {/* Students List and Performance */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Students List with Pickup Points */}
                                <GlassCard>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-white">Students & Pickup Schedule</h3>
                                        <Link href="/driver/students-schedule">
                                            <GlassButton variant="primary" className="text-sm py-2 px-3">
                                                View Full Details
                                            </GlassButton>
                                        </Link>
                                    </div>
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {(studentsList || []).length > 0 ? (
                                            studentsList.map((student, index) => (
                                                <div key={`${student.id}-${student.booking_id}`} className="p-4 glass-card rounded-lg border border-white/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <p className="text-base font-bold text-white">{student.name}</p>
                                                            <p className="text-sm font-semibold text-white/90 mt-1">{student.pickup_point_name}</p>
                                                            {student.pickup_point_address && (
                                                                <p className="text-xs font-medium text-white/70 mt-1">{student.pickup_point_address}</p>
                                                            )}
                                                        </div>
                                                        <span className="px-2 py-1 bg-blue-500/30 text-blue-100 border border-blue-400/50 text-xs font-semibold rounded-full whitespace-nowrap ml-2">
                                                            #{student.sequence_order}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-bold text-green-300">
                                                            Pickup: {student.pickup_time}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-white text-base font-semibold text-center py-4">No students assigned</p>
                                        )}
                                    </div>
                                </GlassCard>

                                {/* Performance Metrics */}
                                <GlassCard>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-white">Route Performance</h3>
                                        <Link href="/driver/route-performance">
                                            <GlassButton variant="primary" className="text-sm py-2 px-3">
                                                View Full Details
                                            </GlassButton>
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                                            <p className="text-base font-bold text-white">On-Time Percentage</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-teal-200 mt-2 drop-shadow">
                                                {performanceMetrics?.on_time_percentage || 0}%
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                                            <p className="text-base font-bold text-white">Total Trips</p>
                                            <p className="text-4xl font-extrabold text-emerald-200 mt-2 drop-shadow">
                                                {performanceMetrics?.total_trips || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                                            <p className="text-base font-bold text-white">Average Students per Trip</p>
                                            <p className="text-4xl font-extrabold text-cyan-200 mt-2 drop-shadow">
                                                {performanceMetrics?.average_students_per_trip || 0}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Route Information */}
                            <GlassCard>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Route Information</h3>
                                    <Link href="/driver/route-information">
                                        <GlassButton variant="primary" className="text-sm py-2 px-3">
                                            View Full Details
                                        </GlassButton>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-base font-bold text-white">Route Name</p>
                                        <p className="text-lg font-bold text-white/90 mt-1">{route.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white">Pickup Points</p>
                                        <p className="text-lg font-bold text-white/90 mt-1">{stats.pickup_points}</p>
                                    </div>
                                    {route.vehicle && (
                                        <>
                                            <div>
                                                <p className="text-base font-bold text-white">Vehicle</p>
                                                <p className="text-lg font-bold text-white/90 mt-1">
                                                    {route.vehicle.make} {route.vehicle.model}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-white">License Plate</p>
                                                <p className="text-lg font-bold text-white/90 mt-1">
                                                    {route.vehicle.license_plate}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </GlassCard>
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}
