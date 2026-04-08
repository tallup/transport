import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';
import GuideSteps, { parseGuideBold } from '@/Components/GuideSteps';

export default function DriverGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: '1. Dashboard (route, trip, and schedule)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Dashboard** from the sidebar (or use the mobile menu).',
                            'If your portal shows **AM Route** and **PM Route**, pick the shift you are driving. AM must often be finished before PM unlocks.',
                            'Review **Today’s schedule** and the student count for your assigned route and vehicle.',
                            'When you are ready to drive, use **Start trip** (if shown) so operations and parents see that the run has begun.',
                            'Work through pickups in stop order. Use **Mark route complete** (and any notes prompt) when the full run is finished.',
                            'If something blocks completion, follow your dispatcher’s process and leave accurate notes when the app asks for them.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/01-dashboard.png" caption="Driver dashboard" />
                </>
            ),
        },
        {
            title: '2. Daily roster (stops and pickups)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Go to **Daily Roster** for the ordered list of stops and students for the active shift.',
                            'At each stop, confirm who is boarding according to the roster.',
                            'Mark pickups or stop progress using the actions on each row or stop so the live view stays accurate.',
                            'If a student is absent or a parent messaged you, follow the absence or roster notes before moving on.',
                            'Finish the roster flow for that shift before switching AM/PM if you run both.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/02-roster.png" caption="Daily roster" />
                </>
            ),
        },
        {
            title: '3. Students (schedule view)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Students** (schedule) to see who is assigned and when.',
                            'Use this view to double-check counts and names before or during the route.',
                            'Compare with **Daily Roster** when you need the stop-by-stop order versus a flat schedule list.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/03-students-schedule.png" caption="Students schedule" />
                </>
            ),
        },
        {
            title: '4. Absences (acknowledge on the route)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'When parents submit absences, they may appear in roster or related flows for your shift.',
                            'Acknowledge or confirm each absence your process requires so the roster does not expect a pickup.',
                            'If you are unsure, contact dispatch rather than skipping a stop without recording why.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/04-absences.png" caption="Absences" />
                </>
            ),
        },
        {
            title: '5. Performance',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Performance** to review metrics for your runs (timing, completion, or other stats your team tracks).',
                            'Use filters or periods on the page, if available, to compare weeks or shifts.',
                            'Share questions about metrics with your supervisor; definitions may match internal reporting.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/05-performance.png" caption="Route performance" />
                </>
            ),
        },
        {
            title: '6. Route info',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Use **Route Info** for reference: stops, notes, hazards, or school-specific instructions your team added.',
                            'Review this before the first pickup on a new route or after route changes.',
                            'Keep the app open to this section during the day if you need quick lookup between stops.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/06-route-info.png" caption="Route information" />
                </>
            ),
        },
        {
            title: '7. Completed routes',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Completed** to see finished runs for the selected period or filter.',
                            'Confirm that yesterday’s or today’s shift appears as completed after you **Mark route complete**.',
                            'Use this history if a parent or office asks what was logged for a given day.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="driver/07-completed.png" caption="Completed routes" />
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
                <div className="container max-w-7xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Driver user guide</h1>
                        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                            Step-by-step instructions for each driver portal module. Add screenshots under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/driver/</code>.
                        </p>
                    </div>

                    <GlassCard className="p-6 md:p-10">
                        <h2 className="text-lg font-semibold text-slate-900">Modules</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Expand a section and follow the numbered steps in order. Sidebar order: Dashboard → Roster → Students → Performance → Route
                            Info → Completed, plus this guide under Help.
                        </p>
                        <div className="mt-6 space-y-2">
                            {sections.map((s, i) => (
                                <div key={s.title} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() => toggle(i)}
                                        className="group flex w-full items-start justify-between gap-4 text-left"
                                    >
                                        <h3 className="flex-1 text-base font-semibold text-slate-900 group-hover:text-brand-primary md:text-lg">
                                            {s.title}
                                        </h3>
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
                                    {openIndex === i && <div className="mt-3 space-y-3 border-l-2 border-brand-primary/20 pl-4">{s.body}</div>}
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
