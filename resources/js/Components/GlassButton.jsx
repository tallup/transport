export default function GlassButton({
    className = '',
    disabled,
    children,
    variant = 'primary',
    ...props
}) {
    const variants = {
        primary: '', // Uses glass-button class from CSS with logo colors
        secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    };

    return (
        <button
            {...props}
            className={`
                glass-button
                ${variants[variant] || variants.primary}
                text-white font-semibold py-2 px-4 rounded-lg
                backdrop-blur-sm border border-white/30
                shadow-lg transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}


