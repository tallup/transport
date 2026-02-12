import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col logo-background">
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
            <div className="flex flex-1 items-start justify-center py-8 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 overflow-y-auto">
                <div className="w-full max-w-6xl animate-fade-in">
                    <div className="glass-card overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="px-6 py-8 sm:px-10 sm:py-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
