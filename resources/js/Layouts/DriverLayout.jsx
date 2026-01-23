import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import MobileMenu from '@/Components/MobileMenu';

export default function DriverLayout({ header, children }) {
    const { auth, currentPeriod, availablePeriods, routeCompletion } = usePage().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    const periodParam = typeof window !== 'undefined'
        ? new URLSearchParams(currentSearch).get('period')
        : null;
    const withPeriod = (href) => (periodParam ? `${href}?period=${periodParam}` : href);
    const canSwitchToPm = !(currentPeriod === 'am' && availablePeriods?.am && !routeCompletion?.am);
    
    // Build navigation items for mobile menu
    const navigationItems = [
        { href: withPeriod('/driver/dashboard'), label: 'Dashboard', active: currentUrl === '/driver/dashboard' },
        { href: withPeriod('/driver/roster'), label: 'Daily Roster', active: currentUrl?.startsWith('/driver/roster') },
        { href: withPeriod('/driver/students-schedule'), label: 'Students Schedule', active: currentUrl?.startsWith('/driver/students-schedule') },
        { href: withPeriod('/driver/route-performance'), label: 'Route Performance', active: currentUrl?.startsWith('/driver/route-performance') },
        { href: withPeriod('/driver/route-information'), label: 'Route Information', active: currentUrl?.startsWith('/driver/route-information') },
        { href: withPeriod('/driver/completed-routes'), label: 'Completed Routes', active: currentUrl?.startsWith('/driver/completed-routes') },
    ];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];
    
    return (
        <div className="min-h-screen logo-background">
            <nav className="glass-nav fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={withPeriod('/driver/dashboard')}>
                                    <ApplicationLogo className="block h-9 w-auto text-gray-800" />
                                </Link>
                            </div>
                            <div className="hidden space-x-4 sm:-my-px sm:ml-10 sm:flex items-center">
                                <Link
                                    href={withPeriod('/driver/dashboard')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl === '/driver/dashboard'
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={withPeriod('/driver/roster')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl?.startsWith('/driver/roster')
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Daily Roster
                                </Link>
                                <Link
                                    href={withPeriod('/driver/students-schedule')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl?.startsWith('/driver/students-schedule')
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Students Schedule
                                </Link>
                                <Link
                                    href={withPeriod('/driver/route-performance')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl?.startsWith('/driver/route-performance')
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Performance
                                </Link>
                                <Link
                                    href={withPeriod('/driver/route-information')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl?.startsWith('/driver/route-information')
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Route Info
                                </Link>
                                <Link
                                    href={withPeriod('/driver/completed-routes')}
                                    className={`whitespace-nowrap py-4 px-3 border-b-2 text-base font-bold transition ${
                                        currentUrl?.startsWith('/driver/completed-routes')
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-800 hover:text-brand-primary hover:border-brand-primary'
                                    }`}
                                >
                                    Completed
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {availablePeriods?.am && availablePeriods?.pm && (
                                <div className="flex items-center gap-2 mr-4">
                                    <Link
                                        href={`${currentUrl}?period=am`}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                                            currentPeriod === 'am'
                                                ? 'bg-yellow-500/40 text-yellow-100 border-yellow-400/60'
                                                : 'bg-white/10 text-white/90 border-white/30 hover:bg-white/20'
                                        }`}
                                    >
                                        {routeCompletion?.am ? 'AM Completed' : 'AM Route'}
                                    </Link>
                                    {canSwitchToPm ? (
                                        <Link
                                            href={`${currentUrl}?period=pm`}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                                                currentPeriod === 'pm'
                                                    ? 'bg-blue-500/40 text-blue-100 border-blue-400/60'
                                                    : 'bg-white/10 text-white/90 border-white/30 hover:bg-white/20'
                                            }`}
                                        >
                                            {routeCompletion?.pm ? 'PM Completed' : 'PM Route'}
                                        </Link>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-white/5 text-white/60 border-white/20 cursor-not-allowed">
                                            PM Locked
                                        </span>
                                    )}
                                </div>
                            )}
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
                            currentPath={currentUrl}
                            currentPeriod={currentPeriod}
                            availablePeriods={availablePeriods}
                            routeCompletion={routeCompletion}
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

