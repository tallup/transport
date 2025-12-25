import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ pickupPoints }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this pickup point?')) {
            setDeleting(id);
            router.delete(`/admin/pickup-points/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Pickup Points" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Pickup Points</h2>
                                <Link
                                    href="/admin/pickup-points/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Pickup Point
                                </Link>
                            </div>

                            {pickupPoints.data && pickupPoints.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200/50">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Route
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Address
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Sequence
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Pickup Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Dropoff Time
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-gray-200/30">
                                            {pickupPoints.data.map((point) => (
                                                <tr key={point.id} className="hover:bg-white/10 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {point.route?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {point.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-base font-semibold text-white/90">
                                                        {point.address}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {point.sequence_order}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {point.pickup_time}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {point.dropoff_time}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                                                        <Link
                                                            href={`/admin/pickup-points/${point.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4 font-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(point.id)}
                                                            disabled={deleting === point.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50 font-semibold"
                                                        >
                                                            {deleting === point.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white text-lg font-semibold">No pickup points found.</p>
                            )}

                            {pickupPoints.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {pickupPoints.links.map((link, index) => (
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


