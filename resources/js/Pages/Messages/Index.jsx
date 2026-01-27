import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';

export default function MessagesIndex({ threads = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Messages" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold text-white mb-2">Messages</h1>
                        <p className="text-white/80">Your conversation threads</p>
                    </div>

                    <div className="space-y-4">
                        {threads.length > 0 ? (
                            threads.map((thread) => (
                                <Link
                                    key={thread.id}
                                    href={`/messages/${thread.id}`}
                                    className="block"
                                >
                                    <GlassCard className="hover:bg-white/20 transition cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">
                                                        {thread.other_participant?.name || 'Unknown User'}
                                                    </h3>
                                                    {thread.unread_count > 0 && (
                                                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                            {thread.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                                {thread.last_message && (
                                                    <p className="text-white/70 text-sm truncate">
                                                        {thread.last_message.message}
                                                    </p>
                                                )}
                                                {thread.booking && (
                                                    <p className="text-white/50 text-xs mt-1">
                                                        Booking: {thread.booking.student_name}
                                                    </p>
                                                )}
                                                {thread.route && (
                                                    <p className="text-white/50 text-xs mt-1">
                                                        Route: {thread.route.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {thread.last_message_at && (
                                                    <p className="text-white/50 text-xs">
                                                        {new Date(thread.last_message_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            ))
                        ) : (
                            <GlassCard>
                                <p className="text-white/60 text-center py-8">No messages yet</p>
                            </GlassCard>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



