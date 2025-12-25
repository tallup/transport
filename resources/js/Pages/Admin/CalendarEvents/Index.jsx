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
                return 'bg-green-100 text-green-800';
            case 'holiday':
                return 'bg-yellow-100 text-yellow-800';
            case 'closure':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Calendar Events</h2>
                                <Link
                                    href="/admin/calendar-events/create"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Calendar Event
                                </Link>
                            </div>

                            {calendarEvents.data && calendarEvents.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {calendarEvents.data.map((event) => (
                                                <tr key={event.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(event.type)}`}>
                                                            {formatType(event.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {event.description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/admin/calendar-events/${event.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            disabled={deleting === event.id}
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
                                <p className="text-gray-500">No calendar events found.</p>
                            )}

                            {calendarEvents.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {calendarEvents.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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


