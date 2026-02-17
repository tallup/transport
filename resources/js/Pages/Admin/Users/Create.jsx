import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    UserGroupIcon,
    TruckIcon,
    ArrowLeftIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'parent',
        profile_picture: null,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users', data.profile_picture ? { forceFormData: true } : {});
    };

    return (
        <AdminLayout>
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Back link */}
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-yellow-500 transition-colors mb-6"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Users
                    </Link>

                    <GlassCard className="overflow-hidden p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg border-2 border-yellow-400/50">
                                <UserIcon className="w-8 h-8 !text-brand-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-brand-primary">Create User</h1>
                                <p className="text-brand-primary/70 font-medium mt-1">
                                    Add a new parent or driver to the system
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-brand-primary mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`pl-12 pr-4 py-3 w-full !bg-white/20 !text-brand-primary !placeholder-brand-primary/60 border-2 focus:!border-yellow-400 ${errors.name ? '!border-red-500' : '!border-yellow-400/70'}`}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1 text-red-300" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-brand-primary mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`pl-12 pr-4 py-3 w-full !bg-white/20 !text-brand-primary !placeholder-brand-primary/60 border-2 focus:!border-yellow-400 ${errors.email ? '!border-red-500' : '!border-yellow-400/70'}`}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1 text-red-300" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-brand-primary mb-2">
                                        Password * <span className="text-xs font-normal text-brand-primary/60">(min 8 characters)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`pl-12 pr-12 py-3 w-full !bg-white/20 !text-brand-primary !placeholder-brand-primary/60 border-2 focus:!border-yellow-400 ${errors.password ? '!border-red-500' : '!border-yellow-400/70'}`}
                                            placeholder="Create a secure password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-red-300" />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-bold text-brand-primary mb-3">
                                        Role *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'parent')}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                data.role === 'parent'
                                                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                                                    : 'border-yellow-400/50 bg-white/5 hover:border-yellow-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                data.role === 'parent'
                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                    : 'bg-white/10'
                                            }`}>
                                                <UserGroupIcon className={`w-6 h-6 ${data.role === 'parent' ? '!text-yellow-500' : 'text-yellow-500/70'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold ${data.role === 'parent' ? 'text-brand-primary' : 'text-brand-primary/80'}`}>Parent</p>
                                                <p className="text-xs text-brand-primary/60">Manage students & bookings</p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'driver')}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                data.role === 'driver'
                                                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                                                    : 'border-yellow-400/50 bg-white/5 hover:border-yellow-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                data.role === 'driver'
                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                                                    : 'bg-white/10'
                                            }`}>
                                                <TruckIcon className={`w-6 h-6 ${data.role === 'driver' ? '!text-yellow-500' : 'text-yellow-500/70'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold ${data.role === 'driver' ? 'text-brand-primary' : 'text-brand-primary/80'}`}>Driver</p>
                                                <p className="text-xs text-brand-primary/60">Operate routes & pickups</p>
                                            </div>
                                        </button>
                                    </div>
                                    <InputError message={errors.role} className="mt-2 text-red-300" />
                                </div>

                                {/* Profile Picture (optional) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-brand-primary mb-2">
                                        Profile Picture (optional)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-white/10 border-2 border-yellow-400/50 flex items-center justify-center overflow-hidden">
                                            {data.profile_picture ? (
                                                <img
                                                    src={URL.createObjectURL(data.profile_picture)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <PhotoIcon className="w-8 h-8 text-yellow-500" />
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setData('profile_picture', file);
                                                }}
                                                className="block w-full text-sm text-brand-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400/30 file:text-brand-primary file:font-semibold"
                                            />
                                            <p className="text-xs text-brand-primary/60 mt-1">JPEG, PNG, GIF. Max 10MB</p>
                                        </div>
                                    </div>
                                    <InputError message={errors.profile_picture} className="mt-1 text-red-300" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-yellow-400/40">
                                <Link
                                    href="/admin/users"
                                    className="px-6 py-3 rounded-xl border-2 border-yellow-400/60 text-brand-primary font-bold hover:bg-white/10 hover:border-yellow-400 transition-all text-center"
                                >
                                    Cancel
                                </Link>
                                <GlassButton
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 rounded-xl text-base"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create User'
                                    )}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
