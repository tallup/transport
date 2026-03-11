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

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [navAvatarError, setNavAvatarError] = useState(false);
    const sidebarScrollRef = useRef(null);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const sidebarScrollStorageKey = 'parent-sidebar-scroll-top';

    const navigationItems = [
        { href: '/parent/dashboard', label: 'Dashboard', active: currentUrl === '/parent/dashboard' },
        { href: '/parent/students', label: 'My Students', active: currentUrl === '/parent/students' },
        { href: '/parent/students/enroll', label: 'Add Student', active: currentUrl === '/parent/students/enroll' },
        { href: '/parent/bookings/create', label: 'Book Transport', active: currentUrl === '/parent/bookings/create' },
        {
            href: route('parent.bookings.index'),
            label: 'My Bookings',
            active: currentUrl.startsWith('/parent/bookings') && currentUrl !== '/parent/bookings/create' && currentUrl !== '/parent/pickup-history',
        },
        { href: '/parent/pickup-history', label: 'Pickup History', active: currentUrl === '/parent/pickup-history' },
    ];

    const userMenuItems = [
        { href: '/profile', label: 'Profile' },
        { href: '/logout', label: 'Log Out', method: 'post', as: 'button' },
    ];

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

    return (
        <div className="min-h-screen logo-background logo-background-content-centered">
            <nav className="premium-nav lg:hidden">
                <div className="container">
                    <div className="flex h-16 items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href="/parent/dashboard">
                                <ApplicationLogo className="block h-9 w-auto" />
                            </Link>

                        </div>

                        <div className="ml-auto flex items-center sm:hidden">
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
                    <Link href="/parent/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-2">
                        <ApplicationLogo className="block h-10 w-auto" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Parent Portal</p>
                            <p className="text-xs text-slate-500">Bookings and student transport</p>
                        </div>
                    </Link>

                    <div
                        ref={sidebarScrollRef}
                        onScroll={handleSidebarScroll}
                        className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1"
                    >
                        <div className="space-y-7">
                            <div>
                                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Family
                                </p>
                                <div className="mt-3 space-y-1">
                                    {navigationItems.map((item) => (
                                        <Link key={item.href} href={item.href} className={sidebarLinkClasses(item.active)}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3 shadow-sm">
                            <div className="flex items-center gap-3 px-2 py-2">
                                {auth?.user?.profile_picture_url && !navAvatarError ? (
                                    <img
                                        src={auth.user.profile_picture_url}
                                        alt={auth.user.name || 'Parent'}
                                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                        onError={() => setNavAvatarError(true)}
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                        {(auth?.user?.name || 'P').slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">{auth?.user?.name || 'Parent'}</p>
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
