import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Pencil,
    Phone,
    Plus,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function StudentsIndex({ students }) {
    const { auth } = usePage().props;

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            let date;
            if (typeof timeString === 'string') {
                if (timeString.includes('T') || timeString.includes(' ')) {
                    date = new Date(timeString);
                } else if (timeString.includes(':') && timeString.length <= 8) {
                    date = new Date(`2000-01-01T${timeString}`);
                } else {
                    return timeString;
                }
            } else {
                date = new Date(timeString);
            }

            if (Number.isNaN(date.getTime())) return timeString;
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            return timeString;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Students">
                <meta
                    name="description"
                    content="Manage your registered students and their transport information."
                />
            </Head>

            <div className="py-10">
                <div className="container space-y-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                My Students
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">
                                Manage registered students and booking-related details.
                            </p>
                        </div>
                        <Link href="/parent/students/enroll">
                            <GlassButton className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Student
                            </GlassButton>
                        </Link>
                    </div>

                    {students && students.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            {students.map((student) => (
                                <GlassCard key={student.id} className="overflow-hidden p-0">
                                    <div className="border-b border-slate-200 bg-slate-50 p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                {student.profile_picture_url ? (
                                                    <img
                                                        src={student.profile_picture_url}
                                                        alt={student.name}
                                                        className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white">
                                                        <UserRound className="h-6 w-6 text-slate-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-slate-900">{student.name}</h3>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                        {student.school && (
                                                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                {student.school.name}
                                                            </span>
                                                        )}
                                                        {student.active_booking && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                                Active Booking
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5 p-5">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {student.date_of_birth && (
                                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Date of Birth</p>
                                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                                        {new Date(student.date_of_birth).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {student.grade && (
                                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Grade</p>
                                                    <p className="mt-1 text-sm font-medium text-slate-900">{student.grade}</p>
                                                </div>
                                            )}
                                            {student.emergency_contact_name && (
                                                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
                                                    <div className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        Emergency Contact
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                                        {student.emergency_contact_name}
                                                    </p>
                                                    {student.emergency_phone && (
                                                        <p className="mt-1 text-xs text-slate-600">{student.emergency_phone}</p>
                                                    )}
                                                </div>
                                            )}
                                            {student.home_address && (
                                                <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
                                                    <div className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        Home Address
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-slate-900">{student.home_address}</p>
                                                </div>
                                            )}
                                        </div>

                                        {student.active_booking && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                <h4 className="text-sm font-semibold text-amber-800">Active Transport Booking</h4>
                                                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div>
                                                        <p className="text-xs text-amber-700">Route</p>
                                                        <p className="text-sm font-medium text-amber-900">
                                                            {student.active_booking.route?.name || 'Not assigned'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-amber-700">Duration</p>
                                                        <p className="text-sm font-medium text-amber-900">
                                                            {formatDate(student.active_booking.start_date) || 'N/A'}
                                                            {student.active_booking.end_date
                                                                ? ` - ${formatDate(student.active_booking.end_date)}`
                                                                : ' - Ongoing'}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg border border-amber-200 bg-white p-3">
                                                        <p className="text-xs text-amber-700">Pickup</p>
                                                        {(student.active_booking.pickup_address || student.active_booking.pickup_point?.address) ? (
                                                            <>
                                                                <p className="text-sm font-medium text-slate-900">
                                                                    {student.active_booking.pickup_address || student.active_booking.pickup_point?.address}
                                                                </p>
                                                                {student.active_booking.pickup_point?.pickup_time && (
                                                                    <p className="mt-1 text-sm font-medium text-amber-800">
                                                                        {formatTime(student.active_booking.pickup_point.pickup_time)}
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-slate-600">Not set</p>
                                                        )}
                                                    </div>
                                                    <div className="rounded-lg border border-amber-200 bg-white p-3">
                                                        <p className="text-xs text-amber-700">Dropoff</p>
                                                        {student.active_booking.dropoff_point ? (
                                                            <>
                                                                <p className="text-sm font-medium text-slate-900">{student.active_booking.dropoff_point.name}</p>
                                                                <p className="text-xs text-slate-600">{student.active_booking.dropoff_point.address}</p>
                                                                {student.active_booking.dropoff_point.dropoff_time && (
                                                                    <p className="mt-1 text-sm font-medium text-amber-800">
                                                                        {formatTime(student.active_booking.dropoff_point.dropoff_time)}
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-slate-600">Not set</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {Array.isArray(student.authorized_pickup_persons) &&
                                            student.authorized_pickup_persons.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        Authorized Pickup Persons
                                                    </h4>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {student.authorized_pickup_persons.map((person, index) => (
                                                            <span
                                                                key={index}
                                                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                                                            >
                                                                {person.name}
                                                                {person.relationship ? ` (${person.relationship})` : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                        {student.medical_notes && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                <h4 className="text-xs font-medium uppercase tracking-wide text-amber-700">
                                                    Medical Notes
                                                </h4>
                                                <p className="mt-1 text-sm text-amber-900">{student.medical_notes}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
                                            <Link href={route('parent.students.edit', student.id)}>
                                                <GlassButton variant="secondary" className="gap-2">
                                                    <Pencil className="h-4 w-4" />
                                                    Edit Details
                                                </GlassButton>
                                            </Link>
                                            <Link href={`/parent/bookings/create?student_id=${student.id}`}>
                                                <GlassButton>Book Transport</GlassButton>
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="py-14 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                    <UserRound className="h-8 w-8 text-slate-500" />
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-slate-900">No Students Registered</h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                                    Start by enrolling your first student, then create transport bookings.
                                </p>
                                <Link href="/parent/students/enroll" className="mt-5 inline-flex">
                                    <GlassButton className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Enroll First Student
                                    </GlassButton>
                                </Link>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
