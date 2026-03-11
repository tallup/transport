import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/phoneFormatter';
import { PhotoIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditStudent({ student, schools = [] }) {
    const { auth } = usePage().props;
    const [profilePreview, setProfilePreview] = useState(null);
    const fileInputRef = useRef(null);

    const formatDateForInput = (val) => {
        if (!val) return '';
        const d = typeof val === 'string' ? val.split('T')[0] : val;
        return d;
    };

    const { data, setData, put, processing, errors } = useForm({
        name: student.name || '',
        profile_picture: null,
        school_id: student.school_id || student.school?.id || '',
        date_of_birth: formatDateForInput(student.date_of_birth) || '',
        home_address: student.home_address || '',
        grade: student.grade || '',
        emergency_phone: student.emergency_phone || '',
        emergency_contact_name: student.emergency_contact_name || '',
        emergency_contact_2_name: student.emergency_contact_2_name || '',
        emergency_contact_2_phone: student.emergency_contact_2_phone || '',
        emergency_contact_2_relationship: student.emergency_contact_2_relationship || '',
        doctor_name: student.doctor_name || '',
        doctor_phone: student.doctor_phone || '',
        medical_notes: student.medical_notes || '',
        special_instructions: student.special_instructions || '',
        authorized_pickup_persons: Array.isArray(student.authorized_pickup_persons)
            ? student.authorized_pickup_persons.map((p) => ({ name: p.name || '', relationship: p.relationship || '', phone: p.phone || '' }))
            : [],
    });

    useEffect(() => {
        if (data.emergency_phone && !data.emergency_phone.includes('(')) {
            setData('emergency_phone', formatPhoneNumber(data.emergency_phone));
        }
    }, []);

    const handlePhoneChange = (field, e) => {
        const inputValue = e.target.value;
        const formatted = formatPhoneNumber(inputValue);
        setData(field, formatted);
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

    const removeProfilePicture = () => {
        setData('profile_picture', null);
        setProfilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAuthorizedPickupChange = (index, field, value) => {
        const persons = [...(data.authorized_pickup_persons || [])];
        if (!persons[index]) persons[index] = { name: '', relationship: '', phone: '' };
        persons[index][field] = value;
        setData('authorized_pickup_persons', persons);
    };

    const addAuthorizedPickupPerson = () => {
        setData('authorized_pickup_persons', [...(data.authorized_pickup_persons || []), { name: '', relationship: '', phone: '' }]);
    };

    const removeAuthorizedPickupPerson = (index) => {
        setData('authorized_pickup_persons', data.authorized_pickup_persons.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('parent.students.update', student.id), {
            transform: (formData) => ({
                ...formData,
                emergency_phone: unformatPhoneNumber(formData.emergency_phone || ''),
                emergency_contact_2_phone: unformatPhoneNumber(formData.emergency_contact_2_phone || ''),
                doctor_phone: unformatPhoneNumber(formData.doctor_phone || ''),
                authorized_pickup_persons: (formData.authorized_pickup_persons || [])
                    .filter((p) => (p.name || '').trim())
                    .map((p) => ({
                        name: (p.name || '').trim(),
                        relationship: (p.relationship || '').trim(),
                        phone: (p.phone || '').trim(),
                    })),
            }),
            ...(data.profile_picture ? { forceFormData: true } : {}),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Student" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('parent.students.index')}
                            className="inline-flex items-center gap-2 font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Students
                        </Link>
                    </div>

                    <GlassCard className="parent-form-shell overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-400">
                                    <PencilIcon className="h-7 w-7 text-slate-900" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Edit Student</h2>
                                    <p className="mt-1 font-medium text-slate-500">Update your child's information</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Profile Picture */}
                                <div>
                                    <label className="block text-base font-bold text-white mb-2">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-yellow-400/50 flex-shrink-0">
                                            {(profilePreview || student.profile_picture_url) ? (
                                                <img src={profilePreview || student.profile_picture_url} alt={student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                    <PhotoIcon className="w-10 h-10 text-brand-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                onChange={handleProfilePictureChange}
                                                className="hidden"
                                                id="profile_picture"
                                            />
                                            <label
                                                htmlFor="profile_picture"
                                                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                            >
                                                {student.profile_picture_url || profilePreview ? 'Change' : 'Upload'}
                                            </label>
                                            {(profilePreview || data.profile_picture) && (
                                                <button type="button" onClick={removeProfilePicture} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 font-semibold text-rose-700 transition hover:bg-rose-100">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF. Max 5MB</p>
                                    <InputError message={errors.profile_picture} className="mt-2 text-red-300 font-semibold" />
                                </div>

                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 border-b border-yellow-400/40 pb-2">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label htmlFor="name" className="block text-sm font-bold text-white mb-2">Full Name *</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                placeholder="Child's full name"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div>
                                            <label htmlFor="school_id" className="block text-sm font-bold text-white mb-2">School *</label>
                                            <select
                                                id="school_id"
                                                value={data.school_id}
                                                onChange={(e) => setData('school_id', e.target.value)}
                                                className="w-full"
                                                required
                                            >
                                                <option value="">Select school</option>
                                                {schools.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.school_id} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div>
                                            <label htmlFor="date_of_birth" className="block text-sm font-bold text-white mb-2">Date of Birth</label>
                                            <input
                                                id="date_of_birth"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white focus:border-yellow-400"
                                            />
                                            <InputError message={errors.date_of_birth} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div>
                                            <label htmlFor="grade" className="block text-sm font-bold text-white mb-2">Grade</label>
                                            <input
                                                id="grade"
                                                type="text"
                                                value={data.grade}
                                                onChange={(e) => setData('grade', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                placeholder="e.g. 10"
                                            />
                                            <InputError message={errors.grade} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="home_address" className="block text-sm font-bold text-white mb-2">Home Address</label>
                                            <input
                                                id="home_address"
                                                type="text"
                                                value={data.home_address}
                                                onChange={(e) => setData('home_address', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                placeholder="Full address"
                                            />
                                            <InputError message={errors.home_address} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contacts */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 border-b border-yellow-400/40 pb-2">Emergency Contacts</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="emergency_contact_name" className="block text-sm font-bold text-white mb-2">Primary Contact Name *</label>
                                            <input
                                                id="emergency_contact_name"
                                                type="text"
                                                value={data.emergency_contact_name}
                                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                required
                                            />
                                            <InputError message={errors.emergency_contact_name} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div>
                                            <label htmlFor="emergency_phone" className="block text-sm font-bold text-white mb-2">Primary Contact Phone *</label>
                                            <input
                                                id="emergency_phone"
                                                type="tel"
                                                value={data.emergency_phone}
                                                onChange={(e) => handlePhoneChange('emergency_phone', e)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                placeholder="(123) 456-7890"
                                                maxLength="14"
                                                required
                                            />
                                            <InputError message={errors.emergency_phone} className="mt-2 text-red-300 font-semibold" />
                                        </div>
                                        <div>
                                            <label htmlFor="emergency_contact_2_name" className="block text-sm font-bold text-white mb-2">Secondary Contact Name</label>
                                            <input
                                                id="emergency_contact_2_name"
                                                type="text"
                                                value={data.emergency_contact_2_name}
                                                onChange={(e) => setData('emergency_contact_2_name', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="emergency_contact_2_phone" className="block text-sm font-bold text-white mb-2">Secondary Contact Phone</label>
                                            <input
                                                id="emergency_contact_2_phone"
                                                type="tel"
                                                value={data.emergency_contact_2_phone}
                                                onChange={(e) => handlePhoneChange('emergency_contact_2_phone', e)}
                                                className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400"
                                                placeholder="(123) 456-7890"
                                                maxLength="14"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Authorized Pickup Persons */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white border-b border-yellow-400/40 pb-2">Authorized Pickup Persons</h3>
                                        <button type="button" onClick={addAuthorizedPickupPerson} className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                                            <PlusIcon className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {(data.authorized_pickup_persons || []).map((person, index) => (
                                            <div key={index} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row">
                                                <input
                                                    type="text"
                                                    value={person.name}
                                                    onChange={(e) => handleAuthorizedPickupChange(index, 'name', e.target.value)}
                                                    placeholder="Name"
                                                    className="flex-1 px-4 py-2 bg-white/10 border-2 border-yellow-400/50 rounded-lg text-white placeholder-white/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={person.relationship}
                                                    onChange={(e) => handleAuthorizedPickupChange(index, 'relationship', e.target.value)}
                                                    placeholder="Relationship"
                                                    className="flex-1 px-4 py-2 bg-white/10 border-2 border-yellow-400/50 rounded-lg text-white placeholder-white/50"
                                                />
                                                <input
                                                    type="tel"
                                                    value={person.phone}
                                                    onChange={(e) => handleAuthorizedPickupChange(index, 'phone', formatPhoneNumber(e.target.value))}
                                                    placeholder="Phone"
                                                    className="flex-1 px-4 py-2 bg-white/10 border-2 border-yellow-400/50 rounded-lg text-white placeholder-white/50"
                                                />
                                                <button type="button" onClick={() => removeAuthorizedPickupPerson(index)} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical & Special */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 border-b border-yellow-400/40 pb-2">Medical & Additional Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="doctor_name" className="block text-sm font-bold text-white mb-2">Doctor Name</label>
                                            <input id="doctor_name" type="text" value={data.doctor_name} onChange={(e) => setData('doctor_name', e.target.value)} className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400" />
                                        </div>
                                        <div>
                                            <label htmlFor="doctor_phone" className="block text-sm font-bold text-white mb-2">Doctor Phone</label>
                                            <input id="doctor_phone" type="tel" value={data.doctor_phone} onChange={(e) => handlePhoneChange('doctor_phone', e)} className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400" maxLength="14" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="medical_notes" className="block text-sm font-bold text-white mb-2">Medical Notes</label>
                                            <textarea id="medical_notes" value={data.medical_notes} onChange={(e) => setData('medical_notes', e.target.value)} rows={3} className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400 resize-none" placeholder="Allergies, medications, etc." />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="special_instructions" className="block text-sm font-bold text-white mb-2">Special Instructions</label>
                                            <textarea id="special_instructions" value={data.special_instructions} onChange={(e) => setData('special_instructions', e.target.value)} rows={3} className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-400/50 rounded-xl text-white placeholder-white/50 focus:border-yellow-400 resize-none" placeholder="Any special instructions for transport" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-yellow-400/40">
                                    <Link href={route('parent.students.index')} className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                                        Cancel
                                    </Link>
                                    <GlassButton type="submit" disabled={processing} className="px-8 py-3">
                                        {processing ? 'Updating...' : 'Save Changes'}
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
