export default function GlassCard({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`glass-card rounded-2xl p-6 ${hover ? 'surface-card-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}









