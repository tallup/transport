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
        type: 'bus',
        license_plate: '',
        registration_number: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        capacity: '',
        last_maintenance_date: '',
        next_maintenance_date: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/vehicles');
    };

    return (
        <AdminLayout>
            <Head title="Create Vehicle" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Create Vehicle</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="type" value="Vehicle Type *" />
                                    <Select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="bus">Bus</option>
                                        <option value="van">Van</option>
                                    </Select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="license_plate" value="License Plate *" />
                                    <TextInput
                                        id="license_plate"
                                        type="text"
                                        value={data.license_plate}
                                        onChange={(e) => setData('license_plate', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.license_plate} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="registration_number" value="Registration Number *" />
                                    <TextInput
                                        id="registration_number"
                                        type="text"
                                        value={data.registration_number}
                                        onChange={(e) => setData('registration_number', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.registration_number} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="make" value="Make *" />
                                        <TextInput
                                            id="make"
                                            type="text"
                                            value={data.make}
                                            onChange={(e) => setData('make', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.make} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="model" value="Model *" />
                                        <TextInput
                                            id="model"
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.model} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="year" value="Year *" />
                                        <TextInput
                                            id="year"
                                            type="number"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            className="mt-1 block w-full"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            required
                                        />
                                        <InputError message={errors.year} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="capacity" value="Capacity *" />
                                        <TextInput
                                            id="capacity"
                                            type="number"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="mt-1 block w-full"
                                            min="1"
                                            required
                                        />
                                        <InputError message={errors.capacity} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="last_maintenance_date" value="Last Maintenance Date" />
                                        <TextInput
                                            id="last_maintenance_date"
                                            type="date"
                                            value={data.last_maintenance_date}
                                            onChange={(e) => setData('last_maintenance_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.last_maintenance_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="next_maintenance_date" value="Next Maintenance Date" />
                                        <TextInput
                                            id="next_maintenance_date"
                                            type="date"
                                            value={data.next_maintenance_date}
                                            onChange={(e) => setData('next_maintenance_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.next_maintenance_date} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <Select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="retired">Retired</option>
                                    </Select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Link
                                        href="/admin/vehicles"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Vehicle'}
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


