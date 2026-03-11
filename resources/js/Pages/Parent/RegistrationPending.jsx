import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function RegistrationPending() {
    return (
        <GuestLayout>
            <Head title="Registration Pending" />

            <div className="mx-auto w-full max-w-2xl text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 shadow-lg">
                    <ClockIcon className="h-10 w-10 text-slate-900" />
                </div>
                <h1 className="mb-4 text-3xl font-extrabold text-slate-900">
                    Account Created Successfully
                </h1>
                <p className="mb-6 text-lg leading-relaxed text-slate-600">
                    Your account has been created. An administrator will review your request.
                    You will receive an email when your account is approved.
                    You can try logging in after approval.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-all hover:bg-brand-secondary"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Go to Login
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
