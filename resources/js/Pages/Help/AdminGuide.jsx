import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';

export default function AdminGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: 'Dashboard and daily overview',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Start from <strong>Dashboard</strong> for operational snapshots: recent activity, bookings context, and shortcuts into the
                        areas you use most.
                    </p>
                    <GuideScreenshot path="admin/01-dashboard.png" caption="Admin dashboard" />
                </>
            ),
        },
        {
            title: 'Bookings (approve, adjust, refund)',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Under <strong>Bookings</strong> review new requests, approve or decline, and handle refunds or adjustments according to your
                        process. Open a booking for full detail and history.
                    </p>
                    <GuideScreenshot path="admin/02-bookings.png" caption="Bookings" />
                </>
            ),
        },
        {
            title: 'Students and schools',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        <strong>Students</strong> lists enrolled children with links to detail and documents (for example PDFs) where configured.{' '}
                        <strong>Schools</strong> and <strong>Users</strong> support master data for routes and access.
                    </p>
                    <GuideScreenshot path="admin/03-students.png" caption="Students" />
                </>
            ),
        },
        {
            title: 'Routes, vehicles, and capacity',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Maintain <strong>Routes</strong> and <strong>Vehicles</strong> so drivers and parents see accurate schedules and assignments.
                        Align route geometry and stops with operational reality before peak booking periods.
                    </p>
                    <GuideScreenshot path="admin/04-routes-vehicles.png" caption="Routes and vehicles" />
                </>
            ),
        },
        {
            title: 'Pricing and discounts',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Use <strong>Pricing Rules</strong>, <strong>Discounts</strong>, and <strong>Manage Pricing</strong> to control how parent-facing
                        prices are calculated. Changes here affect new quotes and renewals—coordinate with finance before wide updates.
                    </p>
                    <GuideScreenshot path="admin/05-pricing.png" caption="Pricing" />
                </>
            ),
        },
        {
            title: 'Finance, analytics, calendar, absences',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        <strong>Finance</strong> and <strong>Analytics</strong> support reporting and trends. <strong>Calendar Events</strong> helps
                        communicate holidays or service changes. <strong>Absences</strong> aligns parent-submitted absences with operations and
                        drivers.
                    </p>
                    <GuideScreenshot path="admin/06-finance-analytics.png" caption="Finance and analytics" />
                </>
            ),
        },
    ];

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <AdminLayout>
            <Head title="Admin user guide" />

            <div className="py-10">
                <div className="container max-w-4xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Admin user guide</h1>
                        <p className="mt-2 text-sm text-slate-600 md:text-base">
                            Internal overview of the admin console. Add screenshots under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/admin/</code>.
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

                    <p className="text-center text-xs text-slate-500">
                        Public help:{' '}
                        <Link href="/faq" className="font-medium text-brand-primary hover:underline">
                            FAQ
                        </Link>
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
