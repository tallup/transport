import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';

export default function CreateStudent() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        school: '',
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
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Add Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Student Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="school" className="block text-base font-bold text-white mb-2">
                                            School *
                                        </label>
                                        <input
                                            type="text"
                                            id="school"
                                            value={data.school}
                                            onChange={(e) => setData('school', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        {errors.school && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.school}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="date_of_birth" className="block text-base font-bold text-white mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="date_of_birth"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                        />
                                        {errors.date_of_birth && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_contact_name" className="block text-base font-bold text-white mb-2">
                                            Emergency Contact Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        {errors.emergency_contact_name && (
                                            <p className="mt-1 text-sm text-red-300 font-semibold">{errors.emergency_contact_name}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="emergency_phone" className="block text-base font-bold text-white mb-2">
                                            Emergency Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="emergency_phone"
                                            value={data.emergency_phone}
                                            onChange={handlePhoneChange}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
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
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
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

