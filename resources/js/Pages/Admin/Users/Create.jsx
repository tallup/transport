import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'parent',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout>
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create User</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full bg-white/20 backdrop-blur-sm border-white/30"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email *" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full bg-white/20 backdrop-blur-sm border-white/30"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password *" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1 block w-full bg-white/20 backdrop-blur-sm border-white/30"
                                        required
                                        minLength={8}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-600">Minimum 8 characters</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Role *" />
                                    <Select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="mt-1 block w-full bg-white/20 backdrop-blur-sm border-white/30"
                                        required
                                    >
                                        <option value="parent">Parent</option>
                                        <option value="driver">Driver</option>
                                    </Select>
                                    <InputError message={errors.role} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/users"
                                        className="px-4 py-2 border border-white/30 rounded-lg text-gray-700 hover:bg-white/20 backdrop-blur-sm transition"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton 
                                        disabled={processing}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    >
                                        {processing ? 'Creating...' : 'Create User'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}









