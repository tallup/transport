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
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Students" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">My Students</h2>
                                <Link
                                    href="/parent/students/enroll"
                                    className="glass-button px-4 py-2 rounded-lg"
                                >
                                    Add Student
                                </Link>
                            </div>

                            {students && students.length > 0 ? (
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div key={student.id} className="border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <h3 className="text-xl font-bold text-white">{student.name}</h3>
                                                        {student.school && (
                                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                                {student.school.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-base font-semibold text-white/90">
                                                        {student.date_of_birth && (
                                                            <div>
                                                                <span className="font-bold text-white">Date of Birth:</span>{' '}
                                                                <span className="text-white/90">{new Date(student.date_of_birth).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                        {student.grade && (
                                                            <div>
                                                                <span className="font-bold text-white">Grade:</span>{' '}
                                                                <span className="text-white/90">{student.grade}</span>
                                                            </div>
                                                        )}
                                                        {student.emergency_contact_name && (
                                                            <div>
                                                                <span className="font-bold text-white">Emergency Contact:</span>{' '}
                                                                <span className="text-white/90">{student.emergency_contact_name}</span>
                                                                {student.emergency_phone && (
                                                                    <span className="text-white/80 ml-2">({student.emergency_phone})</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {student.home_address && (
                                                            <div className="md:col-span-2 lg:col-span-3">
                                                                <span className="font-bold text-white">Home Address:</span>{' '}
                                                                <span className="text-white/90">{student.home_address}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Pickup and Dropoff Times */}
                                                    {student.active_booking && (
                                                        <div className="mt-4 pt-4 border-t border-white/20">
                                                            <span className="font-bold text-white block mb-3">Transport Schedule:</span>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Pickup Information */}
                                                                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        <span className="font-bold text-green-200 text-sm">Pickup</span>
                                                                    </div>
                                                                    {student.active_booking.pickup_point ? (
                                                                        <>
                                                                            <p className="text-white font-semibold text-sm mb-1">{student.active_booking.pickup_point.name}</p>
                                                                            <p className="text-white/80 text-xs mb-2">{student.active_booking.pickup_point.address}</p>
                                                                            {student.active_booking.pickup_point.pickup_time && (
                                                                                <p className="text-green-200 font-bold">{formatTime(student.active_booking.pickup_point.pickup_time)}</p>
                                                                            )}
                                                                        </>
                                                                    ) : student.active_booking.pickup_address ? (
                                                                        <>
                                                                            <p className="text-white/80 text-xs mb-2">{student.active_booking.pickup_address}</p>
                                                                            {student.active_booking.route?.pickup_time && (
                                                                                <p className="text-green-200 font-bold">{formatTime(student.active_booking.route.pickup_time)}</p>
                                                                            )}
                                                                        </>
                                                                    ) : student.active_booking.route?.pickup_time ? (
                                                                        <p className="text-green-200 font-bold">{formatTime(student.active_booking.route.pickup_time)}</p>
                                                                    ) : (
                                                                        <p className="text-white/70 text-sm">Time not set</p>
                                                                    )}
                                                                </div>

                                                                {/* Dropoff Information */}
                                                                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        <span className="font-bold text-blue-200 text-sm">Dropoff</span>
                                                                    </div>
                                                                    {student.active_booking.dropoff_point ? (
                                                                        <>
                                                                            <p className="text-white font-semibold text-sm mb-1">{student.active_booking.dropoff_point.name}</p>
                                                                            <p className="text-white/80 text-xs mb-2">{student.active_booking.dropoff_point.address}</p>
                                                                            {student.active_booking.dropoff_point.dropoff_time && (
                                                                                <p className="text-blue-200 font-bold">{formatTime(student.active_booking.dropoff_point.dropoff_time)}</p>
                                                                            )}
                                                                        </>
                                                                    ) : student.active_booking.pickup_point?.dropoff_time ? (
                                                                        <>
                                                                            <p className="text-white font-semibold text-sm mb-1">{student.active_booking.pickup_point.name}</p>
                                                                            <p className="text-blue-200 font-bold">{formatTime(student.active_booking.pickup_point.dropoff_time)}</p>
                                                                        </>
                                                                    ) : student.active_booking.route?.dropoff_time ? (
                                                                        <>
                                                                            <p className="text-white font-semibold text-sm mb-1">{student.school?.name || 'School'}</p>
                                                                            <p className="text-blue-200 font-bold">{formatTime(student.active_booking.route.dropoff_time)}</p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-white/70 text-sm">Time not set</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Authorized Pickup Persons */}
                                                    {student.authorized_pickup_persons && Array.isArray(student.authorized_pickup_persons) && student.authorized_pickup_persons.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-white/20">
                                                            <span className="font-bold text-white block mb-2">Authorized Pickup Persons:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {student.authorized_pickup_persons.map((person, index) => (
                                                                    <span key={index} className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/30 text-green-100 border border-green-400/50">
                                                                        {person.name}
                                                                        {person.relationship && ` (${person.relationship})`}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Medical Notes */}
                                                    {student.medical_notes && (
                                                        <div className="mt-4 pt-4 border-t border-white/20">
                                                            <span className="font-bold text-white block mb-1">Medical Notes:</span>
                                                            <p className="text-white/90 text-sm font-semibold">{student.medical_notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-2 ml-4">
                                                    <Link
                                                        href={`/parent/bookings/create?student_id=${student.id}`}
                                                        className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-md text-white font-bold hover:bg-blue-500/50 transition text-sm"
                                                    >
                                                        Book Transport
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-white text-lg font-semibold mb-4">No students registered yet.</p>
                                    <Link
                                        href="/parent/students/enroll"
                                        className="glass-button px-4 py-2 rounded-lg inline-block"
                                    >
                                        Enroll Your First Student
                                    </Link>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}





