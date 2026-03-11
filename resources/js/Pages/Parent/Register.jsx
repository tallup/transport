import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import GlassCard from '@/Components/GlassCard';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    CameraIcon,
    XMarkIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';
import {
    UserIcon as UserIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    LockClosedIcon as LockClosedIconSolid,
} from '@heroicons/react/24/solid';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        profile_picture: null,
    });

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size must be less than 10MB');
                return;
            }
            
            setProfilePicture(file);
            setData('profile_picture', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        setProfilePicture(null);
        setProfilePicturePreview(null);
        setData('profile_picture', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('parent.register'), {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        
        const levels = [
            { label: 'Very Weak', color: 'bg-red-500' },
            { label: 'Weak', color: 'bg-orange-500' },
            { label: 'Fair', color: 'bg-yellow-500' },
            { label: 'Good', color: 'bg-blue-500' },
            { label: 'Strong', color: 'bg-amber-500' },
        ];
        
        return { strength, ...levels[strength] || levels[0] };
    };

    const passwordStrength = getPasswordStrength(data.password);
    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;

    return (
        <GuestLayout>
            <Head title="Parent Registration" />

            <div className="parent-form-shell mx-auto w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 shadow-lg">
                        <UserIconSolid className="h-8 w-8 text-slate-900" />
                    </div>
                    <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
                        Create Your Account
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Start managing your child's transportation needs today
                    </p>
                </div>

                <div className="mb-6">
                    <a
                        href={route('auth.google.redirect')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </a>
                    <p className="mt-3 text-center text-sm text-slate-500">or create account with email</p>
                </div>

                <form onSubmit={submit} className="space-y-6" noValidate>
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Profile Picture */}
                            <div className="flex flex-col items-center justify-start">
                                <div className="relative group mb-4">
                                    <div className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                                        profilePicturePreview 
                                            ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' 
                                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                    }`}>
                                        {profilePicturePreview ? (
                                            <img 
                                                src={profilePicturePreview} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <PhotoIcon className="h-14 w-14 text-slate-400 transition-colors group-hover:text-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {profilePicturePreview ? (
                                        <button
                                            type="button"
                                            onClick={removeProfilePicture}
                                            className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all z-10"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-amber-400 shadow-lg transition-transform hover:scale-110">
                                            <CameraIcon className="h-4 w-4 text-slate-900" />
                                        </div>
                                    )}
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                        id="profile_picture"
                                    />
                                    
                                    <label
                                        htmlFor="profile_picture"
                                        className="absolute inset-0 cursor-pointer rounded-full"
                                    />
                                </div>
                                
                                <div className="text-center">
                                    <p className="mb-1 text-sm font-semibold text-slate-900">
                                        {profilePicturePreview ? 'Profile Picture' : 'Add Profile Picture'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {profilePicturePreview ? 'Click to change' : 'Optional • JPG, PNG up to 10MB'}
                                    </p>
                                </div>
                                <InputError message={errors.profile_picture} className="mt-2 text-center" />
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" className="mb-2 font-semibold text-slate-700" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className={`form-control w-full pl-12 pr-4 ${
                                            errors.name ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="mb-2 font-semibold text-slate-700" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={`form-control w-full pl-12 pr-4 ${
                                            errors.email ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" className="mb-2 font-semibold text-slate-700" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className={`form-control w-full pl-12 pr-12 ${
                                            errors.password ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-2 font-semibold text-slate-700" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`form-control w-full pl-12 pr-12 ${
                                            errors.password_confirmation ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                                    >
                                        {showPasswordConfirmation ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                    {passwordsMatch && (
                                        <div className="absolute inset-y-0 right-12 pr-4 flex items-center pointer-events-none">
                                            <CheckCircleIcon className="h-5 w-5 text-amber-600" />
                                        </div>
                                    )}
                                </div>
                                {data.password_confirmation && passwordsMatch && (
                                    <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Passwords match
                                    </p>
                                )}
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <PrimaryButton
                                className="w-full rounded-xl bg-brand-primary px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </PrimaryButton>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-sky-700 underline underline-offset-2 transition-colors hover:text-sky-800"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-center text-xs leading-relaxed text-slate-500">
                                By registering, you agree to our{' '}
                                <Link href="/terms" className="font-semibold text-sky-700 hover:text-sky-800 hover:underline">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="font-semibold text-sky-700 hover:text-sky-800 hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </form>
            </div>
        </GuestLayout>
    );
}
