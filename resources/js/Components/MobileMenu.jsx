import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function MobileMenu({ navigationItems, userMenuItems, user }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button - Visible on mobile */}
            <div className="flex items-center sm:hidden">
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition"
                    aria-expanded="false"
                    aria-label="Toggle menu"
                >
                    {!isOpen ? (
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <Transition
                show={isOpen}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                    onClick={closeMenu}
                />
            </Transition>

            {/* Mobile Menu Panel */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl sm:hidden">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <button
                                onClick={closeMenu}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                            {navigationItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`block px-4 py-3 rounded-lg text-base font-semibold transition ${
                                        item.active
                                            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* User Section */}
                        {user && (
                            <div className="border-t border-gray-200 px-4 py-4">
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    {userMenuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={closeMenu}
                                            method={item.method || 'get'}
                                            as={item.as || 'a'}
                                            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Transition>
        </>
    );
}

