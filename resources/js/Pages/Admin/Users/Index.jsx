import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Index({ users, filters }) {
    const { auth } = usePage().props;
    const [deleting, setDeleting] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setDeleting(id);
            router.delete(`/admin/users/${id}`, {
                onFinish: () => setDeleting(null),
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
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Users</h2>
                                <Link
                                    href="/admin/users/create"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg"
                                >
                                    Add User
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </form>
                                <select
                                    value={roleFilter}
                                    onChange={handleRoleFilter}
                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="parent">Parent</option>
                                    <option value="driver">Driver</option>
                                </select>
                            </div>

                            {users.data && users.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/20">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                            {users.data.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            user.role === 'driver' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold">
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                            className="text-blue-300 hover:text-blue-100 mr-4 font-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            disabled={deleting === user.id}
                                                            className="text-red-300 hover:text-red-100 disabled:opacity-50 font-semibold"
                                                        >
                                                            {deleting === user.id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-white text-lg font-semibold text-center py-8">No users found.</p>
                            )}

                            {users.links && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-lg backdrop-blur-sm ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white/20 text-gray-700 hover:bg-white/30'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

