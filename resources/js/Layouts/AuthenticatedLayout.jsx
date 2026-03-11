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

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

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

    return (
        <div className="min-h-screen logo-background">
            <nav className="premium-nav">
                <div className="container">
                    <div className="flex h-16 items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href="/parent/dashboard">
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

                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                        title={auth?.user?.name || 'User'}
                                    >
                                        {auth?.user?.profile_picture_url ? (
                                            <img
                                                src={auth.user.profile_picture_url}
                                                alt={auth.user.name || 'User'}
                                                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                                                {(auth?.user?.name || 'U').slice(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="max-w-28 truncate">{auth?.user?.name || 'User'}</span>
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
