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
                                className="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">
                                    {route.name}
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Complete route information and statistics
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={`/admin/routes/${route.id}/edit`}
                                className="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-brand-secondary"
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
                                    <p className="text-sm text-slate-500">Active Students</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.total_bookings}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        of {route.capacity} capacity
                                    </p>
                                </div>
                                <UsersIcon className="h-12 w-12 text-sky-500" />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Capacity</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.capacity_utilization}%
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {statistics.available_seats} seats available
                                    </p>
                                </div>
                                <ChartBarIcon className={`h-12 w-12 ${
                                    statistics.capacity_utilization >= 90 ? 'text-rose-500' :
                                    statistics.capacity_utilization >= 70 ? 'text-amber-500' :
                                    'text-amber-500'
                                }`} />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Completions (30d)</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.total_completions}
                                    </p>
                                    {statistics.avg_completion_time_minutes && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            Avg {statistics.avg_completion_time_minutes} mins
                                        </p>
                                    )}
                                </div>
                                <CheckCircleIcon className="h-12 w-12 text-amber-500" />
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Upcoming</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.upcoming_bookings_count}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Starting soon
                                    </p>
                                </div>
                                <CalendarIcon className="h-12 w-12 text-violet-500" />
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Route Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Basic Info Card */}
                            <div className="glass-card p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <MapPinIcon className="h-6 w-6" />
                                    Route Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Route Name</p>
                                        <p className="font-semibold text-slate-900">{route.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Service Type</p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                                            route.service_type === 'am' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            route.service_type === 'pm' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {route.service_type === 'am' ? 'AM Only' :
                                             route.service_type === 'pm' ? 'PM Only' : 'Both'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Status</p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                                            route.active 
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            {route.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {route.pickup_time && (
                                        <div>
                                            <p className="text-sm text-slate-500">Pickup Time</p>
                                            <p className="flex items-center gap-2 font-semibold text-slate-900">
                                                <ClockIcon className="h-4 w-4" />
                                                {formatTime(route.pickup_time)}
                                            </p>
                                        </div>
                                    )}
                                    {route.dropoff_time && (
                                        <div>
                                            <p className="text-sm text-slate-500">Dropoff Time</p>
                                            <p className="flex items-center gap-2 font-semibold text-slate-900">
                                                <ClockIcon className="h-4 w-4" />
                                                {formatTime(route.dropoff_time)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Driver Card */}
                            <div className="glass-card p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <UserIcon className="h-6 w-6" />
                                    Driver
                                </h3>
                                {route.driver ? (
                                    <div className="flex items-start gap-4">
                                        {route.driver.profile_picture_url ? (
                                            <img
                                                src={route.driver.profile_picture_url}
                                                alt={route.driver.name}
                                                className="h-12 w-12 flex-shrink-0 rounded-xl border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50">
                                                <UserIcon className="h-6 w-6 text-amber-600" />
                                            </div>
                                        )}
                                        <div className="space-y-3 flex-1">
                                            <div>
                                                <p className="text-sm text-slate-500">Name</p>
                                                <p className="font-semibold text-slate-900">{route.driver.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Email</p>
                                                <p className="text-slate-700">{route.driver.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="italic text-slate-500">No driver assigned</p>
                                )}
                            </div>

                            {/* Vehicle Card */}
                            <div className="glass-card p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <TruckIcon className="h-6 w-6" />
                                    Vehicle
                                </h3>
                                {route.vehicle ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-slate-500">License Plate</p>
                                            <p className="font-semibold text-slate-900">{route.vehicle.license_plate}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Type</p>
                                            <p className="text-slate-700">{route.vehicle.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Capacity</p>
                                            <p className="font-semibold text-slate-900">{route.vehicle.capacity} passengers</p>
                                        </div>
                                        {route.vehicle.status && (
                                            <div>
                                                <p className="text-sm text-slate-500">Status</p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    route.vehicle.status === 'active' 
                                                        ? 'bg-amber-50 text-amber-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {route.vehicle.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="italic text-slate-500">No vehicle assigned</p>
                                )}
                            </div>

                            {/* Schools Card */}
                            <div className="glass-card p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <AcademicCapIcon className="h-6 w-6" />
                                    Schools Served
                                </h3>
                                {route.schools && route.schools.length > 0 ? (
                                    <div className="space-y-2">
                                        {route.schools.map((school) => (
                                            <div key={school.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <p className="font-semibold text-slate-900">{school.name}</p>
                                                {school.address && (
                                                    <p className="mt-1 text-sm text-slate-500">{school.address}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic text-slate-500">No schools assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Pickup Points & Bookings */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Pickup Points */}
                            {route.pickup_points && route.pickup_points.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <MapPinIcon className="h-6 w-6" />
                                        Pickup Points ({route.pickup_points.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {route.pickup_points.map((point, index) => (
                                            <div key={point.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50">
                                                        <span className="text-sm font-bold text-sky-700">{point.sequence_order || index + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-900">{point.name}</p>
                                                        {point.address && (
                                                            <p className="mt-1 text-sm text-slate-500">{point.address}</p>
                                                        )}
                                                        <div className="flex gap-4 mt-2 text-sm">
                                                            {point.pickup_time && (
                                                                <span className="text-slate-600">
                                                                    🚌 {formatTime(point.pickup_time)}
                                                                </span>
                                                            )}
                                                            {point.dropoff_time && (
                                                                <span className="text-slate-600">
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
                                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                    <UsersIcon className="h-6 w-6" />
                                    Active Students ({activeBookings.length})
                                </h3>
                                {activeBookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">Student</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">Parent</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">Pickup Point</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">Plan</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">Status</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">End Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {activeBookings.map((booking) => (
                                                    <tr key={booking.id} className="transition hover:bg-slate-50">
                                                        <td className="px-4 py-3 font-semibold text-slate-900">
                                                            {booking.student.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-600">
                                                            {booking.student.parent?.name || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-600">
                                                            {booking.pickup_point?.name || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-600">
                                                            {booking.plan_type.replace('_', ' ')}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                booking.status === 'active' 
                                                                    ? 'bg-amber-50 text-amber-700'
                                                                    : 'bg-amber-50 text-amber-700'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-slate-600">
                                                            {formatDate(booking.end_date)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="italic text-slate-500">No active bookings</p>
                                )}
                            </div>

                            {/* Upcoming Bookings */}
                            {upcomingBookings.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <CalendarIcon className="h-6 w-6" />
                                        Upcoming Students ({upcomingBookings.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {upcomingBookings.map((booking) => (
                                            <div key={booking.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{booking.student.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            Starts: {formatDate(booking.start_date)}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
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
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <CheckCircleIcon className="h-6 w-6" />
                                        Recent Completions
                                    </h3>
                                    <div className="space-y-2">
                                        {route.completions.slice(0, 5).map((completion) => (
                                            <div key={completion.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {formatDate(completion.completion_date)}
                                                        </p>
                                                        {completion.driver && (
                                                            <p className="text-sm text-slate-500">
                                                                By: {completion.driver.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <CheckCircleIcon className="h-5 w-5 text-amber-500" />
                                                </div>
                                                {completion.notes && (
                                                    <p className="mt-2 text-sm text-slate-600">{completion.notes}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recently Expired */}
                            {recentExpired.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        Recently Expired ({recentExpired.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {recentExpired.map((booking) => (
                                            <div key={booking.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-75">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{booking.student.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            Expired: {formatDate(booking.end_date)}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
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

















