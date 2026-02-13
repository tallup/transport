import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function RegistrationPending() {
    return (
        <GuestLayout>
            <Head title="Registration Pending" />

            <div className="w-full max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 mb-6 shadow-lg border-2 border-yellow-400/50">
                    <ClockIcon className="w-10 h-10 !text-brand-primary" />
                </div>
                <h1 className="text-3xl font-extrabold text-brand-primary mb-4">
                    Account Created Successfully
                </h1>
                <p className="text-brand-primary/90 text-lg leading-relaxed mb-6">
                    Your account has been created. An administrator will review your request.
                    You will receive an email when your account is approved.
                    You can try logging in after approval.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Go to Login
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border-2 border-white/30 text-brand-primary font-bold rounded-xl hover:bg-white/20 transition-all"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
