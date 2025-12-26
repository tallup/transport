export default function GlassCard({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`glass-card rounded-xl p-6 ${hover ? 'hover:scale-[1.02]' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}


