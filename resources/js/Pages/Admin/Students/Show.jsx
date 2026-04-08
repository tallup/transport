import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PolicyDisplay from '@/Components/PolicyDisplay';
import StatusBadge from '@/Components/StatusBadge';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';

const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: 'Contacts & address' },
    { id: 'medical', label: 'Medical' },
    { id: 'policies', label: 'Policies & signatures' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'absences', label: 'Absences' },
];

function formatDate(value) {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString();
}

function Field({ label, children }) {
    return (
        <div className="border-b border-slate-100 py-3 last:border-0 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-semibold text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{children ?? '—'}</dd>
        </div>
    );
}

function SignatureBlock({ title, signedAt, signature }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            {signedAt ? (
                <>
                    <p className="mt-1 text-xs text-slate-500">Signed {formatDateTime(signedAt)}</p>
                    {signature ? (
                        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <img src={signature} alt={`${title} signature`} className="max-h-28 max-w-full object-contain" />
                        </div>
                    ) : null}
                </>
            ) : (
                <p className="mt-2 text-sm text-slate-500">Not signed</p>
            )}
        </div>
    );
}

export default function Show({ student, policies = {} }) {
    const [tab, setTab] = useState('overview');

    const parentPhones = useMemo(() => {
        const nums = student.parent?.phone_numbers;
        return Array.isArray(nums) && nums.length ? nums.join(', ') : null;
    }, [student.parent]);

    const pickupPersons = student.authorized_pickup_persons || [];
    const bookings = student.bookings || [];
    const absences = [...(student.absences || [])].sort((a, b) => {
        const da = a.absence_date ? new Date(a.absence_date).getTime() : 0;
        const db = b.absence_date ? new Date(b.absence_date).getTime() : 0;
        return db - da;
    });

    return (
        <AdminLayout>
            <Head title={`${student.name} — Student`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link
                                href="/admin/students"
                                className="mb-2 inline-block text-sm font-semibold text-brand-primary hover:underline"
                            >
                                ← Students
                            </Link>
                            <h1 className="text-4xl font-extrabold text-text-primary">{student.name}</h1>
                            <p className="mt-1 text-lg font-medium text-text-secondary">Student details</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`/admin/students/${student.id}/pdf`}
                                className="inline-flex items-center rounded-xl border border-amber-600 bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                            >
                                Download PDF
                            </a>
                            <Link
                                href={`/admin/students/${student.id}/edit`}
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Edit
                            </Link>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                                    tab === t.id
                                        ? 'bg-white text-brand-primary shadow-sm ring-1 ring-slate-200 ring-b-0'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === 'overview' && (
                        <GlassCard className="overflow-hidden p-6">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                <div className="flex-shrink-0">
                                    {student.profile_picture_url ? (
                                        <img
                                            src={student.profile_picture_url}
                                            alt={student.name}
                                            className="h-28 w-28 rounded-2xl border-2 border-yellow-400/50 object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md">
                                            <PhotoIcon className="h-14 w-14 text-brand-primary" />
                                        </div>
                                    )}
                                </div>
                                <dl className="min-w-0 flex-1 divide-y divide-slate-100">
                                    <Field label="Name">{student.name}</Field>
                                    <Field label="Date of birth">{formatDate(student.date_of_birth)}</Field>
                                    <Field label="Grade">{student.grade}</Field>
                                    <Field label="School">{student.school?.name ?? '—'}</Field>
                                    <Field label="Route">{student.route?.name ?? '—'}</Field>
                                    <Field label="Pickup point">
                                        {(() => {
                                            const pp = student.pickup_point ?? student.pickupPoint;
                                            if (!pp) return '—';
                                            return pp.name || pp.address || '—';
                                        })()}
                                    </Field>
                                    <Field label="Parent">{student.parent?.name ?? '—'}</Field>
                                    <Field label="Parent email">{student.parent?.email}</Field>
                                    {parentPhones && <Field label="Parent phone(s)">{parentPhones}</Field>}
                                </dl>
                            </div>
                        </GlassCard>
                    )}

                    {tab === 'contacts' && (
                        <GlassCard className="p-6">
                            <h3 className="mb-4 text-lg font-bold text-slate-900">Home & emergency</h3>
                            <dl className="divide-y divide-slate-100">
                                <Field label="Home address">
                                    {student.home_address ? (
                                        <span className="whitespace-pre-line">{student.home_address}</span>
                                    ) : null}
                                </Field>
                                <Field label="Emergency contact">{student.emergency_contact_name}</Field>
                                <Field label="Emergency phone">{student.emergency_phone}</Field>
                                <Field label="Emergency contact 2">{student.emergency_contact_2_name}</Field>
                                <Field label="Relationship">{student.emergency_contact_2_relationship}</Field>
                                <Field label="Emergency phone 2">{student.emergency_contact_2_phone}</Field>
                            </dl>

                            {pickupPersons.length > 0 && (
                                <>
                                    <h3 className="mb-3 mt-8 text-lg font-bold text-slate-900">Authorized pickup</h3>
                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Name</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Relationship</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {pickupPersons.map((p, i) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-2">{p.name || '—'}</td>
                                                        <td className="px-4 py-2">{p.relationship || '—'}</td>
                                                        <td className="px-4 py-2">{p.phone || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </GlassCard>
                    )}

                    {tab === 'medical' && (
                        <GlassCard className="p-6">
                            <dl className="divide-y divide-slate-100">
                                <Field label="Doctor">{student.doctor_name}</Field>
                                <Field label="Doctor phone">{student.doctor_phone}</Field>
                                <Field label="Medical notes">
                                    {student.medical_notes ? (
                                        <span className="whitespace-pre-line">{student.medical_notes}</span>
                                    ) : null}
                                </Field>
                                <Field label="Special instructions">
                                    {student.special_instructions ? (
                                        <span className="whitespace-pre-line">{student.special_instructions}</span>
                                    ) : null}
                                </Field>
                            </dl>
                        </GlassCard>
                    )}

                    {tab === 'policies' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-3 text-lg font-bold text-slate-900">Policy documents</h3>
                                <PolicyDisplay policies={policies} showCheckbox={false} />
                            </div>
                            <div>
                                <h3 className="mb-3 text-lg font-bold text-slate-900">Signed agreements</h3>
                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                                    <SignatureBlock
                                        title="Authorization to transport"
                                        signedAt={student.authorization_to_transport_signed_at}
                                        signature={student.authorization_to_transport_signature}
                                    />
                                    <SignatureBlock
                                        title="Payment agreement"
                                        signedAt={student.payment_agreement_signed_at}
                                        signature={student.payment_agreement_signature}
                                    />
                                    <SignatureBlock
                                        title="Liability waiver"
                                        signedAt={student.liability_waiver_signed_at}
                                        signature={student.liability_waiver_signature}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'bookings' && (
                        <GlassCard className="overflow-hidden p-0">
                            {bookings.length === 0 ? (
                                <p className="p-8 text-center text-slate-500">No bookings for this student.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Route</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Start</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">End</th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-700"> </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {bookings.map((b) => (
                                                <tr key={b.id}>
                                                    <td className="px-4 py-3 font-mono text-xs">#{b.id}</td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge type="booking" status={b.status != null ? String(b.status) : ''} variant="light" />
                                                    </td>
                                                    <td className="px-4 py-3">{b.route?.name ?? '—'}</td>
                                                    <td className="px-4 py-3">{formatDate(b.start_date)}</td>
                                                    <td className="px-4 py-3">{formatDate(b.end_date)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link
                                                            href={`/admin/bookings/${b.id}`}
                                                            className="font-semibold text-brand-primary hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GlassCard>
                    )}

                    {tab === 'absences' && (
                        <GlassCard className="overflow-hidden p-0">
                            {absences.length === 0 ? (
                                <p className="p-8 text-center text-slate-500">No absences recorded.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Period</th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {absences.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="px-4 py-3">{formatDate(a.absence_date)}</td>
                                                    <td className="px-4 py-3">{a.period ?? '—'}</td>
                                                    <td className="px-4 py-3">{a.reason ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GlassCard>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
