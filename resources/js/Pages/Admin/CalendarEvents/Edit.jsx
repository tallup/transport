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
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit Calendar Event</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="date" className="mb-2 block text-base font-semibold text-slate-700">
                                            Date *
                                        </label>
                                        <input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.date} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="mb-2 block text-base font-semibold text-slate-700">
                                            Type *
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="school_day">School Day</option>
                                            <option value="holiday">Holiday</option>
                                            <option value="closure">Closure</option>
                                            <option value="event">Event</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="mb-2 block text-base font-semibold text-slate-700">
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="form-control"
                                            rows="4"
                                            required
                                        />
                                        <InputError message={errors.description} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/calendar-events"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
