import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ vehicles }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            setDeleting(id);
            router.delete(`/admin/vehicles/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/30 text-green-100 border border-green-400/50';
            case 'maintenance':
                return 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50';
            case 'retired':
                return 'bg-gray-500/30 text-gray-200 border border-gray-400/50';
            default:
                return 'bg-gray-500/30 text-gray-200 border border-gray-400/50';
        }
    };

    return (
        <AdminLayout>
            <Head title="Vehicles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Vehicles</h2>
                                <Link
                                    href="/admin/vehicles/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Vehicle
                                </Link>
                            </div>

                            {vehicles.data && vehicles.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200/50">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    License Plate
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Make/Model
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Year
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Capacity
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-gray-200/30">
                                            {vehicles.data.map((vehicle) => (
                                                <tr key={vehicle.id} className="hover:bg-white/10 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {vehicle.license_plate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                            {vehicle.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {vehicle.make} {vehicle.model}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {vehicle.year}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {vehicle.capacity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                                                            {vehicle.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/admin/vehicles/${vehicle.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(vehicle.id)}
                                                            disabled={deleting === vehicle.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50"
                                                        >
                                                            {deleting === vehicle.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white">No vehicles found.</p>
                            )}

                            {vehicles.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {vehicles.links.map((link, index) => (
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


