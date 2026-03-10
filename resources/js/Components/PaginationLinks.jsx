import { router } from '@inertiajs/react';

/**
 * Renders Laravel pagination links. Uses plain text for labels (no dangerouslySetInnerHTML).
 */
export default function PaginationLinks({ links, className = '' }) {
    if (!links || links.length === 0) return null;

    return (
        <div className={`mt-8 flex justify-center ${className}`}>
            <div className="flex gap-2">
                {links.map((link, index) => {
                    const baseClass = `px-4 py-2.5 rounded-xl font-bold text-sm ${
                        link.active
                            ? 'bg-yellow-400/35 text-brand-primary border-2 border-yellow-400 shadow-sm'
                            : 'bg-yellow-400/20 text-white border-2 border-yellow-400/80 hover:bg-yellow-400/30 hover:border-yellow-400'
                    } ${!link.url ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`;
                    return link.url ? (
                        <button
                            key={index}
                            type="button"
                            onClick={() => router.get(link.url)}
                            className={baseClass}
                        >
                            {link.label}
                        </button>
                    ) : (
                        <span key={index} className={baseClass}>
                            {link.label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
