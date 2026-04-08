import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GuideScreenshot from '@/Components/GuideScreenshot';
import GuideSteps, { parseGuideBold } from '@/Components/GuideSteps';

export default function ParentGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const sections = [
        {
            title: '1. Dashboard',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'After sign-in, open **Dashboard** from the sidebar to see your family overview.',
                            'Review **active bookings**, upcoming pickups, and recent activity in one place.',
                            'Use shortcuts or buttons on the dashboard to jump to **Book Transport** or a student when you need to act quickly.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/01-dashboard.png" caption="Parent dashboard" />
                </>
            ),
        },
        {
            title: '2. My Students',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Go to **My Students** to see every child on your account.',
                            'Open a student to review details, school, and anything your team requires before booking.',
                            'Update information when schedules or schools change so routes and pricing stay accurate.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/02-my-students.png" caption="My Students" />
                </>
            ),
        },
        {
            title: '3. Add Student (enrollment)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Choose **Add Student** when you need to enroll a new child.',
                            'Complete each step: student info, school, and any route or eligibility questions the form asks.',
                            'Submit and wait for any required approval if your process includes it—then return to **My Students** to confirm the student appears.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/03-add-student.png" caption="Add Student / enrollment" />
                </>
            ),
        },
        {
            title: '4. Book Transport (route, plan, and payment)',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Click **Book Transport** and select the student and route or service options your account allows.',
                            'Pick dates, plan (weekly, monthly, term, etc.), and pickup/dropoff details as prompted.',
                            'Review the price breakdown, then complete **secure checkout** with your card.',
                            'After payment succeeds, you should see a confirmation and the booking under **My Bookings**.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/04-book-transport.png" caption="Book transport and checkout" />
                </>
            ),
        },
        {
            title: '5. My Bookings',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **My Bookings** for all current and past transport bookings.',
                            'Select a booking to view status, schedule, and any actions allowed (for example change or cancel, per policy).',
                            'Download or save confirmations your team provides, and contact support from **Contact** or **Messages** if something looks wrong.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/05-my-bookings.png" caption="My Bookings" />
                </>
            ),
        },
        {
            title: '6. Student Absence',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Use **Student Absence** when your child will not ride on scheduled days.',
                            'Enter the student, date range, and reason fields your form includes.',
                            'Submit as early as possible so drivers and dispatch can adjust the roster.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/06-absences.png" caption="Student absence" />
                </>
            ),
        },
        {
            title: '7. Pickup History',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Pickup History** to review completed trips and pickup records.',
                            'Filter or scroll by date if the page offers filters.',
                            'Use this view when you need to verify that a day was served or to share details with the school or support.',
                        ].map(parseGuideBold)}
                    />
                    <GuideScreenshot path="parent/07-pickup-history.png" caption="Pickup history" />
                </>
            ),
        },
        {
            title: '8. Profile and Messages',
            body: (
                <>
                    <GuideSteps
                        steps={[
                            'Open **Profile** from the sidebar user area to update your name, phone, password, and notification settings.',
                            'Use **Messages** (top bar or linked from the app) for threads with staff when messaging is enabled.',
                            'For general questions, also see the public **FAQ** link below.',
                        ].map(parseGuideBold)}
                    />
                    <p className="mt-3 text-sm text-slate-600">
                        <Link href="/faq" className="font-semibold text-brand-primary hover:underline">
                            Open FAQ
                        </Link>
                    </p>
                    <GuideScreenshot path="parent/08-profile-messages.png" caption="Profile and messages" />
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
                <div className="container max-w-7xl space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Parent user guide</h1>
                        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                            Step-by-step instructions for each parent portal module. Screenshots are optional—add files under{' '}
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">public/images/user-guides/parent/</code>.
                        </p>
                    </div>

                    <GlassCard className="p-6 md:p-10">
                        <h2 className="text-lg font-semibold text-slate-900">Modules</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Expand a section and follow the numbered steps. Sidebar order matches: Dashboard → My Students → Add Student → Book Transport →
                            My Bookings → Pickup History → Student Absence, plus Profile/Messages from the account area.
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
