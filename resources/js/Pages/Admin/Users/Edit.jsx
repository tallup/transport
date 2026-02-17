import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function Edit({ user }) {
    const { auth } = usePage().props;
    const [profilePreview, setProfilePreview] = useState(null);
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
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit User</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-base font-bold text-white mb-2">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/50 flex-shrink-0">
                                            {(profilePreview || user.profile_picture_url) ? (
                                                <img
                                                    src={profilePreview || user.profile_picture_url}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                    <PhotoIcon className="w-8 h-8 text-brand-primary" />
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
                                                className="px-4 py-2 bg-white/20 border-2 border-yellow-400/70 rounded-lg text-white font-semibold cursor-pointer hover:bg-white/30 transition"
                                            >
                                                {user.profile_picture_url || profilePreview ? 'Change' : 'Upload'}
                                            </label>
                                            {(profilePreview || data.profile_picture) && (
                                                <button
                                                    type="button"
                                                    onClick={removeProfilePicture}
                                                    className="px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 font-semibold hover:bg-red-500/30"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/60 mt-1">JPEG, PNG, GIF. Max 10MB</p>
                                    <InputError message={errors.profile_picture} className="mt-2 text-red-300 font-semibold" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Name *
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
                                        <label htmlFor="email" className="block text-base font-bold text-white mb-2">
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-base font-bold text-white mb-2">
                                            Password (leave blank to keep current)
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            minLength={8}
                                        />
                                        <InputError message={errors.password} className="mt-2 text-red-300 font-semibold" />
                                        <p className="mt-1 text-sm font-semibold text-white/80">Leave blank to keep current password</p>
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block text-base font-bold text-white mb-2">
                                            Role *
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="parent" className="bg-indigo-700">Parent</option>
                                            <option value="driver" className="bg-indigo-700">Driver</option>
                                        </select>
                                        <InputError message={errors.role} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/users"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
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
