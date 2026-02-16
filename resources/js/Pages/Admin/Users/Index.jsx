import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import { useState, useEffect } from 'react';

export default function Index({ users, filters }) {
    const { auth, flash } = usePage().props;
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user? This will permanently remove the user and all their associated data (students, bookings, etc.).')) {
            setDeleting(id);
            router.delete(`/admin/users/${id}`, {
                onFinish: () => setDeleting(null),
                preserveScroll: false,
            });
        }
    };

    const handleToggleParentStatus = (user) => {
        if (user.role !== 'parent') {
            return;
        }

        const action = user.is_active ? 'disable' : 'enable';
        const message = user.is_active 
            ? 'Are you sure you want to disable this parent account? All their students will be removed from routes and active bookings will be cancelled.'
            : 'Are you sure you want to enable this parent account?';

        if (confirm(message)) {
            setToggling(user.id);
            router.post(`/admin/users/${user.id}/toggle-parent-status`, {}, {
                onFinish: () => setToggling(null),
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: roleFilter }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
        router.get('/admin/users', { search, role: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Users</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage all system users</p>
                            </div>
                            <Link
                                href="/admin/users/create"
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add User
                            </Link>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {showFlash && (flash?.success || flash?.error) && (
                        <div className={`mb-6 px-6 py-4 rounded-xl font-bold ${
                            flash.success 
                                ? 'bg-green-500/20 border-2 border-green-400/50 text-green-200' 
                                : 'bg-red-500/20 border-2 border-red-400/50 text-red-200'
                        }`}>
                            {flash.success || flash.error}
                        </div>
                    )}

                    {/* Filters */}
                    <GlassCard className="mb-6 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full px-4 py-3 bg-white/20 border-2 border-brand-primary/40 rounded-xl text-brand-primary font-medium placeholder-brand-primary/60 focus:bg-white/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all outline-none"
                                />
                            </form>
                            <select
                                value={roleFilter}
                                onChange={handleRoleFilter}
                                className="px-4 py-3 bg-white/20 border-2 border-brand-primary/40 rounded-xl text-brand-primary font-medium focus:bg-white/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all outline-none"
                            >
                                <option value="" className="bg-brand-primary text-white">All Roles</option>
                                <option value="parent" className="bg-brand-primary text-white">Parent</option>
                                <option value="driver" className="bg-brand-primary text-white">Driver</option>
                            </select>
                        </div>
                    </GlassCard>

                    {users.data && users.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {users.data.map((user) => (
                                <GlassCard key={user.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-extrabold text-white truncate">{user.name}</h3>
                                                <p className="text-sm text-white/70 font-medium truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                user.role === 'driver' 
                                                    ? 'bg-green-500/30 text-brand-primary border border-green-400/50' 
                                                    : user.role === 'parent'
                                                    ? 'bg-blue-500/30 text-brand-primary border border-blue-400/50'
                                                    : 'bg-purple-500/30 text-brand-primary border border-purple-400/50'
                                            }`}>
                                                {user.role}
                                            </span>
                                            {user.role === 'parent' && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                    user.is_active !== false
                                                        ? 'bg-green-500/30 text-brand-primary border border-green-400/50'
                                                        : 'bg-red-500/30 text-brand-primary border border-red-400/50'
                                                }`}>
                                                    {user.is_active !== false ? 'Active' : 'Disabled'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm text-white/90 font-medium">
                                                Created: {new Date(user.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        {user.role === 'parent' && (
                                            <button
                                                onClick={() => handleToggleParentStatus(user)}
                                                disabled={toggling === user.id}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${
                                                    user.is_active !== false
                                                        ? 'bg-orange-500/20 border border-orange-400/50 text-orange-200 hover:bg-orange-500/30'
                                                        : 'bg-green-500/20 border border-green-400/50 text-green-200 hover:bg-green-500/30'
                                                }`}
                                            >
                                                {toggling === user.id 
                                                    ? 'Processing...' 
                                                    : user.is_active !== false 
                                                        ? 'Disable' 
                                                        : 'Enable'
                                                }
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deleting === user.id}
                                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                                        >
                                            {deleting === user.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                                    <svg className="w-10 h-10 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No users found.</p>
                            </div>
                        </GlassCard>
                    )}

                    {users.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg ${
                                            link.active
                                                ? 'bg-brand-primary/30 text-brand-primary border-2 border-brand-primary/50'
                                                : 'bg-white/10 border-2 border-white/30 text-white hover:bg-white/20'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

