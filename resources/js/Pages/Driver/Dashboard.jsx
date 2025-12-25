import { Head, Link, usePage } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import Timeline from '@/Components/Timeline';
import GlassButton from '@/Components/GlassButton';

export default function Dashboard({ route, stats, todaySchedule, nextPickupPoints, performanceMetrics }) {
    const { auth } = usePage().props;
    
    return (
        <DriverLayout>
            <Head title="Driver Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome, {auth?.user?.name || 'Driver'}!
                        </h1>
                        <p className="text-gray-700">Your route information and today's schedule</p>
                    </div>

                    {!route ? (
                        <GlassCard>
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">No Route Assigned</h3>
                                <p className="mt-2 text-gray-600">
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
                                            <p className="text-sm font-medium text-gray-600">Route Name</p>
                                            <p className="text-2xl font-bold text-blue-900 mt-2">{stats.route_name}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Vehicle</p>
                                            <p className="text-lg font-semibold text-green-900 mt-2">{stats.vehicle}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                                            <p className="text-3xl font-bold text-purple-900 mt-2">{stats.total_students}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                                            <p className="text-3xl font-bold text-orange-900 mt-2">{stats.today_bookings}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Today's Schedule Timeline */}
                            <GlassCard className="mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
                                    <Link href="/driver/roster">
                                        <GlassButton variant="primary">View Full Roster</GlassButton>
                                    </Link>
                                </div>
                                {todaySchedule && todaySchedule.length > 0 ? (
                                    <Timeline items={todaySchedule} />
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No schedule for today</p>
                                )}
                            </GlassCard>

                            {/* Next Pickup Points and Performance */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Next Pickup Points */}
                                <GlassCard>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Pickup Points</h3>
                                    <div className="space-y-4">
                                        {(nextPickupPoints || []).map((point, index) => (
                                            <div key={point.id} className="p-4 bg-white/10 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{point.name}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                                                        <div className="flex gap-4 mt-2">
                                                            <span className="text-xs text-gray-500">
                                                                Pickup: {point.pickup_time}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Dropoff: {point.dropoff_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                        #{point.sequence_order}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!nextPickupPoints || nextPickupPoints.length === 0) && (
                                            <p className="text-gray-500 text-center py-4">No pickup points available</p>
                                        )}
                                    </div>
                                </GlassCard>

                                {/* Performance Metrics */}
                                <GlassCard>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Performance</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/10 rounded-lg">
                                            <p className="text-sm text-gray-600">On-Time Percentage</p>
                                            <p className="text-3xl font-bold text-green-600 mt-2">
                                                {performanceMetrics?.on_time_percentage || 0}%
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/10 rounded-lg">
                                            <p className="text-sm text-gray-600">Total Trips</p>
                                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                                {performanceMetrics?.total_trips || 0}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/10 rounded-lg">
                                            <p className="text-sm text-gray-600">Average Students per Trip</p>
                                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                                {performanceMetrics?.average_students_per_trip || 0}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Route Information */}
                            <GlassCard>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Route Name</p>
                                        <p className="text-lg font-medium text-gray-900 mt-1">{route.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pickup Points</p>
                                        <p className="text-lg font-medium text-gray-900 mt-1">{stats.pickup_points}</p>
                                    </div>
                                    {route.vehicle && (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-600">Vehicle</p>
                                                <p className="text-lg font-medium text-gray-900 mt-1">
                                                    {route.vehicle.make} {route.vehicle.model}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">License Plate</p>
                                                <p className="text-lg font-medium text-gray-900 mt-1">
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
