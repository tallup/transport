import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import GlassCard from '@/Components/GlassCard';

export default function Register() {
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
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Create Parent Account" />

            <div className="animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-xl animate-slide-up">
                        Create Parent Account
                    </h1>
                    <p className="text-blue-100/80 text-base font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Register to manage your child's school transportation
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <label htmlFor="name" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2 text-rose-400 font-semibold" />
                    </div>

                    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <label htmlFor="email" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner"
                            placeholder="your.email@example.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-rose-400 font-semibold" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <label htmlFor="password" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner"
                                placeholder="Create a secure password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-rose-400 font-semibold" />
                        </div>

                        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <label htmlFor="password_confirmation" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-rose-400 font-semibold" />
                        </div>
                    </div>

                    <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-black uppercase tracking-widest rounded-xl shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_15px_30px_-12px_rgba(59,130,246,0.6)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                        <p className="text-blue-100/60 font-medium">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="text-blue-400 hover:text-blue-300 font-bold underline decoration-2 underline-offset-4 transition"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-6 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
                        <p className="text-xs text-blue-100/40 font-medium leading-relaxed max-w-xs mx-auto">
                            By registering, you agree to our{' '}
                            <Link href="/terms-and-conditions" className="text-white/60 hover:text-white underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/privacy-policy" className="text-white/60 hover:text-white underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
