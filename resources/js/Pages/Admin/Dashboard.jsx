import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ stats, recentBookings }) {
    const { auth } = usePage().props;
    
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6">Welcome, {auth?.user?.name || 'Admin'}!</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Total Students</h3>
                                    <p className="text-4xl font-bold text-blue-600">{stats?.total_students || 0}</p>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Active Routes</h3>
                                    <p className="text-4xl font-bold text-green-600">{stats?.total_routes || 0}</p>
                                </div>
                                
                                <div className="bg-purple-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Total Vehicles</h3>
                                    <p className="text-4xl font-bold text-purple-600">{stats?.total_vehicles || 0}</p>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Active Bookings</h3>
                                    <p className="text-4xl font-bold text-yellow-600">{stats?.active_bookings || 0}</p>
                                </div>
                                
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Pending Bookings</h3>
                                    <p className="text-4xl font-bold text-orange-600">{stats?.pending_bookings || 0}</p>
                                </div>
                                
                                <div className="bg-indigo-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Total Revenue</h3>
                                    <p className="text-4xl font-bold text-indigo-600">${stats?.total_revenue?.toLocaleString() || '0.00'}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                                {recentBookings && recentBookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recentBookings.map((booking) => (
                                                    <tr key={booking.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {booking.student?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {booking.route?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(booking.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No recent bookings</p>
                                )}
                            </div>

                            <div className="mt-8 flex gap-4">
                                <Link
                                    href="/admin/students/create"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Student
                                </Link>
                                <Link
                                    href="/admin/vehicles/create"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Vehicle
                                </Link>
                                <Link
                                    href="/admin/routes/create"
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Route
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

