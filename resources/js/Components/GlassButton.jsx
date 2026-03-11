export default function GlassButton({
    className = '',
    disabled,
    children,
    variant = 'primary',
    ...props
}) {
    const variants = {
        primary: 'bg-brand-primary hover:bg-brand-secondary text-white border-transparent',
        secondary: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300',
        success: 'bg-amber-600 hover:bg-amber-700 text-white border-transparent',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent',
    };

    return (
        <button
            {...props}
            className={`
                ${variants[variant] || variants.primary}
                inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold
                border shadow-sm transition-all duration-200
                hover:-translate-y-px hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}


