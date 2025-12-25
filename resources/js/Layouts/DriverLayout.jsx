import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import MobileMenu from '@/Components/MobileMenu';

export default function DriverLayout({ header, children }) {
    const { auth } = usePage().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    
    // Build navigation items for mobile menu
    const navigationItems = [
        { href: '/driver/dashboard', label: 'Dashboard', active: currentUrl === '/driver/dashboard' },
        { href: '/driver/roster', label: 'Daily Roster', active: currentUrl?.startsWith('/driver/roster') },
    ];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-700 via-teal-700 to-green-800">
            <nav className="glass-nav fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/driver/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto text-gray-800" />
                                </Link>
                            </div>
                            <div className="hidden space-x-4 sm:-my-px sm:ml-10 sm:flex items-center">
                                <Link
                                    href="/driver/dashboard"
                                    className="border-transparent text-gray-800 hover:text-green-700 hover:border-green-600 whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/driver/roster"
                                    className="border-transparent text-gray-800 hover:text-green-700 hover:border-green-600 whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition"
                                >
                                    Daily Roster
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-base leading-4 font-bold rounded-lg text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth?.user?.name || 'Driver'}
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
                                        <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                                        <Dropdown.Link href="/logout" method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        <MobileMenu
                            navigationItems={navigationItems}
                            userMenuItems={userMenuItems}
                            user={auth?.user}
                        />
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

