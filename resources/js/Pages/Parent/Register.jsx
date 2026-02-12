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
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }
            
            setProfilePicture(file);
            setData('profile_picture', file);
            
            // Create preview
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
            onSuccess: () => {
                // Force a hard reload to ensure CSRF token and session are perfectly synced
                // This prevents 419 Page Expired errors on the first action after registration
                window.location.reload();
            },
        });
    };

    // Password strength indicator
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
            { label: 'Strong', color: 'bg-green-500' },
        ];
        
        return { strength, ...levels[strength] || levels[0] };
    };

    const passwordStrength = getPasswordStrength(data.password);
    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;

    return (
        <GuestLayout>
            <Head title="Parent Registration" />

            <GlassCard className="p-8">
                {/* Header Section */}
                <div className="mb-8 text-center space-y-4">
                    <h2 className="text-3xl font-extrabold text-brand-primary">
                        Create Parent Account
                    </h2>
                    <p className="text-sm font-semibold text-brand-primary/80 max-w-md mx-auto">
                        Join our transportation system to manage your child's school commute with ease
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="space-y-3">
                    <InputLabel value="Profile Picture" className="text-brand-primary font-semibold text-center" />
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 bg-white/10 flex items-center justify-center group cursor-pointer hover:border-yellow-400/50 transition-all duration-300">
                                {profilePicturePreview ? (
                                    <img 
                                        src={profilePicturePreview} 
                                        alt="Profile preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <CameraIcon className="w-10 h-10 text-brand-primary/70 group-hover:text-yellow-400 transition-colors" />
                                        <span className="text-xs text-brand-primary/70 mt-1">Add Photo</span>
                                    </div>
                                )}
                            </div>
                            
                            {profilePicturePreview && (
                                <button
                                    type="button"
                                    onClick={removeProfilePicture}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
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
                                className="absolute inset-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-center text-brand-primary/60">
                        Click to upload (Max 5MB, JPG/PNG)
                    </p>
                    <InputError message={errors.profile_picture} className="text-center" />
                </div>
                {/* Full Name Field */}
                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="Full Name" className="text-brand-primary dark:text-gray-200 font-semibold" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {data.name ? (
                                <UserIconSolid className="h-5 w-5 text-brand-primary dark:text-brand-primary transition-colors" />
                            ) : (
                                <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary dark:group-focus-within:text-brand-primary transition-colors" />
                            )}
                        </div>
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                            className={`glass-input pl-12 pr-4 py-3 w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-brand-primary focus:ring-brand-primary'
                            }`}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Enter your full name"
                    />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email Address" className="text-brand-primary dark:text-gray-200 font-semibold" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {data.email ? (
                                <EnvelopeIconSolid className="h-5 w-5 text-brand-primary dark:text-brand-primary transition-colors" />
                            ) : (
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary dark:group-focus-within:text-brand-primary transition-colors" />
                            )}
                        </div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                            className={`glass-input pl-12 pr-4 py-3 w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-brand-primary focus:ring-brand-primary'
                            }`}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="your.email@example.com"
                    />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Password" className="text-brand-primary dark:text-gray-200 font-semibold" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {data.password ? (
                                <LockClosedIconSolid className="h-5 w-5 text-brand-primary dark:text-brand-primary transition-colors" />
                            ) : (
                                <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary dark:group-focus-within:text-brand-primary transition-colors" />
                            )}
                        </div>
                    <TextInput
                        id="password"
                            type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                            className={`glass-input pl-12 pr-12 py-3 w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-brand-primary focus:ring-brand-primary'
                            }`}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Create a secure password"
                    />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {data.password && (
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-xs font-medium whitespace-nowrap ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        </div>
                    )}
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-brand-primary dark:text-gray-200 font-semibold"
                    />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {data.password_confirmation ? (
                                <LockClosedIconSolid className="h-5 w-5 text-brand-primary dark:text-brand-primary transition-colors" />
                            ) : (
                                <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-primary dark:group-focus-within:text-brand-primary transition-colors" />
                            )}
                        </div>
                    <TextInput
                        id="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                            className={`glass-input pl-12 pr-12 py-3 w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                errors.password_confirmation ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-brand-primary focus:ring-brand-primary'
                            }`}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                        placeholder="Confirm your password"
                    />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                        >
                            {showPasswordConfirmation ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                        {passwordsMatch && (
                            <div className="absolute inset-y-0 right-12 pr-4 flex items-center pointer-events-none">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {data.password_confirmation && passwordsMatch && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircleIcon className="h-4 w-4" />
                            Passwords match
                        </p>
                    )}
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <PrimaryButton
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Create Account
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </PrimaryButton>
                </div>

                {/* Login Link */}
                <div className="text-center pt-2">
                    <p className="text-sm text-brand-primary/80 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-brand-primary dark:text-brand-primary hover:text-brand-secondary dark:hover:text-brand-secondary transition-colors underline-offset-2 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Terms and Privacy */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-brand-primary/70 dark:text-gray-400 text-center leading-relaxed">
                        By registering, you agree to our{' '}
                        <Link href="/terms" className="text-brand-primary dark:text-brand-primary hover:text-brand-secondary dark:hover:text-brand-secondary hover:underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-brand-primary dark:text-brand-primary hover:text-brand-secondary dark:hover:text-brand-secondary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
                </form>
            </GlassCard>
        </GuestLayout>
    );
}

