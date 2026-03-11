import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function Edit({ student, parents, schools = [] }) {
    const { auth } = usePage().props;
    const [profilePreview, setProfilePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, put, processing, errors } = useForm({
        parent_id: student.parent_id || '',
        name: student.name || '',
        school_id: student.school_id || student.school?.id || '',
        date_of_birth: student.date_of_birth ? (typeof student.date_of_birth === 'string' ? student.date_of_birth.split('T')[0] : student.date_of_birth) : '',
        emergency_phone: student.emergency_phone || '',
        emergency_contact_name: student.emergency_contact_name || '',
        profile_picture: null,
    });

    // Format phone on mount if it exists
    useEffect(() => {
        if (data.emergency_phone && !data.emergency_phone.includes('(')) {
            setData('emergency_phone', formatPhoneNumber(data.emergency_phone));
        }
    }, []);

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setData('emergency_phone', formatted);
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...data,
            emergency_phone: unformatPhoneNumber(data.emergency_phone || ''),
            _method: 'PUT'
        };
        router.post(`/admin/students/${student.id}`, submitData, data.profile_picture ? { forceFormData: true } : {});
    };

    return (
        <AdminLayout>
            <Head title="Edit Student" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit Student</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-base font-semibold text-slate-700">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                            {(profilePreview || student.profile_picture_url) ? (
                                                <img src={profilePreview || student.profile_picture_url} alt={student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                    <PhotoIcon className="h-8 w-8 text-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/gif" onChange={handleProfilePictureChange} className="hidden" id="profile_picture" />
                                            <label htmlFor="profile_picture" className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                                                {student.profile_picture_url || profilePreview ? 'Change' : 'Upload'}
                                            </label>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF. Max 10MB</p>
                                    <InputError message={errors.profile_picture} className="mt-2 text-red-300 font-semibold" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
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

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/students"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
