export default function GlassCard({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`glass-card rounded-xl p-6 ${hover ? 'hover:scale-[1.01]' : ''} ${className}`}
            style={hover ? { 
                willChange: 'transform',
                transform: 'translateZ(0)' // Force GPU acceleration for crisp text
            } : {}}
            {...props}
        >
            {children}
        </div>
    );
}









