import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ bookings }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            setDeleting(id);
            router.delete(`/admin/bookings/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleApprove = (id) => {
        if (confirm('Approve this booking and activate it?')) {
            router.post(`/admin/bookings/${id}/approve`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleCancel = (id) => {
        if (confirm('Cancel this booking?')) {
            router.post(`/admin/bookings/${id}/cancel`, {}, {
                preserveScroll: true,
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/30 text-green-100 border border-green-400/50';
            case 'pending':
                return 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50';
            case 'awaiting_approval':
                return 'bg-amber-500/30 text-amber-100 border border-amber-400/50';
            case 'cancelled':
                return 'bg-red-500/30 text-red-100 border border-red-400/50';
            case 'expired':
                return 'bg-gray-500/30 text-gray-200 border border-gray-400/50';
            default:
                return 'bg-gray-500/30 text-gray-200 border border-gray-400/50';
        }
    };

    const formatPlanType = (planType) => {
        return planType.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Bookings</h2>
                                <Link
                                    href="/admin/bookings/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Booking
                                </Link>
                            </div>

                            {bookings.data && bookings.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/10 border border-brand-primary/10 rounded-lg overflow-hidden">
                                        <thead className="bg-white/10 border-b border-brand-primary/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Student
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Route
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Pickup Point
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Plan Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Start Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    End Date
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-brand-primary/10">
                                            {bookings.data.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-white/10 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {booking.student?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {booking.route?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {booking.pickupPoint?.name || booking.pickup_address || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                            {formatPlanType(booking.plan_type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                            {formatStatus(booking.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                                                        <Link
                                                            href={`/admin/bookings/${booking.id}`}
                                                            className="text-indigo-300 hover:text-indigo-100 mr-4 font-semibold"
                                                        >
                                                            View
                                                        </Link>
                                                        {(booking.status === 'pending' || booking.status === 'awaiting_approval') && (
                                                            <button
                                                                onClick={() => handleApprove(booking.id)}
                                                                className="text-green-300 hover:text-green-100 mr-4 font-semibold"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {['pending', 'awaiting_approval', 'active'].includes(booking.status) && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="text-red-300 hover:text-red-100 mr-4 font-semibold"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/admin/bookings/${booking.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4 font-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            disabled={deleting === booking.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50 font-semibold"
                                                        >
                                                            {deleting === booking.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white text-lg font-semibold">No bookings found.</p>
                            )}

                            {bookings.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {bookings.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-lg ${
                                                    link.active
                                                        ? 'glass-button text-white'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
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


