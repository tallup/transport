import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
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
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Routes</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage all transport routes</p>
                            </div>
                            <Link
                                href="/admin/routes/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add Route
                            </Link>
                        </div>
                    </div>

                    {routes.data && routes.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {routes.data.map((route) => (
                                <GlassCard key={route.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-extrabold text-white truncate">{route.name}</h3>
                                                <p className="text-sm text-white/70 font-medium truncate">
                                                    {route.driver?.name || 'No driver assigned'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            route.active ? 'bg-green-500/30 text-brand-primary border border-green-400/50' : 'bg-gray-500/30 text-brand-primary border border-gray-400/50'
                                        }`}>
                                            {route.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium">
                                                Vehicle: {route.vehicle?.license_plate || 'No vehicle'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium">
                                                Capacity: {route.capacity} students
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                                                route.service_type === 'am' ? 'bg-yellow-500/30 text-brand-primary border-yellow-400/50' :
                                                route.service_type === 'pm' ? 'bg-blue-500/30 text-brand-primary border-blue-400/50' :
                                                'bg-green-500/30 text-brand-primary border-green-400/50'
                                            }`}>
                                                {route.service_type === 'am' ? 'AM Only' :
                                                 route.service_type === 'pm' ? 'PM Only' : 'Both'}
                                            </span>
                                        </div>
                                        {route.schools && route.schools.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {route.schools.slice(0, 2).map((school) => (
                                                        <span key={school.id} className="px-2 py-1 bg-blue-500/30 text-brand-primary border border-blue-400/50 rounded-lg text-xs font-bold">
                                                            {school.name}
                                                        </span>
                                                    ))}
                                                    {route.schools.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-500/30 text-brand-primary border border-gray-400/50 rounded-lg text-xs font-bold">
                                                            +{route.schools.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                        <Link
                                            href={`/admin/routes/${route.id}`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/routes/${route.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(route.id)}
                                            disabled={deleting === route.id}
                                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                        >
                                            {deleting === route.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No routes found.</p>
                            </div>
                        </GlassCard>
                    )}

                    {routes.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {routes.links.map((link, index) => {
                                    const baseClass = `px-4 py-2.5 rounded-xl font-bold text-sm ${
                                        link.active
                                            ? 'bg-yellow-400/35 text-brand-primary border-2 border-yellow-400 shadow-sm'
                                            : 'bg-yellow-400/20 text-white border-2 border-yellow-400/80 hover:bg-yellow-400/30 hover:border-yellow-400'
                                    } ${!link.url ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`;
                                    return link.url ? (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => router.get(link.url)}
                                            className={baseClass}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className={baseClass}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}


