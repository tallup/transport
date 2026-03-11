import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import GlassButton from '@/Components/GlassButton';
import GlassCard from '@/Components/GlassCard';
import Select from '@/Components/Select';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        type: 'holiday',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/calendar-events');
    };

    return (
        <AdminLayout>
            <Head title="Create Calendar Event" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Calendar Event</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="date" className="mb-2 block text-base font-semibold text-slate-700">Date *</label>
                                    <TextInput
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="type" className="mb-2 block text-base font-semibold text-slate-700">Type *</label>
                                    <Select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="form-control"
                                        required
                                    >
                                        <option value="school_day">School Day</option>
                                        <option value="holiday">Holiday</option>
                                        <option value="closure">Closure</option>
                                    </Select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="mb-2 block text-base font-semibold text-slate-700">Description *</label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="form-control"
                                        rows="4"
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/calendar-events"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Calendar Event'}
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










