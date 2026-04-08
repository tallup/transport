import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';

export default function ParentGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: 'Account and registration',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Sign in from the home page, or complete parent registration if you are new. Use <strong>Profile</strong> to update your name,
                        contact details, and notification preferences.
                    </p>
                    <GuideScreenshot path="parent/01-account-profile.png" caption="Profile and account settings" />
                </>
            ),
        },
        {
            title: 'Add and enroll a student',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Open <strong>Add Student</strong> to register each child. You will choose the school and route details required for bookings.
                        Review student information under <strong>My Students</strong> before creating transport bookings.
                    </p>
                    <GuideScreenshot path="parent/02-students-enroll.png" caption="Student enrollment" />
                </>
            ),
        },
        {
            title: 'Create a booking and pay',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Use <strong>Book Transport</strong> to pick route, schedule, and plan. Complete checkout with the secure payment step. Your booking
                        appears under <strong>My Bookings</strong> once confirmed.
                    </p>
                    <GuideScreenshot path="parent/03-booking-checkout.png" caption="Booking and payment" />
                </>
            ),
        },
        {
            title: 'Manage bookings',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        From <strong>My Bookings</strong> you can view status, dates, and options your plan allows (such as changes or cancellation,
                        subject to policy). The <strong>Dashboard</strong> highlights active bookings and upcoming pickups.
                    </p>
                    <GuideScreenshot path="parent/04-my-bookings.png" caption="Bookings list" />
                </>
            ),
        },
        {
            title: 'Report an absence',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Use <strong>Student Absence</strong> to notify the team when your child will not ride on scheduled days. Submitting early helps
                        drivers and operations plan the roster.
                    </p>
                    <GuideScreenshot path="parent/05-absences.png" caption="Student absence" />
                </>
            ),
        },
        {
            title: 'Pickup history and messages',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        <strong>Pickup History</strong> shows completed trips. Use <strong>Messages</strong> (from the top bar when available) for
                        threads with support or staff. For general questions, see also the public{' '}
                        <Link href="/faq" className="font-semibold text-brand-primary hover:underline">
                            FAQ
                        </Link>
                        .
                    </p>
                    <GuideScreenshot path="parent/06-pickup-history.png" caption="Pickup history" />
                </>
            ),
        },
    ];

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Parent user guide" />

            <div className="py-10">
                <div className="container max-w-4xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Parent user guide</h1>
                        <p className="mt-2 text-sm text-slate-600 md:text-base">
                            Step-by-step overview of the parent portal. Screenshots are optional—add files under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/parent/</code>.
                        </p>
                    </div>

                    <GlassCard className="p-6 md:p-8">
                        <h2 className="text-lg font-semibold text-slate-900">Topics</h2>
                        <div className="mt-4 space-y-2">
                            {sections.map((s, i) => (
                                <div key={s.title} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() => toggle(i)}
                                        className="group flex w-full items-start justify-between gap-4 text-left"
                                    >
                                        <h3 className="flex-1 text-base font-semibold text-slate-900 group-hover:text-brand-primary">{s.title}</h3>
                                        <svg
                                            className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform ${
                                                openIndex === i ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openIndex === i && <div className="mt-3 space-y-3">{s.body}</div>}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
