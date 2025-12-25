import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    return (
        <div className="min-h-screen bg-indigo-700">
            <nav className="glass-nav fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/parent/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/parent/dashboard"
                                    className="border-transparent text-gray-700 hover:text-gray-900 hover:border-purple-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/parent/students/create"
                                    className="border-transparent text-gray-700 hover:text-gray-900 hover:border-purple-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition"
                                >
                                    Add Student
                                </Link>
                                <Link
                                    href="/parent/bookings/create"
                                    className="border-transparent text-gray-700 hover:text-gray-900 hover:border-purple-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition"
                                >
                                    Book Transport
                                </Link>
                                <Link
                                    href="/parent/bookings"
                                    className="border-transparent text-gray-700 hover:text-gray-900 hover:border-purple-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition"
                                >
                                    My Bookings
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-white/30 text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth?.user?.name || 'User'}
                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="glass-nav mt-16 shadow-lg">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className={header ? '' : 'pt-16'}>{children}</main>
        </div>
    );
}

