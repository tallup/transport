import GlassCard from './GlassCard';

export default function ChartCard({ title, children, className = '' }) {
    return (
        <GlassCard className={className}>
            {title && (
                <h3 className="text-lg font-semibold text-brand-primary mb-4">{title}</h3>
            )}
            <div>
                {children}
            </div>
        </GlassCard>
    );
}





