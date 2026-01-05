import GlassCard from './GlassCard';

export default function ChartCard({ title, children, className = '' }) {
    return (
        <GlassCard className={className}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            )}
            <div className="text-gray-900">
                {children}
            </div>
        </GlassCard>
    );
}




