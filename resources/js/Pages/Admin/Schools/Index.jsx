import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
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
                                <h1 className="text-4xl font-extrabold text-brand-primary mb-2">Schools</h1>
                                <p className="text-lg text-brand-primary/80 font-medium">Manage all registered schools</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary font-bold rounded-xl hover:bg-brand-primary/30 hover:border-brand-primary/70 transition-all"
                            >
                                Add School
                            </button>
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
                                    placeholder="Search by name or address..."
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/40 focus:bg-white/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-500/10 transition-all outline-none"
                                />
                            </form>
                            <select
                                value={activeFilter}
                                onChange={handleActiveFilter}
                                className="px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-500/10 transition-all outline-none"
                            >
                                <option value="" className="bg-brand-primary text-white">All Status</option>
                                <option value="true" className="bg-brand-primary text-white">Active</option>
                                <option value="false" className="bg-brand-primary text-white">Inactive</option>
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
                                                <h3 className="text-lg font-extrabold text-white truncate">{school.name}</h3>
                                                {school.address && (
                                                    <p className="text-sm text-white/70 font-medium truncate">{school.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            school.active
                                                ? 'bg-green-500/30 text-brand-primary border border-green-400/50'
                                                : 'bg-gray-500/30 text-brand-primary border border-gray-400/50'
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
                                                <p className="text-sm text-white/90 font-medium line-clamp-2">{school.address}</p>
                                            </div>
                                        )}
                                        {school.phone && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <p className="text-sm text-white/90 font-medium">{school.phone}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span className="text-sm text-white/90 font-medium">
                                                    {school.students_count || 0} Students
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-primary/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                                <span className="text-sm text-white/90 font-medium">
                                                    {school.routes_count || 0} Routes
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                                        <Link
                                            href={`/admin/schools/${school.id}/edit`}
                                            className="px-3 py-1.5 bg-brand-primary/20 border border-brand-primary/50 text-brand-primary text-xs font-bold rounded-lg hover:bg-brand-primary/30 transition-all"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(school.id)}
                                            disabled={deleting === school.id}
                                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-200 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
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

                    {schools.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {schools.links.map((link, index) => (
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

                    {/* Add School Modal */}
                    {showAddModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => { setShowAddModal(false); addForm.reset(); }}
                        >
                            <div
                                className="relative w-full max-w-lg glass-card rounded-xl p-6 max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-extrabold text-brand-primary">Add School</h2>
                                    <button
                                        onClick={() => { setShowAddModal(false); addForm.reset(); }}
                                        className="p-2 rounded-lg hover:bg-white/10 text-brand-primary transition-colors"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="add-name" className="block text-sm font-bold text-brand-primary mb-1">School Name *</label>
                                        <input
                                            id="add-name"
                                            type="text"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-yellow-400 outline-none"
                                            placeholder="e.g. Jefferson Elementary"
                                            required
                                        />
                                        <InputError message={addForm.errors.name} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-address" className="block text-sm font-bold text-brand-primary mb-1">Address</label>
                                        <textarea
                                            id="add-address"
                                            rows={2}
                                            value={addForm.data.address}
                                            onChange={(e) => addForm.setData('address', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-yellow-400 outline-none"
                                            placeholder="Full street address"
                                        />
                                        <InputError message={addForm.errors.address} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-phone" className="block text-sm font-bold text-brand-primary mb-1">Phone</label>
                                        <input
                                            id="add-phone"
                                            type="text"
                                            value={addForm.data.phone}
                                            onChange={(e) => addForm.setData('phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-yellow-400 outline-none"
                                            placeholder="555-1234"
                                        />
                                        <InputError message={addForm.errors.phone} className="mt-1 text-red-300 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="add-active" className="block text-sm font-bold text-brand-primary mb-1">Status</label>
                                        <select
                                            id="add-active"
                                            value={addForm.data.active ? 'true' : 'false'}
                                            onChange={(e) => addForm.setData('active', e.target.value === 'true')}
                                            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white focus:border-yellow-400 outline-none"
                                        >
                                            <option value="true" className="bg-brand-primary">Active</option>
                                            <option value="false" className="bg-brand-primary">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowAddModal(false); addForm.reset(); }}
                                            className="px-4 py-2 rounded-xl border-2 border-white/30 text-brand-primary font-bold hover:bg-white/10 transition-all"
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

