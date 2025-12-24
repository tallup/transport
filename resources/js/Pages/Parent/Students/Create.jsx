import { Head, useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreateStudent() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        school: '',
        date_of_birth: '',
        emergency_phone: '',
        emergency_contact_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/parent/students');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Student" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Add Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Student Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                                        School *
                                    </label>
                                    <input
                                        type="text"
                                        id="school"
                                        value={data.school}
                                        onChange={(e) => setData('school', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.school && (
                                        <p className="mt-1 text-sm text-red-600">{errors.school}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.date_of_birth && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700">
                                        Emergency Contact Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="emergency_contact_name"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.emergency_contact_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700">
                                        Emergency Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="emergency_phone"
                                        value={data.emergency_phone}
                                        onChange={(e) => setData('emergency_phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.emergency_phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.emergency_phone}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/parent/dashboard"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Add Student'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

