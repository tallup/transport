import GlassCard from './GlassCard';

export default function ChartCard({ title, children, className = '' }) {
    return (
        <GlassCard className={className}>
            {title && (
                <h3 className="mb-4 text-base font-semibold text-text-primary md:text-lg">{title}</h3>
            )}
            <div>
                {children}
            </div>
        </GlassCard>
    );
}





