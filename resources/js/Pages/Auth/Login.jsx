import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import ApplicationLogo from '@/Components/ApplicationLogo';
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
        <div className="min-h-screen logo-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <Head title="Sign In - On-Time Transportation" />

            <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Side - Logo */}
                    <div className="hidden lg:flex flex-col items-center justify-center animate-fade-in">
                        <Link href="/" className="inline-block">
                            <ApplicationLogo className="h-32 w-auto drop-shadow-2xl mb-6" />
                        </Link>
                        <h2 className="text-2xl font-bold text-brand-primary text-center">
                            Safe & Reliable
                        </h2>
                        <p className="text-gray-600 text-center mt-2">
                            Kids Transportation
                        </p>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full max-w-md mx-auto lg:max-w-full">
                        {/* Mobile Logo */}
                        <div className="text-center mb-6 lg:hidden animate-fade-in">
                            <Link href="/" className="inline-block">
                                <ApplicationLogo className="h-16 w-auto mx-auto drop-shadow-lg" />
                            </Link>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 animate-slide-up">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-brand-primary mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Sign in to manage your transport services
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium animate-fade-in">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-primary mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 outline-none"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="your.email@example.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-1.5 text-red-600 text-sm" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-brand-primary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 outline-none pr-12"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-brand-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1.5 text-red-600 text-sm" />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center group cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700 group-hover:text-brand-primary transition-colors">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href={route('parent.register')}
                                    className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                                >
                                    Register Now
                                </Link>
                            </p>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
