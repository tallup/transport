import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ students, bookings }) {
    const { auth } = usePage().props;
    
    return (
        <AuthenticatedLayout
            auth={auth}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-4">Welcome, {auth?.user?.name || 'User'}!</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">My Students</h3>
                                    <p className="text-3xl font-bold">{students?.length || 0}</p>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Active Bookings</h3>
                                    <p className="text-3xl font-bold">{bookings?.filter(b => b.status === 'active').length || 0}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                                {bookings && bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="border p-4 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold">{booking.student?.name}</p>
                                                        <p className="text-sm text-gray-600">{booking.route?.name}</p>
                                                        <p className="text-sm text-gray-600">{booking.pickup_point?.name}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No bookings yet.</p>
                                )}
                            </div>

                            <div className="mt-6 flex gap-4">
                                <Link
                                    href="/parent/students/create"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Student
                                </Link>
                                <Link
                                    href="/parent/bookings/create"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Book Transport
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

