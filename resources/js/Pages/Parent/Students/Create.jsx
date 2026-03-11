import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';

export default function CreateStudent({ schools = [] }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        school_id: '',
        date_of_birth: '',
        emergency_phone: '',
        emergency_contact_name: '',
    });

    // Format phone on mount if it exists (for editing scenarios)
    useEffect(() => {
        if (data.emergency_phone && !data.emergency_phone.includes('(')) {
            setData('emergency_phone', formatPhoneNumber(data.emergency_phone));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare submission data with unformatted phone
        const submitData = {
            ...data,
            emergency_phone: unformatPhoneNumber(data.emergency_phone || '')
        };
        
        // Submit with transformed data
        router.post('/parent/students', submitData);
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setData('emergency_phone', formatted);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Student" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="parent-form-shell overflow-hidden">
                        <div className="p-6">
                            <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-4">
                                <p className="mb-2 text-slate-700">
                                    <strong>Complete Enrollment Available:</strong> For full enrollment with all required forms, policies, and signatures, please use the{' '}
                                    <Link href="/parent/students/enroll" className="font-bold text-sky-700 underline hover:text-sky-800">
                                        Complete Enrollment Form
                                    </Link>.
                                </p>
                            </div>
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Add Student (Quick Form)</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Student Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="form-control mt-1 block w-full"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="school_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            School *
                                        </label>
                                        <select
                                            id="school_id"
                                            value={data.school_id}
                                            onChange={(e) => setData('school_id', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        >
                                            <option value="">Select a school</option>
                                            {schools.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.school_id && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.school_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="date_of_birth" className="mb-2 block text-base font-semibold text-slate-700">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="date_of_birth"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="form-control mt-1 block w-full"
                                        />
                                        {errors.date_of_birth && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_contact_name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Emergency Contact Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            className="form-control mt-1 block w-full"
                                            required
                                        />
                                        {errors.emergency_contact_name && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.emergency_contact_name}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="emergency_phone" className="mb-2 block text-base font-semibold text-slate-700">
                                            Emergency Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="emergency_phone"
                                            value={data.emergency_phone}
                                            onChange={handlePhoneChange}
                                            className="form-control mt-1 block w-full"
                                            placeholder="(123) 456-7890"
                                            maxLength="14"
                                            required
                                        />
                                        {errors.emergency_phone && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.emergency_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/parent/dashboard"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Add Student'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

