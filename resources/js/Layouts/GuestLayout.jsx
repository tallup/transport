import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col" style={{ background: '#22304d' }}>
            {/* Navigation Header */}
            <nav className="glass-nav fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-10 w-auto" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/parent/register"
                                className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
                <div className="w-full max-w-md">
                    <div className="glass-card overflow-hidden">
                        <div className="px-8 py-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
