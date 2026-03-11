import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
import GlassButton from '@/Components/GlassButton';
import InputError from '@/Components/InputError';
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ schools, filters }) {
    const { auth, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const addForm = useForm({
        name: '',
        address: '',
        phone: '',
        active: true,
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.active || '');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this school?')) {
            setDeleting(id);
            router.delete(`/admin/schools/${id}`, {
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/schools', { search, active: activeFilter }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleActiveFilter = (e) => {
        setActiveFilter(e.target.value);
        router.get('/admin/schools', { search, active: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/schools', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Schools" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="mb-2 text-4xl font-extrabold text-text-primary">Schools</h1>
                                <p className="text-lg font-medium text-text-secondary">Manage all registered schools</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Add School
                            </button>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {showFlash && (flash?.success || flash?.error) && (
                        <div className={`mb-6 px-6 py-4 rounded-xl font-bold shadow-md ${
                            flash.success
                                ? 'bg-amber-600 border-2 border-amber-500 text-white'
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
                                    placeholder="Search by name or address..."
                                    className="form-control"
                                />
                            </form>
                            <select
                                value={activeFilter}
                                onChange={handleActiveFilter}
                                className="form-control sm:max-w-[180px]"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </GlassCard>

                    {schools.data && schools.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {schools.data.map((school) => (
                                <GlassCard key={school.id} className="p-6 hover:scale-[1.02] transition-all">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate text-lg font-bold text-slate-900">{school.name}</h3>
                                                {school.address && (
                                                    <p className="truncate text-sm font-medium text-slate-500">{school.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                                            school.active
                                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 bg-slate-100 text-slate-600'
                                        }`}>
                                            {school.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3 mb-4">
                                        {school.address && (
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p className="line-clamp-2 text-sm font-medium text-slate-700">{school.address}</p>
                                            </div>
                                        )}
                                        {school.phone && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <p className="text-sm font-medium text-slate-700">{school.phone}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 border-t border-slate-200 pt-2">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-slate-700">
                                                    {school.students_count || 0} Students
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                <span className="text-sm font-medium text-slate-700">
                                                    {school.routes_count || 0} Routes
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                                        <Link
                                            href={`/admin/schools/${school.id}/edit`}
                                            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(school.id)}
                                            disabled={deleting === school.id}
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            {deleting === school.id ? 'Deleting...' : 'Delete'}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-brand-primary text-lg font-bold">No schools found.</p>
                            </div>
                        </GlassCard>
                    )}

                    <PaginationLinks links={schools.links} />

                    {/* Add School Modal */}
                    {showAddModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => { setShowAddModal(false); addForm.reset(); }}
                        >
                            <div
                                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl glass-card p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-slate-900">Add School</h2>
                                    <button
                                        onClick={() => { setShowAddModal(false); addForm.reset(); }}
                                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="add-name" className="mb-1 block text-sm font-semibold text-slate-700">School Name *</label>
                                        <input
                                            id="add-name"
                                            type="text"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            className="form-control"
                                            placeholder="e.g. Jefferson Elementary"
                                            required
                                        />
                                        <InputError message={addForm.errors.name} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-address" className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
                                        <textarea
                                            id="add-address"
                                            rows={2}
                                            value={addForm.data.address}
                                            onChange={(e) => addForm.setData('address', e.target.value)}
                                            className="form-control"
                                            placeholder="Full street address"
                                        />
                                        <InputError message={addForm.errors.address} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-phone" className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                                        <input
                                            id="add-phone"
                                            type="text"
                                            value={addForm.data.phone}
                                            onChange={(e) => addForm.setData('phone', e.target.value)}
                                            className="form-control"
                                            placeholder="555-1234"
                                        />
                                        <InputError message={addForm.errors.phone} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-active" className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                                        <select
                                            id="add-active"
                                            value={addForm.data.active ? 'true' : 'false'}
                                            onChange={(e) => addForm.setData('active', e.target.value === 'true')}
                                            className="form-control"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowAddModal(false); addForm.reset(); }}
                                            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            Cancel
                                        </button>
                                        <GlassButton type="submit" disabled={addForm.processing}>
                                            {addForm.processing ? 'Creating...' : 'Create School'}
                                        </GlassButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

