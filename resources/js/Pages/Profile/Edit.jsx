import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import GlassCard from '@/Components/GlassCard';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
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
