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
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Create({ canAddAdmins = false }) {
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
                        className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-700 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Users
                    </Link>

                    <GlassCard className="overflow-hidden p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
                                <UserIcon className="h-8 w-8 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">Create User</h1>
                                <p className="mt-1 font-medium text-slate-500">
                                    {canAddAdmins ? 'Add a new user (parent, driver, or admin)' : 'Add a new parent or driver'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full py-3 pl-12 pr-4 ${errors.name ? '!border-rose-400 focus:!border-rose-400 focus:!ring-rose-100' : ''}`}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1 text-red-300" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full py-3 pl-12 pr-4 ${errors.email ? '!border-rose-400 focus:!border-rose-400 focus:!ring-rose-100' : ''}`}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1 text-red-300" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                        Password * <span className="text-xs font-normal text-slate-500">(min 8 characters)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={`w-full py-3 pl-12 pr-12 ${errors.password ? '!border-rose-400 focus:!border-rose-400 focus:!ring-rose-100' : ''}`}
                                            placeholder="Create a secure password"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-700"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-red-300" />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                                        Role *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'parent')}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                data.role === 'parent'
                                                    ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                data.role === 'parent'
                                                    ? 'bg-brand-primary/10'
                                                    : 'bg-slate-100'
                                            }`}>
                                                <UserGroupIcon className={`h-6 w-6 ${data.role === 'parent' ? 'text-brand-primary' : 'text-slate-500'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold ${data.role === 'parent' ? 'text-slate-900' : 'text-slate-700'}`}>Parent</p>
                                                <p className="text-xs text-slate-500">Manage students and bookings</p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('role', 'driver')}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                data.role === 'driver'
                                                    ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                data.role === 'driver'
                                                    ? 'bg-brand-primary/10'
                                                    : 'bg-slate-100'
                                            }`}>
                                                <TruckIcon className={`h-6 w-6 ${data.role === 'driver' ? 'text-brand-primary' : 'text-slate-500'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold ${data.role === 'driver' ? 'text-slate-900' : 'text-slate-700'}`}>Driver</p>
                                                <p className="text-xs text-slate-500">Operate routes and pickups</p>
                                            </div>
                                        </button>
                                        {canAddAdmins && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('role', 'transport_admin')}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                        data.role === 'transport_admin'
                                                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        data.role === 'transport_admin'
                                                            ? 'bg-brand-primary/10'
                                                            : 'bg-slate-100'
                                                    }`}>
                                                        <ShieldCheckIcon className={`h-6 w-6 ${data.role === 'transport_admin' ? 'text-brand-primary' : 'text-slate-500'}`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`font-bold ${data.role === 'transport_admin' ? 'text-slate-900' : 'text-slate-700'}`}>Transport Admin</p>
                                                        <p className="text-xs text-slate-500">Full admin access</p>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('role', 'admin')}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                                        data.role === 'admin'
                                                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                        data.role === 'admin'
                                                            ? 'bg-brand-primary/10'
                                                            : 'bg-slate-100'
                                                    }`}>
                                                        <ShieldCheckIcon className={`h-6 w-6 ${data.role === 'admin' ? 'text-brand-primary' : 'text-slate-500'}`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`font-bold ${data.role === 'admin' ? 'text-slate-900' : 'text-slate-700'}`}>Admin</p>
                                                        <p className="text-xs text-slate-500">Admin access</p>
                                                    </div>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <InputError message={errors.role} className="mt-2 text-red-300" />
                                </div>

                                {/* Profile Picture (optional) */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Profile Picture (optional)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            {data.profile_picture ? (
                                                <img
                                                    src={URL.createObjectURL(data.profile_picture)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <PhotoIcon className="h-8 w-8 text-amber-500" />
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
                                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white"
                                            />
                                            <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF. Max 10MB</p>
                                        </div>
                                    </div>
                                    <InputError message={errors.profile_picture} className="mt-1 text-red-300" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse justify-end gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                                <Link
                                    href="/admin/users"
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
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
