import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';
import GuideSteps, { parseGuideBold } from '@/Components/GuideSteps';

export default function AdminGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: '1. Dashboard',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Dashboard** for the operational snapshot: KPIs, recent bookings, and quick context.',
                            'Scan alerts or lists your team surfaced (for example pending items) before diving into detail screens.',
                            'Use this page as the start of each shift to decide whether to open **Bookings**, **Absences**, or **Routes** next.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/01-dashboard.png" caption="Admin dashboard" />
                </>
            ),
        },
        {
            title: '2. Bookings',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Go to **Bookings** and filter by status, date, or parent as your workflow requires.',
                            'Open a booking to review line items, payment state, and history.',
                            'Approve, decline, or adjust according to policy; record refunds or credits where the UI allows.',
                            'Communicate with parents via your standard channel if the booking needs clarification.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/02-bookings.png" caption="Bookings" />
                </>
            ),
        },
        {
            title: '3. Absences',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Absences** to see parent-submitted absences and their dates.',
                            'Match each record to the student and route; mark handled or acknowledged per your process.',
                            'Ensure drivers see updated expectations—coordinate with **Routes** or dispatch if schedules change.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/03-absences.png" caption="Absences" />
                </>
            ),
        },
        {
            title: '4. Routes',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Use **Routes** to create and edit route definitions, stops, and assignments.',
                            'Confirm vehicles and drivers line up with real-world coverage before parents book against a route.',
                            'After major edits, spot-check **Bookings** and driver rosters for conflicts.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/04-routes.png" caption="Routes" />
                </>
            ),
        },
        {
            title: '5. Vehicles',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Vehicles** to maintain capacity, plate, and availability metadata.',
                            'Link vehicles to routes where your model requires it.',
                            'Deactivate or retire vehicles you no longer operate so they cannot be assigned by mistake.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/05-vehicles.png" caption="Vehicles" />
                </>
            ),
        },
        {
            title: '6. Finance',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Use **Finance** for revenue, payouts, or reconciliation views your team configured.',
                            'Filter by period and export if CSV or reports are available.',
                            'Align numbers with your accounting system; escalate discrepancies following internal controls.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/06-finance.png" caption="Finance" />
                </>
            ),
        },
        {
            title: '7. Analytics',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Analytics** for trends: utilization, bookings, or other charts your deployment exposes.',
                            'Change date ranges to compare terms or seasons.',
                            'Use insights to plan capacity, pricing experiments, or driver coverage—document decisions for stakeholders.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/07-analytics.png" caption="Analytics" />
                </>
            ),
        },
        {
            title: '8. Calendar events',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Go to **Calendar Events** for holidays, no-service days, or special schedules.',
                            'Add or edit events before parents book dates that conflict with closures.',
                            'Communicate major calendar changes through your usual parent channels.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/08-calendar-events.png" caption="Calendar events" />
                </>
            ),
        },
        {
            title: '9. Users',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Use **Users** to manage staff and parent accounts, roles, and access.',
                            'Create or deactivate users following least-privilege principles.',
                            'Reset access or email issues according to your security policy.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/09-users.png" caption="Users" />
                </>
            ),
        },
        {
            title: '10. Students',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Students** for the master list of enrolled children.',
                            'Drill into a student for detail, documents (for example PDFs), and linkage to bookings.',
                            'Keep data aligned with **Schools** and **Routes** when corrections are needed.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/10-students.png" caption="Students" />
                </>
            ),
        },
        {
            title: '11. Schools',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Maintain **Schools** as the canonical list of institutions you serve.',
                            'Update contacts, bell times, or address data when schools notify you.',
                            'Ensure routes and enrollments reference the correct school record.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/11-schools.png" caption="Schools" />
                </>
            ),
        },
        {
            title: '12. Pricing rules, discounts, and manage pricing',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Under **Pricing Rules**, define how base prices are calculated from distance, plan, or other inputs.',
                            'Use **Discounts** for codes or campaigns; test in staging or a sandbox booking when possible.',
                            'Open **Manage Pricing** for bulk or matrix updates—coordinate with finance before wide changes.',
                            'After edits, verify a sample parent quote in **Book Transport** (test account) before announcing changes.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="admin/12-pricing.png" caption="Pricing and discounts" />
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
                <div className="container max-w-7xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Admin user guide</h1>
                        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                            Step-by-step instructions for each admin module. Add screenshots under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/admin/</code>.
                        </p>
                    </div>

                    <GlassCard className="p-6 md:p-10">
                        <h2 className="text-lg font-semibold text-slate-900">Modules</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Matches the admin sidebar: Operations (Dashboard, Bookings, Absences, Routes, Vehicles), Monitoring (Finance, Analytics,
                            Calendar Events), People &amp; Setup (Users, Students, Schools, pricing tools), plus Help.
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
        </AdminLayout>
    );
}
