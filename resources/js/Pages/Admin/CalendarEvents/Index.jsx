import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
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
                return 'bg-green-500/30 text-green-100 border border-green-400/50';
            case 'holiday':
                return 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50';
            case 'closure':
                return 'bg-red-500/30 text-red-100 border border-red-400/50';
            default:
                return 'bg-gray-500/30 text-gray-200 border border-gray-400/50';
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
                    <div className="glass-card overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Calendar Events</h2>
                                <Link
                                    href="/admin/calendar-events/create"
                                    className="glass-button text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Add Calendar Event
                                </Link>
                            </div>

                            {calendarEvents.data && calendarEvents.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/20">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                            {calendarEvents.data.map((event) => (
                                                <tr key={event.id} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(event.type)}`}>
                                                            {formatType(event.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-base font-semibold text-white/90">
                                                        {event.description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                                                        <Link
                                                            href={`/admin/calendar-events/${event.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4 font-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            disabled={deleting === event.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50 font-semibold"
                                                        >
                                                            {deleting === event.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white text-lg font-semibold">No calendar events found.</p>
                            )}

                            {calendarEvents.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {calendarEvents.links.map((link, index) => (
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


