import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Welcome Back" />

            <div className="animate-fade-in text-center">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-xl animate-slide-up">
                        Welcome Back
                    </h1>
                    <p className="text-blue-100/80 text-base font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Sign in to managed your transport services
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-xl text-emerald-100 text-sm font-bold animate-fade-in shadow-lg">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6 text-left">
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <label htmlFor="email" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="your.email@example.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-rose-400 font-semibold" />
                    </div>

                    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <label htmlFor="password" className="block text-sm font-bold text-blue-100 uppercase tracking-widest mb-1.5 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none backdrop-blur-sm shadow-inner pr-12"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2 text-rose-400 font-semibold" />
                    </div>

                    <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <label className="flex items-center group cursor-pointer">
                            <div className="relative">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500/50"
                                />
                            </div>
                            <span className="ms-2 text-sm font-bold text-blue-100/70 group-hover:text-white transition">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <div className="pt-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
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
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 16l4-4m0 0l-4-4m4 4H9m11 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <p className="text-blue-100/60 font-medium">
                            Don't have an account?{' '}
                            <Link
                                href={route('parent.register')}
                                className="text-blue-400 hover:text-blue-300 font-bold underline decoration-2 underline-offset-4 transition"
                            >
                                Register Now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
