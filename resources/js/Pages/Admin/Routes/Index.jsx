import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ routes }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this route?')) {
            setDeleting(id);
            router.delete(`/admin/routes/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Routes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Routes</h2>
                                <Link
                                    href="/admin/routes/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Route
                                </Link>
                            </div>

                            {routes.data && routes.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200/50">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Driver
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Vehicle
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Capacity
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Service Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Schools
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
                                            {routes.data.map((route) => (
                                                <tr key={route.id} className="hover:bg-white/10 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {route.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {route.driver?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {route.vehicle?.license_plate || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {route.capacity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                            route.service_type === 'am' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                                            route.service_type === 'pm' ? 'bg-blue-500/30 text-blue-100 border-blue-400/50' :
                                                            'bg-green-500/30 text-green-100 border-green-400/50'
                                                        }`}>
                                                            {route.service_type === 'am' ? 'AM Only' :
                                                             route.service_type === 'pm' ? 'PM Only' : 'Both'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                                        {route.schools && route.schools.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {route.schools.slice(0, 2).map((school) => (
                                                                    <span key={school.id} className="px-2 py-1 bg-indigo-500/30 text-indigo-100 rounded text-xs">
                                                                        {school.name}
                                                                    </span>
                                                                ))}
                                                                {route.schools.length > 2 && (
                                                                    <span className="px-2 py-1 bg-gray-500/30 text-gray-200 rounded text-xs">
                                                                        +{route.schools.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                            route.active ? 'bg-green-500/30 text-green-100 border-green-400/50' : 'bg-gray-500/30 text-gray-200 border-gray-400/50'
                                                        }`}>
                                                            {route.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/admin/routes/${route.id}`}
                                                            className="text-green-300 hover:text-green-100 mr-4"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={`/admin/routes/${route.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(route.id)}
                                                            disabled={deleting === route.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50"
                                                        >
                                                            {deleting === route.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white">No routes found.</p>
                            )}

                            {routes.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {routes.links.map((link, index) => (
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


