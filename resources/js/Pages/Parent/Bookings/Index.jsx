import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BookingsIndex({ bookings }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">My Bookings</h2>
                                <Link
                                    href="/parent/bookings/create"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    New Booking
                                </Link>
                            </div>

                            {bookings && bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="text-lg font-semibold">{booking.student?.name}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {booking.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Route:</span> {booking.route?.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Pickup:</span> {booking.pickup_point?.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Plan:</span> {booking.plan_type?.replace('_', '-').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Start:</span> {new Date(booking.start_date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">No bookings yet.</p>
                                    <Link
                                        href="/parent/bookings/create"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block"
                                    >
                                        Create Your First Booking
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

