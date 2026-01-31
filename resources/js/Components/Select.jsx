export default function Select({ className = '', children, ...props }) {
    return (
        <select
            {...props}
            className={
                'block w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white focus:bg-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 outline-none backdrop-blur-sm ' +
                className
            }
        >
            {children}
        </select>
    );
}










