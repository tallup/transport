import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Edit({ student, parents }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        parent_id: student.parent_id || '',
        name: student.name || '',
        school: student.school || '',
        date_of_birth: student.date_of_birth ? (typeof student.date_of_birth === 'string' ? student.date_of_birth.split('T')[0] : student.date_of_birth) : '',
        emergency_phone: student.emergency_phone || '',
        emergency_contact_name: student.emergency_contact_name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/students/${student.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Student" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="parent_id" className="block text-base font-bold text-white mb-2">
                                            Parent *
                                        </label>
                                        <select
                                            id="parent_id"
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="" className="bg-indigo-700">Select Parent</option>
                                            {parents.map((parent) => (
                                                <option key={parent.id} value={parent.id} className="bg-indigo-700">
                                                    {parent.name} ({parent.email})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.parent_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Student Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="school" className="block text-base font-bold text-white mb-2">
                                            School *
                                        </label>
                                        <input
                                            id="school"
                                            type="text"
                                            value={data.school}
                                            onChange={(e) => setData('school', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.school} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="date_of_birth" className="block text-base font-bold text-white mb-2">
                                            Date of Birth *
                                        </label>
                                        <input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        />
                                        <InputError message={errors.date_of_birth} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_contact_name" className="block text-base font-bold text-white mb-2">
                                            Emergency Contact Name *
                                        </label>
                                        <input
                                            id="emergency_contact_name"
                                            type="text"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.emergency_contact_name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_phone" className="block text-base font-bold text-white mb-2">
                                            Emergency Phone *
                                        </label>
                                        <input
                                            id="emergency_phone"
                                            type="tel"
                                            value={data.emergency_phone}
                                            onChange={(e) => setData('emergency_phone', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.emergency_phone} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/students"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Student'}
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
