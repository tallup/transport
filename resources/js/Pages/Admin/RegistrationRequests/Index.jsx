import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import { useState, useEffect } from 'react';

export default function Index({ pendingParents }) {
    const { flash } = usePage().props;
    const [approving, setApproving] = useState(null);
    const [rejecting, setRejecting] = useState(null);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    const handleApprove = (user) => {
        if (confirm(`Approve ${user.name}'s registration? They will be able to log in after approval.`)) {
            setApproving(user.id);
            router.post(`/admin/registration-requests/${user.id}/approve`, {}, {
                onFinish: () => setApproving(null),
                preserveScroll: false,
            });
        }
    };

    const handleReject = (user) => {
        if (confirm(`Reject ${user.name}'s registration? This will permanently delete their account.`)) {
            setRejecting(user.id);
            router.post(`/admin/registration-requests/${user.id}/reject`, {}, {
                onFinish: () => setRejecting(null),
                preserveScroll: false,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Registration Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Registration Requests</h1>
                        <p className="text-lg text-brand-primary/80 font-medium">
                            Review and approve parent account registrations
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {showFlash && (flash?.success || flash?.error) && (
                        <div className={`mb-6 px-6 py-4 rounded-xl font-bold shadow-md ${
                            flash.success
                                ? 'bg-emerald-600 border-2 border-emerald-500 text-white'
                                : 'bg-red-600 border-2 border-red-500 text-white'
                        }`}>
                            {flash.success || flash.error}
                        </div>
                    )}

                    {pendingParents && pendingParents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingParents.map((user) => (
                                <GlassCard key={user.id} className="p-6 hover:scale-[1.02] transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {user.profile_picture_url ? (
                                                <img
                                                    src={user.profile_picture_url}
                                                    alt={user.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400/50"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-extrabold text-white truncate">{user.name}</h3>
                                            <p className="text-sm text-white/70 font-medium truncate">{user.email}</p>
                                            <p className="text-xs text-white/60 mt-2">
                                                Registered: {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
                                                <button
                                                    onClick={() => handleApprove(user)}
                                                    disabled={approving === user.id || rejecting === user.id}
                                                    className="px-4 py-2 bg-green-500/20 border border-green-400/50 text-green-200 text-sm font-bold rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {approving === user.id ? 'Approving...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(user)}
                                                    disabled={approving === user.id || rejecting === user.id}
                                                    className="px-4 py-2 bg-red-500/20 border border-red-400/50 text-red-200 text-sm font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {rejecting === user.id ? 'Rejecting...' : 'Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No pending registration requests.</p>
                                <p className="text-brand-primary/70 text-sm mt-2">New parent registrations will appear here for approval.</p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
