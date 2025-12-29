import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import DriverLayout from '@/Layouts/DriverLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import GlassCard from '@/Components/GlassCard';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role;
    
    // Determine which layout to use based on user role
    const isAdmin = userRole === 'super_admin' || userRole === 'transport_admin';
    const isDriver = userRole === 'driver';
    
    const Layout = isAdmin ? AdminLayout : isDriver ? DriverLayout : AuthenticatedLayout;
    
    return (
        <Layout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <GlassCard className="overflow-hidden">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-full"
                        />
                    </GlassCard>

                    <GlassCard className="overflow-hidden">
                        <UpdatePasswordForm className="max-w-full" />
                    </GlassCard>

                    <GlassCard className="overflow-hidden">
                        <DeleteUserForm className="max-w-full" />
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
