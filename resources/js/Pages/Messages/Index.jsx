import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';

export default function MessagesIndex({ threads = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Messages</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Your conversation threads</p>
                            </div>
                        </div>
                    </div>

                    {threads.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {threads.map((thread) => (
                                <Link
                                    key={thread.id}
                                    href={`/messages/${thread.id}`}
                                    className="block"
                                >
                                    <GlassCard className="p-6 hover:scale-[1.02] transition-all cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-extrabold text-white truncate">
                                                            {thread.other_participant?.name || 'Unknown User'}
                                                        </h3>
                                                        {thread.unread_count > 0 && (
                                                            <span className="px-2 py-0.5 bg-blue-500/30 text-brand-primary border border-blue-400/50 text-xs font-bold rounded-lg">
                                                                {thread.unread_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {thread.last_message && (
                                                        <p className="text-sm text-white/70 truncate">
                                                            {thread.last_message.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {thread.last_message_at && (
                                                <p className="text-xs text-white/50 flex-shrink-0 ml-2">
                                                    {new Date(thread.last_message_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        {(thread.booking || thread.route) && (
                                            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                                {thread.booking && (
                                                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-500/30 text-brand-primary border border-blue-400/50">
                                                        Booking: {thread.booking.student_name}
                                                    </span>
                                                )}
                                                {thread.route && (
                                                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-500/30 text-brand-primary border border-green-400/50">
                                                        Route: {thread.route.name}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No messages yet</p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



