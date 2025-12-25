import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';

export default function AdminLayout({ header, children }) {
    const { auth } = usePage().props;
    
    return (
        <div className="min-h-screen bg-indigo-700">
            <nav className="glass-nav fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/admin/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto" />
                                </Link>
                            </div>
                            <div className="hidden space-x-4 sm:-my-px sm:ml-10 sm:flex items-center">
                                <Link
                                    href="/admin/dashboard"
                                    className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 rounded-t-lg hover:bg-white/20 active:border-indigo-600"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    href="/admin/bookings"
                                    className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 rounded-t-lg hover:bg-white/20"
                                >
                                    Bookings
                                </Link>

                                <Link
                                    href="/admin/routes"
                                    className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 rounded-t-lg hover:bg-white/20"
                                >
                                    Routes
                                </Link>
                                
                                {/* People Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 inline-flex items-center rounded-t-lg hover:bg-white/20">
                                            People
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="56">
                                        <Dropdown.Link href="/admin/users">Users</Dropdown.Link>
                                        <Dropdown.Link href="/admin/students">Students</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                {/* Transport Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 inline-flex items-center rounded-t-lg hover:bg-white/20">
                                            Transport
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="56">
                                        <Dropdown.Link href="/admin/vehicles">Vehicles</Dropdown.Link>
                                        <Dropdown.Link href="/admin/pickup-points">Pickup Points</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                {/* Operations Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="border-transparent text-gray-800 hover:text-indigo-700 hover:border-indigo-600 whitespace-nowrap py-4 px-3 border-b-2 font-bold text-base transition-all duration-200 inline-flex items-center rounded-t-lg hover:bg-white/20">
                                            Operations
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="56">
                                        <Dropdown.Link href="/admin/pricing-rules">Pricing Rules</Dropdown.Link>
                                        <Dropdown.Link href="/admin/calendar-events">Calendar Events</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-white/30 text-sm leading-4 font-semibold rounded-lg text-gray-800 bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                                        >
                                            {auth?.user?.name || 'Admin'}
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

