import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function MobileMenu({ navigationItems, userMenuItems, user }) {
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
            {/* Hamburger Button - Visible on mobile */}
            <div className="flex items-center sm:hidden">
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition z-[70] relative"
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

            {/* Mobile Menu Overlay and Panel - Rendered at root level */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] sm:hidden"
                    style={{ 
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={closeMenu}
                        style={{ 
                            animation: 'fadeIn 0.3s ease-out',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />
                    
                    {/* Menu Panel */}
                    <div 
                        className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white shadow-2xl"
                        style={{ 
                            animation: 'slideInLeft 0.3s ease-out',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
                                <span className="text-base font-bold text-gray-900">Menu</span>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition"
                                    aria-label="Close menu"
                                >
                                    <svg
                                        className="h-5 w-5"
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
                            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto bg-white">
                                {navigationItems && navigationItems.length > 0 ? (
                                    navigationItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                                                item.active
                                                    ? 'bg-brand-light text-brand-primary border-l-4 border-brand-primary'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))
                                ) : (
                                    <p className="px-3 py-2 text-sm text-gray-500">No navigation items</p>
                                )}
                            </nav>

                            {/* User Section */}
                            {user && (
                                <div className="border-t border-gray-200 px-3 py-3 bg-white">
                                    <div className="mb-2">
                                        <p className="text-xs font-semibold text-gray-900">{user.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
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
                                                    className="block px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
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
