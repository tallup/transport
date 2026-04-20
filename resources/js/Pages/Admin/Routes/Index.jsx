import { Head, Link, router, usePage } from '@inertiajs/react';
import { routeServiceTypeLabel } from '@/utils/routeServiceType';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
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
                                <h1 className="mb-2 text-4xl font-extrabold text-text-primary">Routes</h1>
                                <p className="text-lg font-medium text-text-secondary">Manage all transport routes</p>
                            </div>
                            <Link
                                href="/admin/routes/create"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
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
                                                <h3 className="truncate text-lg font-bold text-slate-900">{route.name}</h3>
                                                <p className="truncate text-sm font-medium text-slate-500">
                                                    {route.driver?.name || 'No driver assigned'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                                            route.active ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-100 text-slate-600'
                                        }`}>
                                            {route.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <p className="text-sm font-medium text-slate-700">
                                                Driver: {route.driver?.name || <span className="text-slate-400 italic">No driver assigned</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <p className="text-sm font-medium text-slate-700">
                                                Vehicle: {route.vehicle?.license_plate || 'No vehicle'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-slate-700">
                                                        Occupancy: {route.active_bookings_count} / {route.capacity}
                                                    </p>
                                                </div>
                                                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    route.occupancy_percentage >= 100 ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                    route.occupancy_percentage >= 85 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                    'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {route.occupancy_percentage >= 100 ? 'Full' :
                                                     route.occupancy_percentage >= 85 ? 'High' : 'Normal'}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${
                                                        route.occupancy_percentage >= 100 ? 'bg-rose-500' :
                                                        route.occupancy_percentage >= 85 ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, route.occupancy_percentage)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className={`max-w-[16rem] rounded-lg border px-2 py-1 text-left text-xs font-semibold leading-snug ${
                                                route.service_type === 'am' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                route.service_type === 'pm' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                                                'border-emerald-200 bg-emerald-50 text-emerald-800'
                                            }`}>
                                                {routeServiceTypeLabel(route.service_type)}
                                            </span>
                                        </div>
                                        {route.schools && route.schools.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                    {route.schools.slice(0, 2).map((school) => (
                                                        <span key={school.id} className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                                                            {school.name}
                                                        </span>
                                                    ))}
                                                    {route.schools.length > 2 && (
                                                        <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                                                            +{route.schools.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                        <Link
                                            href={`/admin/routes/${route.id}`}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/routes/${route.id}/edit`}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(route.id)}
                                            disabled={deleting === route.id}
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
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

                    <PaginationLinks links={routes.links} />
                </div>
            </div>
        </AdminLayout>
    );
}


