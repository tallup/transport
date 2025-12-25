import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';

export default function Edit({ student, parents }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        parent_id: student.parent_id || '',
        name: student.name || '',
        school: student.school || '',
        date_of_birth: student.date_of_birth || '',
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
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Edit Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent *" />
                                    <Select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="">Select Parent</option>
                                        {parents.map((parent) => (
                                            <option key={parent.id} value={parent.id}>
                                                {parent.name} ({parent.email})
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError message={errors.parent_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Student Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school" value="School *" />
                                    <TextInput
                                        id="school"
                                        type="text"
                                        value={data.school}
                                        onChange={(e) => setData('school', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.school} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date_of_birth" value="Date of Birth *" />
                                    <TextInput
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth ? data.date_of_birth.split('T')[0] : ''}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.date_of_birth} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="emergency_contact_name" value="Emergency Contact Name *" />
                                    <TextInput
                                        id="emergency_contact_name"
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.emergency_contact_name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="emergency_phone" value="Emergency Phone *" />
                                    <TextInput
                                        id="emergency_phone"
                                        type="tel"
                                        value={data.emergency_phone}
                                        onChange={(e) => setData('emergency_phone', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.emergency_phone} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/students"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Student'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


