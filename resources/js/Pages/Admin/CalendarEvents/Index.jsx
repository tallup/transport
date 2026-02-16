import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import { useState } from 'react';

export default function Index({ calendarEvents }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this calendar event?')) {
            setDeleting(id);
            router.delete(`/admin/calendar-events/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'school_day':
                return 'bg-green-500/30 text-brand-primary border border-green-400/50';
            case 'holiday':
                return 'bg-yellow-500/30 text-brand-primary border border-yellow-400/50';
            case 'closure':
                return 'bg-red-500/30 text-brand-primary border border-red-400/50';
            default:
                return 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
        }
    };

    const formatType = (type) => {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout>
            <Head title="Calendar Events" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Calendar Events</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage school calendar and events</p>
                            </div>
                            <Link
                                href="/admin/calendar-events/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add Calendar Event
                            </Link>
                        </div>
                    </div>

                    {calendarEvents.data && calendarEvents.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {calendarEvents.data.map((event) => (
                                <GlassCard key={event.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-extrabold text-white truncate">
                                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                                        weekday: 'short', 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </h3>
                                                <p className="text-sm text-white/70 font-medium truncate">
                                                    {event.description || 'No description'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getTypeColor(event.type)}`}>
                                            {formatType(event.type)}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium line-clamp-3">{event.description || 'No description provided'}</p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                        <Link
                                            href={`/admin/calendar-events/${event.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            disabled={deleting === event.id}
                                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                        >
                                            {deleting === event.id ? 'Deleting...' : 'Delete'}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No calendar events found.</p>
                            </div>
                        </GlassCard>
                    )}

                    {calendarEvents.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {calendarEvents.links.map((link, index) => {
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


