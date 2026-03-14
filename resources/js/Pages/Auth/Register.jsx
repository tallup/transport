import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import GlassCard from '@/Components/GlassCard';
import { toast } from 'sonner';

const EyeIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeSlashIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onError: (errors) => {
                if (errors.email) {
                    toast.error(errors.email);
                } else if (Object.keys(errors).length > 0) {
                    toast.error('Registration failed. Please check the form for errors.');
                }
            },
            onSuccess: () => {
                toast.success('Account created successfully!');
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Parent Account" />

            <div className="animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-slide-up">
                        Create Parent Account
                    </h1>
                    <div className="h-1.5 w-20 bg-blue-500 mx-auto rounded-full mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}></div>
                    <p className="text-white text-lg font-medium opacity-90 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                        Join On-Time Transportation today
                    </p>
                </div>

                <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.18s' }}>
                    <a
                        href={route('auth.google.redirect')}
                        className="w-full py-3.5 px-6 bg-white/10 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xl"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </a>
                    <p className="text-center text-white/70 text-sm mt-3">or fill in the form below</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <label htmlFor="name" className="block text-base font-black text-white uppercase tracking-widest mb-2 ml-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 outline-none backdrop-blur-xl shadow-2xl"
                            placeholder="Type your full name..."
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2 text-rose-400 font-bold text-sm" />
                    </div>

                    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <label htmlFor="email" className="block text-base font-black text-white uppercase tracking-widest mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 outline-none backdrop-blur-xl shadow-2xl"
                            placeholder="your@email.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-rose-400 font-bold text-sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <label htmlFor="password" className="block text-base font-black text-white uppercase tracking-widest mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full px-6 py-4 pr-12 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 outline-none backdrop-blur-xl shadow-2xl"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-400 hover:text-blue-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2 text-rose-400 font-bold text-sm" />
                        </div>

                        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <label htmlFor="password_confirmation" className="block text-base font-black text-white uppercase tracking-widest mb-2 ml-1">
                                Confirm
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-6 py-4 pr-12 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 outline-none backdrop-blur-xl shadow-2xl"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-400 hover:text-blue-300 transition-colors"
                                    aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                                >
                                    {showPasswordConfirmation ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2 text-rose-400 font-bold text-sm" />
                        </div>
                    </div>

                    <div className="pt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_-15px_rgba(37,99,235,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.7)] active:scale-[0.97] transition-all duration-300 flex items-center justify-center space-x-3 group"
                        >
                            {processing ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>REGISTER NOW</span>
                                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                        <p className="text-white text-base font-bold">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="text-blue-400 hover:text-blue-300 underline decoration-4 underline-offset-8 transition-all"
                            >
                                Sign In Here
                            </Link>
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-loose">
                            Secured Registration Platform v2.0
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
