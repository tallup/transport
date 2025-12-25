import { Head, usePage } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';

export default function Dashboard({ route, stats }) {
    const { auth } = usePage().props;
    
    return (
        <DriverLayout>
            <Head title="Driver Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-3xl font-bold mb-6">Welcome, {auth?.user?.name || 'Driver'}!</h1>

                            {!route ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <p className="text-yellow-800">
                                        No route has been assigned to you yet. Please contact your administrator.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                                            <h3 className="text-sm font-medium text-blue-600 mb-2">Route Name</h3>
                                            <p className="text-2xl font-bold text-blue-900">{stats.route_name}</p>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                            <h3 className="text-sm font-medium text-green-600 mb-2">Vehicle</h3>
                                            <p className="text-lg font-semibold text-green-900">{stats.vehicle}</p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                                            <h3 className="text-sm font-medium text-purple-600 mb-2">Total Students</h3>
                                            <p className="text-2xl font-bold text-purple-900">{stats.total_students}</p>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                                            <h3 className="text-sm font-medium text-orange-600 mb-2">Today's Bookings</h3>
                                            <p className="text-2xl font-bold text-orange-900">{stats.today_bookings}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-4">Route Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Route Name</p>
                                                <p className="text-lg font-medium">{route.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Pickup Points</p>
                                                <p className="text-lg font-medium">{stats.pickup_points}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}

