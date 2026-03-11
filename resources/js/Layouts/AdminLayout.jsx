import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import MobileMenu from '@/Components/MobileMenu';
import RealTimeListener from '@/Components/RealTimeListener';

const sidebarLinkClasses = (isActive) =>
    `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
            ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/15'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

export default function AdminLayout({ header, children }) {
    const { auth } = usePage().props;
    const [navAvatarError, setNavAvatarError] = useState(false);
    const sidebarScrollRef = useRef(null);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const sidebarScrollStorageKey = 'admin-sidebar-scroll-top';

    useEffect(() => {
        if (typeof window === 'undefined' || !sidebarScrollRef.current) {
            return;
        }

        const savedScrollTop = window.sessionStorage.getItem(sidebarScrollStorageKey);
        if (savedScrollTop !== null) {
            sidebarScrollRef.current.scrollTop = Number(savedScrollTop);
        }
    }, [currentUrl]);

    const handleSidebarScroll = () => {
        if (typeof window === 'undefined' || !sidebarScrollRef.current) {
            return;
        }

        window.sessionStorage.setItem(
            sidebarScrollStorageKey,
            String(sidebarScrollRef.current.scrollTop),
        );
    };

    const navigationGroups = [
        {
            label: 'Operations',
            items: [
                { href: '/admin/dashboard', label: 'Dashboard', active: currentUrl === '/admin/dashboard' },
                { href: '/admin/bookings', label: 'Bookings', active: currentUrl.startsWith('/admin/bookings') },
                { href: '/admin/routes', label: 'Routes', active: currentUrl.startsWith('/admin/routes') },
                { href: '/admin/pickup-points', label: 'Pickup Points', active: currentUrl.startsWith('/admin/pickup-points') },
                { href: '/admin/vehicles', label: 'Vehicles', active: currentUrl.startsWith('/admin/vehicles') },
            ],
        },
        {
            label: 'Monitoring',
            items: [
                { href: '/admin/finance', label: 'Finance', active: currentUrl.startsWith('/admin/finance') },
                { href: '/admin/analytics', label: 'Analytics', active: currentUrl.startsWith('/admin/analytics') },
                { href: '/admin/calendar-events', label: 'Calendar Events', active: currentUrl.startsWith('/admin/calendar-events') },
            ],
        },
        {
            label: 'People & Setup',
            items: [
                { href: '/admin/users', label: 'Users', active: currentUrl.startsWith('/admin/users') },
                { href: '/admin/students', label: 'Students', active: currentUrl.startsWith('/admin/students') },
                { href: '/admin/schools', label: 'Schools', active: currentUrl.startsWith('/admin/schools') },
                { href: '/admin/registration-requests', label: 'Registration Requests', active: currentUrl.startsWith('/admin/registration-requests') },
                { href: '/admin/pricing-rules', label: 'Pricing Rules', active: currentUrl.startsWith('/admin/pricing-rules') },
                { href: '/admin/discounts', label: 'Discounts', active: currentUrl.startsWith('/admin/discounts') },
                { href: '/admin/pricing/manage', label: 'Manage Pricing', active: currentUrl.startsWith('/admin/pricing/manage') },
            ],
        },
    ];

    const mainNavigationItems = [
        { href: '/admin/dashboard', label: 'Dashboard', active: currentUrl === '/admin/dashboard' },
        { href: '/admin/bookings', label: 'Bookings', active: currentUrl.startsWith('/admin/bookings') },
        { href: '/admin/routes', label: 'Routes', active: currentUrl.startsWith('/admin/routes') },
        { href: '/admin/pickup-points', label: 'Pickup Points', active: currentUrl.startsWith('/admin/pickup-points') },
        { href: '/admin/finance', label: 'Finance', active: currentUrl.startsWith('/admin/finance') },
        { href: '/admin/analytics', label: 'Analytics', active: currentUrl.startsWith('/admin/analytics') },
        { href: '/admin/vehicles', label: 'Vehicles', active: currentUrl.startsWith('/admin/vehicles') },
    ];

    const navigationItems = [
        ...mainNavigationItems,
        { href: '/admin/schools', label: 'Schools', active: currentUrl.startsWith('/admin/schools') },
        { href: '/admin/registration-requests', label: 'Registration Requests', active: currentUrl.startsWith('/admin/registration-requests') },
        { href: '/admin/users', label: 'Users', active: currentUrl.startsWith('/admin/users') },
        { href: '/admin/students', label: 'Students', active: currentUrl.startsWith('/admin/students') },
        { href: '/admin/pricing-rules', label: 'Pricing Rules', active: currentUrl.startsWith('/admin/pricing-rules') },
        { href: '/admin/discounts', label: 'Discounts', active: currentUrl.startsWith('/admin/discounts') },
        { href: '/admin/pricing/manage', label: 'Manage Pricing', active: currentUrl.startsWith('/admin/pricing/manage') },
        { href: '/admin/calendar-events', label: 'Calendar Events', active: currentUrl.startsWith('/admin/calendar-events') },
    ];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];

    return (
        <div className="min-h-screen logo-background">
            <nav className="premium-nav lg:hidden">
                <div className="container">
                    <div className="flex h-16 items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/dashboard" className="flex-shrink-0">
                                <ApplicationLogo className="block h-9 w-auto" />
                            </Link>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Admin Console</p>
                                <p className="text-xs text-slate-500">School transport operations</p>
                            </div>
                        </div>

                        <div className="ml-auto flex items-center">
                            <MobileMenu
                                navigationItems={navigationItems}
                                userMenuItems={userMenuItems}
                                user={auth?.user}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200/80 lg:bg-white/80 lg:backdrop-blur-xl">
                <div className="flex h-full min-h-0 flex-col px-5 py-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-2">
                        <ApplicationLogo className="block h-10 w-auto" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Admin Console</p>
                            <p className="text-xs text-slate-500">School transport operations</p>
                        </div>
                    </Link>

                    <div
                        ref={sidebarScrollRef}
                        onScroll={handleSidebarScroll}
                        className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1"
                    >
                        <div className="space-y-7">
                            {navigationGroups.map((group) => (
                                <div key={group.label}>
                                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        {group.label}
                                    </p>
                                    <div className="mt-3 space-y-1">
                                        {group.items.map((item) => (
                                            <Link key={item.href} href={item.href} className={sidebarLinkClasses(item.active)}>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3 shadow-sm">
                            <div className="flex items-center gap-3 px-2 py-2">
                                {auth?.user?.profile_picture_url && !navAvatarError ? (
                                    <img
                                        src={auth.user.profile_picture_url}
                                        alt={auth.user.name || 'Admin'}
                                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                        onError={() => setNavAvatarError(true)}
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                        {(auth?.user?.name || 'A').slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{auth?.user?.name || 'Admin'}</p>
                                    <p className="truncate text-xs text-slate-500">{auth?.user?.email || 'Signed in'}</p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                >
                                    Log Out
                                </Link>
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
