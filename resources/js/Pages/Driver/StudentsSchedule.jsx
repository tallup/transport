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
                            <GlassCard>
                                <h3 className="text-2xl font-bold text-white mb-6">Complete Student Schedule</h3>
                                
                                {studentsList && studentsList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/20">
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Sequence</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Student Name</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Grade</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">School</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Point</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Address</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Pickup Time</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Dropoff Time</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Plan Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {studentsList.map((student, index) => (
                                                    <tr key={`${student.id}-${student.booking_id}`} className="hover:bg-white/5 transition">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 bg-blue-500/30 text-blue-100 border border-blue-400/50 text-sm font-bold rounded-full">
                                                                #{student.sequence_order}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-base font-bold text-white">{student.name}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-semibold text-white/90">{student.grade || 'N/A'}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-semibold text-white/90">{student.school || 'N/A'}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-semibold text-white">{student.pickup_point_name}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="text-xs font-medium text-white/80">{student.pickup_point_address || 'N/A'}</p>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span className="text-sm font-bold text-green-300">{student.pickup_time}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className="text-sm font-semibold text-white/90">{student.dropoff_time || 'N/A'}</span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-100 border border-purple-400/50 capitalize">
                                                                {student.plan_type?.replace('_', '-') || 'N/A'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="mt-4 text-lg font-semibold text-white">No students assigned</p>
                                        <p className="mt-2 text-base font-medium text-white/70">There are no active bookings for this route.</p>
                                    </div>
                                )}
                            </GlassCard>
                        </>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

