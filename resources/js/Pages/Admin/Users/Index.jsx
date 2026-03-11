import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
import { useState, useEffect } from 'react';

export default function Index({ users, filters }) {
    const { auth, flash } = usePage().props;
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [showFlash, setShowFlash] = useState(true);
    const [imageErrors, setImageErrors] = useState(new Set());

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
                                <h1 className="mb-2 text-4xl font-extrabold text-text-primary">Users</h1>
                                <p className="text-lg font-medium text-text-secondary">Manage all system users</p>
                            </div>
                            <Link
                                href="/admin/users/create"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Add User
                            </Link>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {showFlash && (flash?.success || flash?.error) && (
                        <div className={`mb-6 px-6 py-4 rounded-xl font-bold shadow-md ${
                            flash.success
                                ? 'bg-emerald-600 border-2 border-emerald-500 text-white'
                                : 'bg-amber-600/90 border-2 border-amber-500 text-white'
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
                                    className="form-control"
                                />
                            </form>
                            <select
                                value={roleFilter}
                                onChange={handleRoleFilter}
                                className="form-control sm:max-w-[180px]"
                            >
                                <option value="">All Roles</option>
                                <option value="parent">Parent</option>
                                <option value="driver">Driver</option>
                                <option value="admin">Admin</option>
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
                                            {user.profile_picture_url && !imageErrors.has(user.id) ? (
                                                <img
                                                    src={user.profile_picture_url}
                                                    alt={user.name}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-md flex-shrink-0 border-2 border-yellow-400/50 bg-white/10"
                                                    onError={() => setImageErrors((prev) => new Set(prev).add(user.id))}
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 border-2 border-yellow-400/50 text-brand-primary text-lg font-bold">
                                                    {(user.name || '?').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate text-lg font-bold text-slate-900">{user.name}</h3>
                                                <p className="truncate text-sm font-medium text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                                                user.role === 'driver'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : user.role === 'parent'
                                                    ? 'border-sky-200 bg-sky-50 text-sky-700'
                                                    : ['super_admin', 'transport_admin', 'admin'].includes(user.role)
                                                    ? 'border-violet-200 bg-violet-50 text-violet-700'
                                                    : 'border-slate-200 bg-slate-100 text-slate-600'
                                            }`}>
                                                {user.role === 'super_admin' ? 'Super Admin' : user.role === 'transport_admin' ? 'Transport Admin' : user.role === 'admin' ? 'Admin' : user.role}
                                            </span>
                                            {user.role === 'parent' && (
                                                <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${
                                                    user.is_active !== false
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border-rose-200 bg-rose-50 text-rose-700'
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
                                            <p className="text-sm font-medium text-slate-700">
                                                Created: {new Date(user.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                        {!['super_admin', 'transport_admin'].includes(user.role) && (
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                            >
                                                Edit
                                            </Link>
                                        )}
                                        {user.role === 'parent' && (
                                            <button
                                                onClick={() => handleToggleParentStatus(user)}
                                                disabled={toggling === user.id}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                                    user.is_active !== false
                                                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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
                                        {!['super_admin', 'transport_admin', 'admin'].includes(user.role) && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={deleting === user.id}
                                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                                            >
                                                {deleting === user.id ? 'Deleting...' : 'Delete'}
                                            </button>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No users found.</p>
                            </div>
                        </GlassCard>
                    )}

                    <PaginationLinks links={users.links} />
                </div>
            </div>
        </AdminLayout>
    );
}

