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
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
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
            onSuccess: () => {
                window.location.reload();
            },
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
            { label: 'Strong', color: 'bg-green-500' },
        ];
        
        return { strength, ...levels[strength] || levels[0] };
    };

    const passwordStrength = getPasswordStrength(data.password);
    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;

    return (
        <GuestLayout>
            <Head title="Parent Registration" />

            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 mb-3 shadow-lg border-2 border-yellow-400/50">
                        <UserIconSolid className="w-8 h-8 !text-brand-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-brand-primary mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-sm font-semibold text-brand-primary/80">
                        Start managing your child's transportation needs today
                    </p>
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
                                            : 'border-brand-primary/30 bg-gradient-to-br from-white/10 to-white/5 hover:border-yellow-400/50'
                                    }`}>
                                        {profilePicturePreview ? (
                                            <img 
                                                src={profilePicturePreview} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <PhotoIcon className="w-14 h-14 text-brand-primary/60 group-hover:text-yellow-400 transition-colors" />
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
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 cursor-pointer hover:scale-110 transition-transform">
                                            <CameraIcon className="w-4 h-4 !text-brand-primary" />
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
                                    <p className="text-sm font-semibold text-brand-primary mb-1">
                                        {profilePicturePreview ? 'Profile Picture' : 'Add Profile Picture'}
                                    </p>
                                    <p className="text-xs text-brand-primary/60">
                                        {profilePicturePreview ? 'Click to change' : 'Optional • JPG, PNG up to 5MB'}
                                    </p>
                                </div>
                                <InputError message={errors.profile_picture} className="mt-2 text-center" />
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" className="text-brand-primary font-bold mb-2" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-brand-primary/60" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className={`glass-input pl-12 pr-4 py-3 w-full ${
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
                                <InputLabel htmlFor="email" value="Email Address" className="text-brand-primary font-bold mb-2" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-brand-primary/60" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={`glass-input pl-12 pr-4 py-3 w-full ${
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
                                <InputLabel htmlFor="password" value="Password" className="text-brand-primary font-bold mb-2" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-brand-primary/60" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className={`glass-input pl-12 pr-12 py-3 w-full ${
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
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-primary/60 hover:text-brand-primary transition-colors"
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
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
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-brand-primary font-bold mb-2" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-brand-primary/60" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`glass-input pl-12 pr-12 py-3 w-full ${
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
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-primary/60 hover:text-brand-primary transition-colors"
                                    >
                                        {showPasswordConfirmation ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                    {passwordsMatch && (
                                        <div className="absolute inset-y-0 right-12 pr-4 flex items-center pointer-events-none">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {data.password_confirmation && passwordsMatch && (
                                    <p className="text-xs text-green-500 font-semibold mt-1 flex items-center gap-1">
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
                                className="w-full bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary hover:bg-brand-primary/30 hover:border-brand-primary/70 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <p className="text-sm text-brand-primary/80">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-brand-primary hover:text-yellow-400 transition-colors underline underline-offset-2"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="pt-4 border-t border-brand-primary/20">
                            <p className="text-xs text-brand-primary/60 text-center leading-relaxed">
                                By registering, you agree to our{' '}
                                <Link href="/terms" className="text-brand-primary hover:text-yellow-400 hover:underline font-semibold">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-brand-primary hover:text-yellow-400 hover:underline font-semibold">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </form>
            </div>
        </GuestLayout>
    );
}
