import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function MobileMenu({
    navigationItems,
    userMenuItems,
    user,
    currentPath,
    currentPeriod,
    availablePeriods,
    routeCompletion,
}) {
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button - Visible on mobile only */}
                <button
                    type="button"
                    onClick={toggleMenu}
                className="sm:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-gray-800 hover:text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition relative bg-white border border-gray-300 shadow-lg z-50"
                    aria-expanded={isOpen}
                    aria-label="Toggle menu"
                >
                    {!isOpen ? (
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </button>

            {/* Mobile Menu Overlay and Panel - Rendered at root level */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] sm:hidden"
                    style={{ 
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                    }}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={closeMenu}
                        style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10000,
                            animation: 'fadeIn 0.3s ease-out',
                        }}
                    />
                    
                    {/* Menu Panel */}
                    <div 
                        className="fixed top-0 left-0 h-screen w-[300px] max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
                        style={{ 
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100vh',
                            zIndex: 10001,
                            animation: 'slideInLeft 0.3s ease-out',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                                <span className="text-lg font-bold text-gray-900">Menu</span>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    aria-label="Close menu"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Period Switcher */}
                            {availablePeriods?.am && availablePeriods?.pm && currentPath && (
                                <div className="px-4 py-4 border-b border-gray-200 bg-white">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Route Period
                                    </p>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`${currentPath}?period=am`}
                                            onClick={closeMenu}
                                            className={`flex-1 text-center px-3 py-2 rounded-lg text-xs font-bold border transition ${
                                                currentPeriod === 'am'
                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {routeCompletion?.am ? 'AM Completed' : 'AM Route'}
                                        </Link>
                                        {currentPeriod === 'am' && availablePeriods?.am && !routeCompletion?.am ? (
                                            <span className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-bold border bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed">
                                                PM Locked
                                            </span>
                                        ) : (
                                            <Link
                                                href={`${currentPath}?period=pm`}
                                                onClick={closeMenu}
                                                className={`flex-1 text-center px-3 py-2 rounded-lg text-xs font-bold border transition ${
                                                    currentPeriod === 'pm'
                                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                {routeCompletion?.pm ? 'PM Completed' : 'PM Route'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Items */}
                            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-white">
                                {navigationItems && navigationItems.length > 0 ? (
                                    navigationItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
                                                item.active
                                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))
                                ) : (
                                    <p className="px-4 py-3 text-sm text-gray-500">No navigation items</p>
                                )}
                            </nav>

                            {/* User Section */}
                            {user && (
                                <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 flex-shrink-0">
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                                        <p className="text-xs text-gray-600 truncate mt-0.5">{user.email || ''}</p>
                                    </div>
                                    <div className="space-y-1">
                                        {userMenuItems && userMenuItems.length > 0 ? (
                                            userMenuItems.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    onClick={closeMenu}
                                                    method={item.method || 'get'}
                                                    as={item.as || 'a'}
                                                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 transition border border-gray-200 hover:border-gray-300"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
