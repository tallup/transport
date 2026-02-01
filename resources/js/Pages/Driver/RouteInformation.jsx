import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function RouteInformation({ route, pickupPoints, activeBookingsCount, bookings }) {
    return (
        <DriverLayout>
            <Head title="Route Information" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                    Route Information
                                </h1>
                                {route && (
                                    <p className="text-base sm:text-lg font-semibold text-brand-primary/70">
                                        Complete details about your assigned route
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
                            {/* Route Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Route Name</p>
                                            <p className="text-xl font-bold text-teal-200 mt-2">{route.name}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Service Type</p>
                                            <p className="text-xl font-bold text-emerald-200 mt-2 capitalize">
                                                {route.service_type || 'Standard'}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Route Capacity</p>
                                            <p className="text-xl font-bold text-cyan-200 mt-2">{route.capacity || 'N/A'}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Active Bookings</p>
                                            <p className="text-xl font-bold text-green-200 mt-2">{activeBookingsCount || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Vehicle Information */}
                            {route.vehicle && (
                                <GlassCard className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">Vehicle Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Make & Model</p>
                                                <p className="text-lg font-bold text-white">
                                                    {route.vehicle.make} {route.vehicle.model}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Year</p>
                                                <p className="text-lg font-bold text-white">{route.vehicle.year || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">License Plate</p>
                                                <p className="text-lg font-bold text-white">{route.vehicle.license_plate}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Registration Number</p>
                                                <p className="text-lg font-bold text-white">
                                                    {route.vehicle.registration_number || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Vehicle Capacity</p>
                                                <p className="text-lg font-bold text-white">{route.vehicle.capacity || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Vehicle Type</p>
                                                <p className="text-lg font-bold text-white capitalize">
                                                    {route.vehicle.type || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/70 mb-1">Status</p>
                                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                                    route.vehicle.status === 'active' 
                                                        ? 'bg-green-500/30 text-green-100 border border-green-400/50' 
                                                        : 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                                                }`}>
                                                    {route.vehicle.status || 'N/A'}
                                                </span>
                                            </div>
                                    </div>
                                </GlassCard>
                            )}

                            {/* Driver Information */}
                            {route.driver && (
                                <GlassCard className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-6">Driver Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-semibold text-white/70 mb-1">Driver Name</p>
                                            <p className="text-lg font-bold text-white">{route.driver.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white/70 mb-1">Email</p>
                                            <p className="text-lg font-bold text-white">{route.driver.email}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            {/* Bookings */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-extrabold text-brand-primary mb-6">Bookings ({bookings?.length || 0})</h3>
                                
                                {bookings && bookings.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {bookings.map((booking) => (
                                            <GlassCard key={booking.id} className="p-6 hover:scale-[1.02] transition-all">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-extrabold text-white truncate">{booking.student?.name || 'N/A'}</h3>
                                                            {booking.student?.grade && (
                                                                <p className="text-sm text-white/70 font-medium">Grade {booking.student.grade}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                        booking.status === 'active' 
                                                            ? 'bg-green-500/30 text-brand-primary border border-green-400/50' 
                                                            : booking.status === 'pending'
                                                            ? 'bg-yellow-500/30 text-brand-primary border border-yellow-400/50'
                                                            : 'bg-gray-500/30 text-brand-primary border border-gray-400/50'
                                                    }`}>
                                                        {booking.status?.toUpperCase() || 'N/A'}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div className="space-y-3 mb-4">
                                                    {booking.student?.school && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                            <p className="text-sm text-white/90 font-medium truncate">{booking.student.school}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-2">
                                                        <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <div className="flex-1 min-w-0">
                                                            {booking.pickup_point ? (
                                                                <>
                                                                    <p className="text-sm text-white/90 font-medium truncate">{booking.pickup_point.name}</p>
                                                                    {booking.pickup_point.address && (
                                                                        <p className="text-xs text-white/70 font-medium truncate mt-1">{booking.pickup_point.address}</p>
                                                                    )}
                                                                    {booking.pickup_point.pickup_time && (
                                                                        <p className="text-xs font-bold text-green-300 mt-1">
                                                                            Time: {booking.pickup_point.pickup_time}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            ) : booking.pickup_address ? (
                                                                <>
                                                                    <p className="text-sm text-white/90 font-medium truncate">Custom Address</p>
                                                                    <p className="text-xs text-white/70 font-medium truncate mt-1">{booking.pickup_address}</p>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-white/50 font-medium">N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-brand-primary border border-blue-400/50 capitalize">
                                                                {booking.plan_type === 'academic_term' ? 'Academic Term' : booking.plan_type?.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-500/30 text-brand-primary border border-purple-400/50 capitalize">
                                                                {booking.trip_type === 'one_way' ? 'One Way' : 'Two Way'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-sm text-white/90 font-medium">
                                                            {booking.start_date_formatted} - {booking.end_date_formatted}
                                                        </p>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                ) : (
                                    <GlassCard className="p-12">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-brand-primary text-lg font-bold mb-2">No bookings found</p>
                                            <p className="text-white/70 text-sm">This route has no active or pending bookings.</p>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>

                            {/* Pickup Points */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-extrabold text-brand-primary mb-6">Pickup Points ({pickupPoints?.length || 0})</h3>
                                
                                {pickupPoints && pickupPoints.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {pickupPoints.map((point) => (
                                            <GlassCard key={point.id} className="p-6 hover:scale-[1.02] transition-all">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-extrabold text-white truncate">{point.name}</h3>
                                                            <p className="text-sm text-white/70 font-medium truncate">Sequence #{point.sequence_order}</p>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-500/30 text-brand-primary border border-blue-400/50 text-xs font-bold rounded-lg">
                                                        #{point.sequence_order}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div className="space-y-3 mb-4">
                                                    {point.address && (
                                                        <div className="flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <p className="text-sm text-white/90 font-medium line-clamp-2">{point.address}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                                        {point.pickup_time && (
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-white/70 font-medium">Pickup</p>
                                                                    <p className="text-sm font-bold text-green-300">{point.pickup_time}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {point.dropoff_time && (
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-white/70 font-medium">Dropoff</p>
                                                                    <p className="text-sm font-bold text-white/90">{point.dropoff_time}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(point.latitude || point.longitude) && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                            </svg>
                                                            <p className="text-xs text-white/70 font-medium">
                                                                {point.latitude && point.longitude ? `${point.latitude}, ${point.longitude}` : 'N/A'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                ) : (
                                    <GlassCard className="p-12">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-brand-primary text-lg font-bold">No pickup points</p>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

