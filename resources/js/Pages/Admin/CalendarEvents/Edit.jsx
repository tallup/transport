import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Edit({ calendarEvent }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        date: calendarEvent.date ? (typeof calendarEvent.date === 'string' ? calendarEvent.date.split('T')[0] : calendarEvent.date) : '',
        type: calendarEvent.type || 'holiday',
        description: calendarEvent.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/calendar-events/${calendarEvent.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Calendar Event" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit Calendar Event</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="date" className="block text-base font-bold text-white mb-2">
                                            Date *
                                        </label>
                                        <input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        />
                                        <InputError message={errors.date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-base font-bold text-white mb-2">
                                            Type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="school_day" className="bg-indigo-700">School Day</option>
                                            <option value="holiday" className="bg-indigo-700">Holiday</option>
                                            <option value="closure" className="bg-indigo-700">Closure</option>
                                            <option value="event" className="bg-indigo-700">Event</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-base font-bold text-white mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            rows="4"
                                            required
                                        />
                                        <InputError message={errors.description} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/calendar-events"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Calendar Event'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
