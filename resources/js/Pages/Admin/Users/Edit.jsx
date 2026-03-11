import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { PhotoIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Edit({ user, canAddAdmins = false }) {
    const { auth } = usePage().props;
    const [profilePreview, setProfilePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'parent',
        profile_picture: null,
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, data.profile_picture ? { forceFormData: true } : {});
    };

    return (
        <AdminLayout>
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="mb-6 text-3xl font-extrabold text-slate-900">Edit User</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-base font-semibold text-slate-700">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                            {(profilePreview || user.profile_picture_url) ? (
                                                <img
                                                    src={profilePreview || user.profile_picture_url}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                    <PhotoIcon className="h-8 w-8 text-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
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
                                                {user.profile_picture_url || profilePreview ? 'Change' : 'Upload'}
                                            </label>
                                            {(profilePreview || data.profile_picture) && (
                                                <button
                                                    type="button"
                                                    onClick={removeProfilePicture}
                                                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 font-semibold text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF. Max 10MB</p>
                                    <InputError message={errors.profile_picture} className="mt-2 text-red-300 font-semibold" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-base font-semibold text-slate-700">
                                            Name *
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
                                        <label htmlFor="email" className="mb-2 block text-base font-semibold text-slate-700">
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-2 block text-base font-semibold text-slate-700">
                                            Password (leave blank to keep current)
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="form-control pr-12"
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-700"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-2 text-red-300 font-semibold" />
                                        <p className="mt-1 text-sm font-medium text-slate-500">Leave blank to keep current password</p>
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="mb-2 block text-base font-semibold text-slate-700">
                                            Role *
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="form-control"
                                            required
                                        >
                                            <option value="parent">Parent</option>
                                            <option value="driver">Driver</option>
                                            {(canAddAdmins || ['transport_admin', 'admin'].includes(user.role)) && (
                                                <>
                                                    <option value="transport_admin">Transport Admin</option>
                                                    <option value="admin">Admin</option>
                                                </>
                                            )}
                                        </select>
                                        <InputError message={errors.role} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/users"
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
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
