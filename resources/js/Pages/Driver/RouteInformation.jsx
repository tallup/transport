import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function RouteInformation({ route, pickupPoints, activeBookingsCount }) {
    return (
        <DriverLayout>
            <Head title="Route Information" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                                    Route Information
                                </h1>
                                {route && (
                                    <p className="text-base sm:text-lg font-semibold text-white/90">
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
                                            <p className="text-base font-bold text-white">Service Type</p>
                                            <p className="text-xl font-bold text-emerald-200 mt-2 capitalize">
                                                {route.service_type || 'Standard'}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                            {/* Pickup Points */}
                            <GlassCard>
                                <h3 className="text-2xl font-bold text-white mb-6">Pickup Points ({pickupPoints?.length || 0})</h3>
                                
                                {pickupPoints && pickupPoints.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/20">
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Sequence</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Point Name</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Address</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Time</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Dropoff Time</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Coordinates</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {pickupPoints.map((point) => (
                                                    <tr key={point.id} className="hover:bg-white/5 transition">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 bg-blue-500/30 text-blue-100 border border-blue-400/50 text-sm font-bold rounded-full">
                                                                #{point.sequence_order}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-base font-bold text-white">{point.name}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-semibold text-white/90">{point.address || 'N/A'}</p>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-sm font-bold text-green-300">{point.pickup_time}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className="text-sm font-semibold text-white/90">{point.dropoff_time || 'N/A'}</span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {point.latitude && point.longitude ? (
                                                                <p className="text-xs font-medium text-white/70">
                                                                    {point.latitude}, {point.longitude}
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs font-medium text-white/50">N/A</p>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="mt-4 text-lg font-semibold text-white">No pickup points assigned</p>
                                        <p className="mt-2 text-base font-medium text-white/70">This route has no pickup points configured.</p>
                                    </div>
                                )}
                            </GlassCard>
                        </>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-8">
                                <p className="text-lg font-semibold text-white">Please select a route to view information</p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

