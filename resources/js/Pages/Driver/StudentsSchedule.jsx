import { Head, Link } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function StudentsSchedule({ route, studentsList }) {
    return (
        <DriverLayout>
            <Head title="Students & Pickup Schedule" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                    Students & Pickup Schedule
                                </h1>
                                {route && (
                                    <p className="text-base sm:text-lg font-semibold text-brand-primary/70">
                                        Route: {route.name}
                                    </p>
                                )}
                            </div>
                            <Link href="/driver/dashboard">
                                <GlassButton variant="secondary">Back to Dashboard</GlassButton>
                            </Link>
                        </div>
                    </div>

                    {!route ? (
                        <GlassCard>
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Route Assigned</h3>
                                <p className="mt-2 text-base font-semibold text-white/90">
                                    No active route has been assigned to you yet. Please contact your administrator.
                                </p>
                            </div>
                        </GlassCard>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Total Students</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-teal-200 mt-2 drop-shadow">
                                                {studentsList?.length || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Pickup Points</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-200 mt-2 drop-shadow">
                                                {studentsList ? new Set(studentsList.map(s => s.pickup_point_id)).size : 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-bold text-white">Active Bookings</p>
                                            <p className="text-3xl sm:text-4xl font-extrabold text-cyan-200 mt-2 drop-shadow">
                                                {studentsList?.length || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Students List */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-extrabold text-brand-primary mb-6">Complete Student Schedule</h3>
                                
                                {studentsList && studentsList.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {studentsList.map((student, index) => (
                                            <GlassCard key={`${student.id}-${student.booking_id}`} className="p-6 hover:scale-[1.02] transition-all">
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {student.profile_picture_url ? (
                                                            <img src={student.profile_picture_url} alt={student.name} className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0 border-2 border-yellow-400/50" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-extrabold text-white truncate">{student.name}</h3>
                                                            {student.grade && (
                                                                <p className="text-sm text-white/70 font-medium">Grade {student.grade}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-500/30 text-brand-primary border border-blue-400/50 text-xs font-bold rounded-lg">
                                                        #{student.sequence_order}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div className="space-y-3 mb-4">
                                                    {student.school && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                            <p className="text-sm text-white/90 font-medium truncate">{student.school}</p>
                                                        </div>
                                                    )}
                                                    {student.pickup_point_name && (
                                                        <div className="flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-white/90 font-medium truncate">{student.pickup_point_name}</p>
                                                                {student.pickup_point_address && (
                                                                    <p className="text-xs text-white/70 font-medium truncate mt-1">{student.pickup_point_address}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                                        {student.pickup_time && (
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-white/70 font-medium">Pickup</p>
                                                                    <p className="text-sm font-bold text-green-300">{student.pickup_time}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {student.dropoff_time && (
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-white/70 font-medium">Dropoff</p>
                                                                    <p className="text-sm font-bold text-white/90">{student.dropoff_time}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {student.plan_type && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-500/30 text-brand-primary border border-purple-400/50 capitalize">
                                                                {student.plan_type.replace('_', '-')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                ) : (
                                    <GlassCard className="p-12">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                                <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-brand-primary text-lg font-bold mb-2">No students assigned</p>
                                            <p className="text-white/70 text-sm">There are no active bookings for this route.</p>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

