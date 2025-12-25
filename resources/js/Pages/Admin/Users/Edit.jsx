import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function Edit({ user }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'parent',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">Edit User</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-base font-bold text-white mb-2">
                                            Name *
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-base font-bold text-white mb-2">
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2 text-red-300 font-semibold" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-base font-bold text-white mb-2">
                                            Password (leave blank to keep current)
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white placeholder-gray-300"
                                            minLength={8}
                                        />
                                        <InputError message={errors.password} className="mt-2 text-red-300 font-semibold" />
                                        <p className="mt-1 text-sm font-semibold text-white/80">Leave blank to keep current password</p>
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block text-base font-bold text-white mb-2">
                                            Role *
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="mt-1 block w-full glass-input text-white"
                                            required
                                        >
                                            <option value="parent" className="bg-indigo-700">Parent</option>
                                            <option value="driver" className="bg-indigo-700">Driver</option>
                                        </select>
                                        <InputError message={errors.role} className="mt-2 text-red-300 font-semibold" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/admin/users"
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white font-bold hover:bg-white/30 transition"
                                    >
                                        Cancel
                                    </Link>
                                    <GlassButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </GlassButton>
                                </div>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
