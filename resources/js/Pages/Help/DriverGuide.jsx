import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';

export default function DriverGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: 'Dashboard and active route',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        Open <strong>Dashboard</strong> for today&apos;s route, trip status, and actions such as <strong>Start trip</strong> or{' '}
                        <strong>Mark route complete</strong> when your run is finished. Use AM/PM toggles when your portal shows two shifts.
                    </p>
                    <GuideScreenshot path="driver/01-dashboard.png" caption="Driver dashboard" />
                </>
            ),
        },
        {
            title: 'Daily roster and pickups',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        <strong>Daily Roster</strong> lists students and stops in order. Mark pickups complete as you go so parents and operations see
                        live progress.
                    </p>
                    <GuideScreenshot path="driver/02-roster.png" caption="Daily roster" />
                </>
            ),
        },
        {
            title: 'Students and schedule',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        The <strong>Students</strong> / schedule views help you confirm who rides and when. Cross-check absences before leaving a stop.
                    </p>
                    <GuideScreenshot path="driver/03-students-schedule.png" caption="Students schedule" />
                </>
            ),
        },
        {
            title: 'Absences and acknowledgements',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        When parents report absences, acknowledge them in the flow provided so the roster stays accurate and you avoid unnecessary stops.
                    </p>
                    <GuideScreenshot path="driver/04-absences.png" caption="Absences" />
                </>
            ),
        },
        {
            title: 'Performance, route info, completed routes',
            body: (
                <>
                    <p className="text-slate-700 leading-relaxed">
                        <strong>Performance</strong> summarizes how your runs compare over time. <strong>Route Info</strong> holds reference detail for
                        the road. <strong>Completed</strong> is your history of finished routes for the selected period.
                    </p>
                    <GuideScreenshot path="driver/05-completed.png" caption="Completed routes" />
                </>
            ),
        },
    ];

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <DriverLayout>
            <Head title="Driver user guide" />

            <div className="py-10">
                <div className="container max-w-4xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Driver user guide</h1>
                        <p className="mt-2 text-sm text-slate-600 md:text-base">
                            Overview of the driver portal. Add screenshots under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/driver/</code>.
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
        </DriverLayout>
    );
}
