import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            {/* Navigation Header */}
            <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-10 w-10 fill-current text-gray-600 dark:text-gray-400" />
                                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    Student Transport
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('login')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('parent.register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
                        <div className="px-6 py-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
