import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function Create({ parents, schools = [] }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        parent_id: '',
        name: '',
        school_id: '',
        date_of_birth: '',
        emergency_phone: '',
        emergency_contact_name: '',
        profile_picture: null,
    });

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setData('emergency_phone', formatted);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare submission data with unformatted phone
        const submitData = {
            ...data,
            emergency_phone: unformatPhoneNumber(data.emergency_phone || '')
        };
        
        // Submit with transformed data
        router.post('/admin/students', submitData, data.profile_picture ? { forceFormData: true } : {});
    };

    return (
        <AdminLayout>
            <Head title="Create Student" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Create Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="parent_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            Parent *
                                        </label>
                                        <select
                                            id="parent_id"
                                            value={data.parent_id}
                                            onChange={(e) => setData('parent_id', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Select Parent</option>
                                            {parents.map((parent) => (
                                                <option key={parent.id} value={parent.id}>
                                                    {parent.name} ({parent.email})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.parent_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Student Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-base font-semibold text-slate-700">Profile Picture (optional)</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                {data.profile_picture ? (
                                                    <img src={URL.createObjectURL(data.profile_picture)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <PhotoIcon className="w-8 h-8 text-yellow-500" />
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setData('profile_picture', file);
                                                }}
                                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF. Max 10MB</p>
                                        <InputError message={errors.profile_picture} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="school_id" className="mb-2 block text-base font-semibold text-slate-700">
                                            School *
                                        </label>
                                        <select
                                            id="school_id"
                                            value={data.school_id}
                                            onChange={(e) => setData('school_id', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Select School</option>
                                            {schools.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.school_id} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="date_of_birth" className="mb-2 block text-base font-semibold text-slate-700">
                                            Date of Birth *
                                        </label>
                                        <input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.date_of_birth} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_contact_name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Emergency Contact Name *
                                        </label>
                                        <input
                                            id="emergency_contact_name"
                                            type="text"
                                            value={data.emergency_contact_name}
                                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.emergency_contact_name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="emergency_phone" className="mb-2 block text-base font-semibold text-slate-700">
                                            Emergency Phone *
                                        </label>
                                        <input
                                            id="emergency_phone"
                                            type="tel"
                                            value={data.emergency_phone}
                                            onChange={handlePhoneChange}
                                            className="form-control"
                                            placeholder="(123) 456-7890"
                                            maxLength="14"
                                            required
                                        />
                                        <InputError message={errors.emergency_phone} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href="/admin/students">
                                        <GlassButton type="button" variant="secondary">
                                            Cancel
                                        </GlassButton>
                                    </Link>
                                    <GlassButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Student'}
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


