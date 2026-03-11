import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import MobileMenu from '@/Components/MobileMenu';
import RealTimeListener from '@/Components/RealTimeListener';

const navLinkClasses = (isActive) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
            ? 'bg-brand-primary text-white shadow-sm'
            : 'text-slate-700 hover:bg-white hover:text-slate-900'
    }`;

export default function DriverLayout({ header, children }) {
    const { auth, currentPeriod, availablePeriods, routeCompletion } = usePage().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    const periodParam = typeof window !== 'undefined'
        ? new URLSearchParams(currentSearch).get('period')
        : null;
    const withPeriod = (href) => (periodParam ? `${href}?period=${periodParam}` : href);
    const canSwitchToPm = !(currentPeriod === 'am' && availablePeriods?.am && !routeCompletion?.am);

    const navigationItems = [
        { href: withPeriod('/driver/dashboard'), label: 'Dashboard', active: currentUrl === '/driver/dashboard' },
        { href: withPeriod('/driver/roster'), label: 'Daily Roster', active: currentUrl.startsWith('/driver/roster') },
        { href: withPeriod('/driver/students-schedule'), label: 'Students', active: currentUrl.startsWith('/driver/students-schedule') },
        { href: withPeriod('/driver/route-performance'), label: 'Performance', active: currentUrl.startsWith('/driver/route-performance') },
        { href: withPeriod('/driver/route-information'), label: 'Route Info', active: currentUrl.startsWith('/driver/route-information') },
        { href: withPeriod('/driver/completed-routes'), label: 'Completed', active: currentUrl.startsWith('/driver/completed-routes') },
    ];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];

    return (
        <div className="min-h-screen logo-background">
            <nav className="premium-nav">
                <div className="container">
                    <div className="flex h-16 items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href={withPeriod('/driver/dashboard')}>
                                <ApplicationLogo className="block h-9 w-auto" />
                            </Link>

                            <div className="hidden items-center gap-1 lg:flex">
                                {navigationItems.map((item) => (
                                    <Link key={item.href} href={item.href} className={navLinkClasses(item.active)}>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden items-center gap-3 sm:flex">
                            {availablePeriods?.am && availablePeriods?.pm && (
                                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                                    <Link
                                        href={`${currentUrl}?period=am`}
                                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                            currentPeriod === 'am'
                                                ? 'bg-brand-primary text-white'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {routeCompletion?.am ? 'AM Completed' : 'AM Route'}
                                    </Link>
                                    {canSwitchToPm ? (
                                        <Link
                                            href={`${currentUrl}?period=pm`}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                                currentPeriod === 'pm'
                                                    ? 'bg-brand-primary text-white'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {routeCompletion?.pm ? 'PM Completed' : 'PM Route'}
                                        </Link>
                                    ) : (
                                        <span className="cursor-not-allowed rounded-full px-3 py-1 text-xs font-medium text-slate-400">
                                            PM Locked
                                        </span>
                                    )}
                                </div>
                            )}

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                        title={auth?.user?.name || 'Driver'}
                                    >
                                        {auth?.user?.profile_picture_url ? (
                                            <img
                                                src={auth.user.profile_picture_url}
                                                alt={auth.user.name || 'Driver'}
                                                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                                                {(auth?.user?.name || 'D').slice(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="max-w-24 truncate">{auth?.user?.name || 'Driver'}</span>
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

                        <div className="ml-auto flex items-center sm:hidden">
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
                </div>
            </nav>

            {header && (
                <header className="pt-16">
                    <div className="container py-6">{header}</div>
                </header>
            )}

            <main className={header ? '' : 'pt-16'}>{children}</main>
            <RealTimeListener />
        </div>
    );
}
