import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import MobileMenu from '@/Components/MobileMenu';
import RealTimeListener from '@/Components/RealTimeListener';
import { useEffect, useRef, useState } from 'react';

const sidebarLinkClasses = (isActive) =>
    `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
            ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/15'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

export default function DriverLayout({ header, children }) {
    const { auth, currentPeriod, availablePeriods, routeCompletion } = usePage().props;
    const [navAvatarError, setNavAvatarError] = useState(false);
    const sidebarScrollRef = useRef(null);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    const sidebarScrollStorageKey = 'driver-sidebar-scroll-top';
    const periodParam = typeof window !== 'undefined'
        ? new URLSearchParams(currentSearch).get('period')
        : null;
    const withPeriod = (href) => (periodParam ? `${href}?period=${periodParam}` : href);
    const canSwitchToPm = !(currentPeriod === 'am' && availablePeriods?.am && !routeCompletion?.am);

    useEffect(() => {
        if (typeof window === 'undefined' || !sidebarScrollRef.current) {
            return;
        }

        const savedScrollTop = window.sessionStorage.getItem(sidebarScrollStorageKey);
        if (savedScrollTop !== null) {
            sidebarScrollRef.current.scrollTop = Number(savedScrollTop);
        }
    }, [currentUrl, currentSearch]);

    const handleSidebarScroll = () => {
        if (typeof window === 'undefined' || !sidebarScrollRef.current) {
            return;
        }

        window.sessionStorage.setItem(
            sidebarScrollStorageKey,
            String(sidebarScrollRef.current.scrollTop),
        );
    };

    const mainNavItems = [
        { href: withPeriod('/driver/dashboard'), label: 'Dashboard', active: currentUrl === '/driver/dashboard' },
        { href: withPeriod('/driver/roster'), label: 'Daily Roster', active: currentUrl.startsWith('/driver/roster') },
        { href: withPeriod('/driver/students-schedule'), label: 'Students', active: currentUrl.startsWith('/driver/students-schedule') },
        { href: withPeriod('/driver/route-performance'), label: 'Performance', active: currentUrl.startsWith('/driver/route-performance') },
        { href: withPeriod('/driver/route-information'), label: 'Route Info', active: currentUrl.startsWith('/driver/route-information') },
        { href: withPeriod('/driver/completed-routes'), label: 'Completed', active: currentUrl.startsWith('/driver/completed-routes') },
    ];

    const helpNavItem = {
        href: '/help/driver',
        label: 'User guide',
        active: currentUrl === '/help/driver',
    };

    const navigationItems = [...mainNavItems, helpNavItem];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];

    return (
        <div className="min-h-screen logo-background logo-background-content-centered">
            <nav className="premium-nav lg:hidden">
                <div className="container">
                    <div className="flex h-16 items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href={withPeriod('/driver/dashboard')}>
                                <ApplicationLogo className="block h-9 w-auto" />
                            </Link>
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

            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200/80 lg:bg-white/80 lg:backdrop-blur-xl">
                <div className="flex h-full min-h-0 flex-col px-5 py-6">
                    <Link href={withPeriod('/driver/dashboard')} className="flex items-center gap-3 rounded-2xl px-3 py-2">
                        <ApplicationLogo className="block h-10 w-auto" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Driver Portal</p>
                            <p className="text-xs text-slate-500">Routes, roster and performance</p>
                        </div>
                    </Link>

                    <div
                        ref={sidebarScrollRef}
                        onScroll={handleSidebarScroll}
                        className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1"
                    >
                        <div className="space-y-7">
                            {availablePeriods?.am && availablePeriods?.pm && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Active Shift
                                    </p>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <Link
                                            href={`${currentUrl}?period=am`}
                                            className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                currentPeriod === 'am'
                                                    ? 'bg-brand-primary text-white shadow-sm'
                                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                        >
                                            {routeCompletion?.am ? 'AM Done' : 'AM Route'}
                                        </Link>
                                        {canSwitchToPm ? (
                                            <Link
                                                href={`${currentUrl}?period=pm`}
                                                className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                                    currentPeriod === 'pm'
                                                        ? 'bg-brand-primary text-white shadow-sm'
                                                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                                {routeCompletion?.pm ? 'PM Done' : 'PM Route'}
                                            </Link>
                                        ) : (
                                            <span className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400">
                                                PM Locked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Route Operations
                                </p>
                                <div className="mt-3 space-y-1">
                                    {mainNavItems.slice(0, 3).map((item) => (
                                        <Link key={item.href} href={item.href} className={sidebarLinkClasses(item.active)}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    History & Insights
                                </p>
                                <div className="mt-3 space-y-1">
                                    {mainNavItems.slice(3).map((item) => (
                                        <Link key={item.href} href={item.href} className={sidebarLinkClasses(item.active)}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Help</p>
                                <div className="mt-3 space-y-1">
                                    <Link href={helpNavItem.href} className={sidebarLinkClasses(helpNavItem.active)}>
                                        {helpNavItem.label}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                                {auth?.user?.profile_picture_url && !navAvatarError ? (
                                    <img
                                        src={auth.user.profile_picture_url}
                                        alt={auth.user.name || 'Driver'}
                                        className="h-9 w-9 rounded-full border border-slate-200 object-cover flex-shrink-0"
                                        onError={() => setNavAvatarError(true)}
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 flex-shrink-0">
                                        {(auth?.user?.name || 'D').slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <p className="truncate text-sm font-semibold text-slate-900 min-w-0 flex-1" title={auth?.user?.name || auth?.user?.email}>
                                    {auth?.user?.name || 'Driver'}
                                </p>
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                    <Link
                                        href="/profile"
                                        className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition border border-transparent hover:border-slate-200"
                                        title="Profile"
                                        aria-label="Profile"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition border border-transparent hover:border-rose-200"
                                        title="Log Out"
                                        aria-label="Log Out"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-72">
            {header && (
                <header className="pt-16 lg:pt-0">
                    <div className="container py-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className={`${header ? '' : 'pt-16'} lg:pt-0`}>{children}</main>
            </div>
            <RealTimeListener />
        </div>
    );
}
