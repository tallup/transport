import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    TruckIcon, 
    UserIcon, 
    MapPinIcon, 
    AcademicCapIcon,
    ClockIcon,
    CheckCircleIcon,
    UsersIcon,
    CalendarIcon,
    ChartBarIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Show({ route, activeBookings, upcomingBookings, recentExpired, statistics }) {
    const formatTime = (time) => {
        if (!time) return '-';
        try {
            const date = new Date(`2000-01-01 ${time}`);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } catch {
            return time;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <AdminLayout>
            <Head title={`Route: ${route.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/routes"
                                className="glass-button text-white p-2 rounded-lg transition hover:bg-white/20"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                                    {route.name}
                                </h1>
                                <p className="text-gray-300 text-sm mt-1">
                                    Complete route information and statistics
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/routes/${route.id}/edit`}
                                className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                            >
                                Edit Route
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Active Students</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {statistics.total_bookings}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        of {route.capacity} capacity
                                    </p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-blue-400" />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Capacity</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {statistics.capacity_utilization}%
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {statistics.available_seats} seats available
                                    </p>
                                </div>
                                <ChartBarIcon className={`h-12 w-12 ${
                                    statistics.capacity_utilization >= 90 ? 'text-red-400' :
                                    statistics.capacity_utilization >= 70 ? 'text-yellow-400' :
                                    'text-green-400'
                                }`} />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Completions (30d)</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {statistics.total_completions}
                                    </p>
                                    {statistics.avg_completion_time_minutes && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Avg {statistics.avg_completion_time_minutes} mins
                                        </p>
                                    )}
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-green-400" />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm">Upcoming</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {statistics.upcoming_bookings_count}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Starting soon
                                    </p>
                                </div>
                                <CalendarIcon className="h-12 w-12 text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Route Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Basic Info Card */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <MapPinIcon className="h-6 w-6" />
                                    Route Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Route Name</p>
                                        <p className="text-white font-semibold">{route.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Service Type</p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                                            route.service_type === 'am' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                            route.service_type === 'pm' ? 'bg-blue-500/30 text-blue-100 border-blue-400/50' :
                                            'bg-green-500/30 text-green-100 border-green-400/50'
                                        }`}>
                                            {route.service_type === 'am' ? 'AM Only' :
                                             route.service_type === 'pm' ? 'PM Only' : 'Both'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                                            route.active 
                                                ? 'bg-green-500/30 text-green-100 border-green-400/50'
                                                : 'bg-red-500/30 text-red-100 border-red-400/50'
                                        }`}>
                                            {route.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {route.pickup_time && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Pickup Time</p>
                                            <p className="text-white font-semibold flex items-center gap-2">
                                                <ClockIcon className="h-4 w-4" />
                                                {formatTime(route.pickup_time)}
                                            </p>
                                        </div>
                                    )}
                                    {route.dropoff_time && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Dropoff Time</p>
                                            <p className="text-white font-semibold flex items-center gap-2">
                                                <ClockIcon className="h-4 w-4" />
                                                {formatTime(route.dropoff_time)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Driver Card */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <UserIcon className="h-6 w-6" />
                                    Driver
                                </h3>
                                {route.driver ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-400 text-sm">Name</p>
                                            <p className="text-white font-semibold">{route.driver.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Email</p>
                                            <p className="text-white">{route.driver.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No driver assigned</p>
                                )}
                            </div>

                            {/* Vehicle Card */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <TruckIcon className="h-6 w-6" />
                                    Vehicle
                                </h3>
                                {route.vehicle ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-400 text-sm">License Plate</p>
                                            <p className="text-white font-semibold">{route.vehicle.license_plate}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Type</p>
                                            <p className="text-white">{route.vehicle.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Capacity</p>
                                            <p className="text-white font-semibold">{route.vehicle.capacity} passengers</p>
                                        </div>
                                        {route.vehicle.status && (
                                            <div>
                                                <p className="text-gray-400 text-sm">Status</p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    route.vehicle.status === 'active' 
                                                        ? 'bg-green-500/30 text-green-100'
                                                        : 'bg-gray-500/30 text-gray-100'
                                                }`}>
                                                    {route.vehicle.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No vehicle assigned</p>
                                )}
                            </div>

                            {/* Schools Card */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <AcademicCapIcon className="h-6 w-6" />
                                    Schools Served
                                </h3>
                                {route.schools && route.schools.length > 0 ? (
                                    <div className="space-y-2">
                                        {route.schools.map((school) => (
                                            <div key={school.id} className="bg-white/10 rounded-lg p-3">
                                                <p className="text-white font-semibold">{school.name}</p>
                                                {school.address && (
                                                    <p className="text-gray-400 text-sm mt-1">{school.address}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No schools assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Pickup Points & Bookings */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Pickup Points */}
                            {route.pickup_points && route.pickup_points.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <MapPinIcon className="h-6 w-6" />
                                        Pickup Points ({route.pickup_points.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {route.pickup_points.map((point, index) => (
                                            <div key={point.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center border border-blue-400/50">
                                                        <span className="text-white font-bold text-sm">{point.sequence_order || index + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-semibold">{point.name}</p>
                                                        {point.address && (
                                                            <p className="text-gray-400 text-sm mt-1">{point.address}</p>
                                                        )}
                                                        <div className="flex gap-4 mt-2 text-sm">
                                                            {point.pickup_time && (
                                                                <span className="text-gray-300">
                                                                    🚌 {formatTime(point.pickup_time)}
                                                                </span>
                                                            )}
                                                            {point.dropoff_time && (
                                                                <span className="text-gray-300">
                                                                    🏠 {formatTime(point.dropoff_time)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Bookings */}
                            <div className="glass-card p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <UsersIcon className="h-6 w-6" />
                                    Active Students ({activeBookings.length})
                                </h3>
                                {activeBookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200/30">
                                            <thead className="bg-white/10">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Student</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Parent</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Point</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Plan</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Status</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">End Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white/5 divide-y divide-gray-200/20">
                                                {activeBookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-white/10 transition">
                                                        <td className="px-4 py-3 text-white font-semibold">
                                                            {booking.student.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                                            {booking.student.parent?.name || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                                            {booking.pickup_point?.name || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                                            {booking.plan_type.replace('_', ' ')}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                booking.status === 'active' 
                                                                    ? 'bg-green-500/30 text-green-100'
                                                                    : 'bg-yellow-500/30 text-yellow-100'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                                            {formatDate(booking.end_date)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No active bookings</p>
                                )}
                            </div>

                            {/* Upcoming Bookings */}
                            {upcomingBookings.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <CalendarIcon className="h-6 w-6" />
                                        Upcoming Students ({upcomingBookings.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {upcomingBookings.map((booking) => (
                                            <div key={booking.id} className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-semibold">{booking.student.name}</p>
                                                        <p className="text-gray-400 text-sm">
                                                            Starts: {formatDate(booking.start_date)}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-100">
                                                        Pending
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Completions */}
                            {route.completions && route.completions.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <CheckCircleIcon className="h-6 w-6" />
                                        Recent Completions
                                    </h3>
                                    <div className="space-y-2">
                                        {route.completions.slice(0, 5).map((completion) => (
                                            <div key={completion.id} className="bg-white/10 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-semibold">
                                                            {formatDate(completion.completion_date)}
                                                        </p>
                                                        {completion.driver && (
                                                            <p className="text-gray-400 text-sm">
                                                                By: {completion.driver.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                                </div>
                                                {completion.notes && (
                                                    <p className="text-gray-300 text-sm mt-2">{completion.notes}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recently Expired */}
                            {recentExpired.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        Recently Expired ({recentExpired.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {recentExpired.map((booking) => (
                                            <div key={booking.id} className="bg-white/10 rounded-lg p-3 opacity-60">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-semibold">{booking.student.name}</p>
                                                        <p className="text-gray-400 text-sm">
                                                            Expired: {formatDate(booking.end_date)}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-500/30 text-gray-100">
                                                        Expired
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

















