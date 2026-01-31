import { Head, Link, router } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function CompletedRoutes({ completedRoutes, pagination }) {
    return (
        <DriverLayout>
            <Head title="Completed Routes" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                    Completed Routes
                                </h1>
                                <p className="text-base sm:text-lg font-semibold text-brand-primary/70">
                                    View all your completed routes and completion details
                                </p>
                            </div>
                            <Link href="/driver/dashboard">
                                <GlassButton variant="secondary">Back to Dashboard</GlassButton>
                            </Link>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">Total Completed</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-teal-200 mt-2 drop-shadow">
                                        {pagination?.total || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">This Month</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-emerald-200 mt-2 drop-shadow">
                                        {completedRoutes?.filter(r => {
                                            const completionDate = new Date(r.completion_date);
                                            const now = new Date();
                                            return completionDate.getMonth() === now.getMonth() && 
                                                   completionDate.getFullYear() === now.getFullYear();
                                        }).length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base font-bold text-white">This Week</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-cyan-200 mt-2 drop-shadow">
                                        {completedRoutes?.filter(r => {
                                            const completionDate = new Date(r.completion_date);
                                            const now = new Date();
                                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            return completionDate >= weekAgo;
                                        }).length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Completed Routes List */}
                    {completedRoutes && completedRoutes.length > 0 ? (
                        <div className="space-y-6">
                            {completedRoutes.map((completion) => (
                                <GlassCard key={completion.id}>
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-white">
                                                        {completion.route.name}
                                                    </h3>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                        completion.period === 'am'
                                                            ? 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50'
                                                            : completion.period === 'pm'
                                                            ? 'bg-blue-500/30 text-blue-100 border border-blue-400/50'
                                                            : 'bg-green-500/30 text-green-100 border border-green-400/50'
                                                    }`}>
                                                        {completion.period?.toUpperCase() || 'AM'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm font-semibold text-white/90">
                                                            {completion.completion_date_formatted}
                                                        </span>
                                                    </div>
                                                    {completion.completed_at_formatted && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-sm font-semibold text-white/90">
                                                                Completed at {completion.completed_at_formatted}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 !text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm font-bold text-green-300">Completed</span>
                                            </div>
                                        </div>

                                        {/* Route Information Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            {completion.route.vehicle && (
                                                <div className="p-3 glass-card rounded-lg">
                                                    <p className="text-xs font-semibold text-white/70 mb-1">Vehicle</p>
                                                    <p className="text-sm font-bold text-white">
                                                        {completion.route.vehicle.make} {completion.route.vehicle.model}
                                                    </p>
                                                    <p className="text-xs font-semibold text-white/80">
                                                        {completion.route.vehicle.license_plate}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {completion.route.pickup_time && (
                                                <div className="p-3 glass-card rounded-lg">
                                                    <p className="text-xs font-semibold text-white/70 mb-1">Pickup Time</p>
                                                    <p className="text-sm font-bold text-green-300">
                                                        {completion.route.pickup_time}
                                                    </p>
                                                    {completion.route.dropoff_time && (
                                                        <p className="text-xs font-semibold text-white/80 mt-1">
                                                            Dropoff: {completion.route.dropoff_time}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="p-3 glass-card rounded-lg">
                                                <p className="text-xs font-semibold text-white/70 mb-1">Pickup Points</p>
                                                <p className="text-sm font-bold text-white">
                                                    {completion.route.pickup_points_count}
                                                </p>
                                            </div>

                                            <div className="p-3 glass-card rounded-lg">
                                                <p className="text-xs font-semibold text-white/70 mb-1">Pickups Completed</p>
                                                <p className="text-sm font-bold text-white">
                                                    {completion.stats.completed_pickups} / {completion.stats.total_bookings}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notes and Review */}
                                        {(completion.notes || completion.review) && (
                                            <div className="mt-4 space-y-3">
                                                {completion.notes && (
                                                    <div className="p-4 glass-card rounded-lg border border-white/20">
                                                        <p className="text-xs font-bold text-white/70 mb-2">Completion Notes</p>
                                                        <p className="text-sm font-semibold text-white/90 whitespace-pre-wrap">
                                                            {completion.notes}
                                                        </p>
                                                    </div>
                                                )}
                                                {completion.review && (
                                                    <div className="p-4 glass-card rounded-lg border border-blue-400/30 bg-blue-500/10">
                                                        <p className="text-xs font-bold text-blue-200 mb-2">Driver Review</p>
                                                        <p className="text-sm font-semibold text-white/90 whitespace-pre-wrap">
                                                            {completion.review}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-4 text-xl font-bold text-white">No Completed Routes</h3>
                                <p className="mt-2 text-base font-semibold text-white/90">
                                    You haven't completed any routes yet. Complete your first route to see it here.
                                </p>
                            </div>
                        </GlassCard>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <GlassCard className="mt-6">
                            <div className="flex justify-between items-center p-4">
                                <p className="text-sm font-semibold text-white/90">
                                    Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} total)
                                </p>
                                <div className="flex gap-2">
                                    {pagination.current_page > 1 && (
                                        <button
                                            onClick={() => router.get('/driver/completed-routes', { page: pagination.current_page - 1 })}
                                            className="px-4 py-2 glass-card rounded-lg text-white font-semibold hover:bg-white/20 transition"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {pagination.current_page < pagination.last_page && (
                                        <button
                                            onClick={() => router.get('/driver/completed-routes', { page: pagination.current_page + 1 })}
                                            className="px-4 py-2 glass-card rounded-lg text-white font-semibold hover:bg-white/20 transition"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}

