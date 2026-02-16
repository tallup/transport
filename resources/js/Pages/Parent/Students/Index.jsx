import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function StudentsIndex({ students }) {
    const { auth } = usePage().props;
    
    // Helper function to format time
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        
        try {
            let date;
            if (typeof timeString === 'string') {
                if (timeString.includes('T') || timeString.includes(' ')) {
                    date = new Date(timeString);
                } else if (timeString.includes(':') && timeString.length <= 8) {
                    date = new Date('2000-01-01T' + timeString);
                } else {
                    return timeString;
                }
            } else {
                date = new Date(timeString);
            }
            
            if (isNaN(date.getTime())) {
                return timeString;
            }
            
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            });
        } catch (e) {
            return timeString;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString();
    };
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Students" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                    My Students
                                </h1>
                                <p className="text-base sm:text-lg font-semibold text-brand-primary/70">
                                    Manage your registered students and their information
                                </p>
                            </div>
                            <Link href="/parent/students/enroll">
                                <GlassButton variant="primary" className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Student
                                </GlassButton>
                            </Link>
                        </div>
                    </div>

                    {students && students.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {students.map((student) => (
                                <GlassCard key={student.id} className="hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                                    <div className="relative">
                                        {/* Header Section with Gradient */}
                                        <div className="bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-transparent p-6 border-b border-brand-primary/20">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {student.profile_picture_url ? (
                                                            <img
                                                                src={student.profile_picture_url}
                                                                alt={student.name}
                                                                className="w-14 h-14 rounded-xl object-cover shadow-lg border-2 border-yellow-400/50"
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                                                                <svg className="w-7 h-7 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="text-2xl font-extrabold text-brand-primary">{student.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {student.school && (
                                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                                        {student.school.name}
                                                                    </span>
                                                                )}
                                                                {student.active_booking && (
                                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/50 flex items-center gap-1">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Active Booking
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="p-6 space-y-6">
                                            {/* Student Details Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Date of Birth */}
                                                {student.date_of_birth && (
                                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-yellow-400/50 hover:bg-white/10 transition">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Date of Birth</p>
                                                            <p className="text-base font-bold text-white">{new Date(student.date_of_birth).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Grade */}
                                                {student.grade && (
                                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-yellow-400/50 hover:bg-white/10 transition">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Grade</p>
                                                            <p className="text-base font-bold text-white">{student.grade}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Emergency Contact */}
                                                {student.emergency_contact_name && (
                                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-yellow-400/50 hover:bg-white/10 transition sm:col-span-2">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Emergency Contact</p>
                                                            <p className="text-base font-bold text-white">{student.emergency_contact_name}</p>
                                                            {student.emergency_phone && (
                                                                <p className="text-sm font-semibold text-white/80 mt-1">{student.emergency_phone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Home Address */}
                                                {student.home_address && (
                                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-yellow-400/50 hover:bg-white/10 transition sm:col-span-2">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Home Address</p>
                                                            <p className="text-base font-bold text-white">{student.home_address}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Active Booking Summary */}
                                            {student.active_booking && (
                                                <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-400/30">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <h4 className="text-lg font-extrabold text-emerald-100">Active Transport Booking</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-white/70 mb-1">Route</p>
                                                            <p className="text-base font-bold text-emerald-100">
                                                                {student.active_booking.route?.name || 'Not assigned'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-white/70 mb-1">Duration</p>
                                                            <p className="text-base font-bold text-emerald-100">
                                                                {formatDate(student.active_booking.start_date) || 'N/A'}
                                                                {student.active_booking.end_date
                                                                    ? ` - ${formatDate(student.active_booking.end_date)}`
                                                                    : ' - Ongoing'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Pickup and Dropoff Times */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-400/30">
                                                        {/* Pickup Information */}
                                                        <div className="bg-white/10 rounded-lg p-4 border border-yellow-400/50">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="text-xs font-bold text-green-200 uppercase tracking-wide">Pickup</span>
                                                            </div>
                                                            {student.active_booking.pickup_point ? (
                                                                <>
                                                                    <p className="text-sm font-bold text-white mb-1">{student.active_booking.pickup_point.name}</p>
                                                                    <p className="text-xs text-white/70 mb-2">{student.active_booking.pickup_point.address}</p>
                                                                    {student.active_booking.pickup_point.pickup_time && (
                                                                        <p className="text-base font-extrabold text-green-200">{formatTime(student.active_booking.pickup_point.pickup_time)}</p>
                                                                    )}
                                                                </>
                                                            ) : student.active_booking.pickup_address ? (
                                                                <>
                                                                    <p className="text-xs text-white/70 mb-2">{student.active_booking.pickup_address}</p>
                                                                    {student.active_booking.route?.pickup_time && (
                                                                        <p className="text-base font-extrabold text-green-200">{formatTime(student.active_booking.route.pickup_time)}</p>
                                                                    )}
                                                                </>
                                                            ) : student.active_booking.route?.pickup_time ? (
                                                                <p className="text-base font-extrabold text-green-200">{formatTime(student.active_booking.route.pickup_time)}</p>
                                                            ) : (
                                                                <p className="text-sm text-white/70">Time not set</p>
                                                            )}
                                                        </div>

                                                        {/* Dropoff Information */}
                                                        <div className="bg-white/10 rounded-lg p-4 border border-yellow-400/50">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-xs font-bold text-blue-200 uppercase tracking-wide">Dropoff</span>
                                                            </div>
                                                            {student.active_booking.dropoff_point ? (
                                                                <>
                                                                    <p className="text-sm font-bold text-white mb-1">{student.active_booking.dropoff_point.name}</p>
                                                                    <p className="text-xs text-white/70 mb-2">{student.active_booking.dropoff_point.address}</p>
                                                                    {student.active_booking.dropoff_point.dropoff_time && (
                                                                        <p className="text-base font-extrabold text-blue-200">{formatTime(student.active_booking.dropoff_point.dropoff_time)}</p>
                                                                    )}
                                                                </>
                                                            ) : student.active_booking.pickup_point?.dropoff_time ? (
                                                                <>
                                                                    <p className="text-sm font-bold text-white mb-1">{student.active_booking.pickup_point.name}</p>
                                                                    <p className="text-base font-extrabold text-blue-200">{formatTime(student.active_booking.pickup_point.dropoff_time)}</p>
                                                                </>
                                                            ) : student.active_booking.route?.dropoff_time ? (
                                                                <>
                                                                    <p className="text-sm font-bold text-white mb-1">{student.school?.name || 'School'}</p>
                                                                    <p className="text-base font-extrabold text-blue-200">{formatTime(student.active_booking.route.dropoff_time)}</p>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-white/70">Time not set</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Authorized Pickup Persons */}
                                            {student.authorized_pickup_persons && Array.isArray(student.authorized_pickup_persons) && student.authorized_pickup_persons.length > 0 && (
                                                <div className="pt-4 border-t border-yellow-400/40">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Authorized Pickup Persons</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {student.authorized_pickup_persons.map((person, index) => (
                                                            <span key={index} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-500/30 text-green-100 border border-green-400/50 flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {person.name}
                                                                {person.relationship && ` (${person.relationship})`}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Medical Notes */}
                                            {student.medical_notes && (
                                                <div className="pt-4 border-t border-yellow-400/40">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Medical Notes</h4>
                                                    </div>
                                                    <p className="text-sm font-semibold text-white/90 bg-white/5 rounded-lg p-3 border border-yellow-400/50">{student.medical_notes}</p>
                                                </div>
                                            )}

                                            {/* Action Button */}
                                            <div className="pt-4 border-t border-yellow-400/40">
                                                <Link
                                                    href={`/parent/bookings/create?student_id=${student.id}`}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Book Transport
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-extrabold text-brand-primary mb-3">No Students Registered</h3>
                                <p className="text-base font-semibold text-brand-primary/70 mb-6 max-w-md mx-auto">
                                    Get started by enrolling your first student. Add their information and start booking transport services.
                                </p>
                                <Link href="/parent/students/enroll">
                                    <GlassButton variant="primary" className="inline-flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Enroll Your First Student
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
