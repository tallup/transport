import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Contact({ auth }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Contact Us - On-Time Transportation" />

            <div className="min-h-screen logo-background">
                {/* Navigation */}
                <nav className="glass-nav fixed w-full top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center group">
                                    <div className="transform group-hover:scale-110 transition-transform">
                                        <ApplicationLogo className="h-10 w-auto" />
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <Link
                                        href="/parent/dashboard"
                                        className="text-gray-800 hover:text-brand-primary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-white/50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-800 hover:text-brand-primary px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-white/50"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/parent/register"
                                            className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="pt-24 pb-12">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-6">
                            <Link
                                href="/"
                                className="text-blue-600 hover:text-blue-500 font-semibold mb-4 inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                                Contact Us
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Have a question or feedback? Send us a message and we’ll get back to you as soon as we can.
                            </p>
                        </div>

                        {flash?.success && (
                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                                {flash.success}
                            </div>
                        )}

                        <GlassCard className="p-6 md:p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Your name" className="text-slate-900 font-semibold text-sm mb-2" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-slate-900"
                                        placeholder="e.g. Jane Smith"
                                        autoComplete="name"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email address" className="text-slate-900 font-semibold text-sm mb-2" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-slate-900"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="subject" value="Subject" className="text-slate-900 font-semibold text-sm mb-2" />
                                    <TextInput
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-slate-300 text-slate-900"
                                        placeholder="e.g. Booking enquiry"
                                    />
                                    <InputError message={errors.subject} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="message" value="Message" className="text-slate-900 font-semibold text-sm mb-2" />
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary/20 text-sm"
                                        placeholder="Type your message here..."
                                    />
                                    <InputError message={errors.message} className="mt-2" />
                                </div>

                                <div className="pt-2">
                                    <GlassButton type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Sending...' : 'Send message'}
                                    </GlassButton>
                                </div>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </>
    );
}
