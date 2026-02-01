import GlassCard from '@/Components/GlassCard';

export default function CapacityHeatmap({ data = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'full':
                return 'bg-red-500/30 border-red-400/50 text-red-100';
            case 'high':
                return 'bg-orange-500/30 border-orange-400/50 text-orange-100';
            case 'medium':
                return 'bg-yellow-500/30 border-yellow-400/50 text-yellow-100';
            case 'low':
                return 'bg-green-500/30 border-green-400/50 text-green-100';
            default:
                return 'bg-gray-500/30 border-gray-400/50 text-gray-100';
        }
    };

    return (
        <GlassCard className="p-6">
            <h3 className="text-xl font-extrabold text-brand-primary mb-4">Capacity Utilization by Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((route) => (
                    <GlassCard
                        key={route.route_id}
                        className={`p-4 border-2 ${getStatusColor(route.status).replace('text-red-100', 'text-brand-primary').replace('text-orange-100', 'text-brand-primary').replace('text-yellow-100', 'text-brand-primary').replace('text-green-100', 'text-brand-primary').replace('text-gray-100', 'text-brand-primary')}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-extrabold text-lg text-white">{route.route_name}</h4>
                            <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${getStatusColor(route.status).replace('text-red-100', 'text-brand-primary').replace('text-orange-100', 'text-brand-primary').replace('text-yellow-100', 'text-brand-primary').replace('text-green-100', 'text-brand-primary').replace('text-gray-100', 'text-brand-primary')}`}>
                                {route.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/70">Capacity:</span>
                                <span className="font-bold text-white">{route.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Active Bookings:</span>
                                <span className="font-bold text-white">{route.active_bookings}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Available:</span>
                                <span className="font-bold text-white">{route.available_seats}</span>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            route.utilization_percent >= 80
                                                ? 'bg-red-500'
                                                : route.utilization_percent >= 50
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                        }`}
                                        style={{ width: `${Math.min(route.utilization_percent, 100)}%` }}
                                    />
                                </div>
                                <div className="text-xs mt-1 text-center font-bold text-brand-primary">
                                    {route.utilization_percent}% utilized
                                </div>
                            </div>
                            <div className="text-xs mt-2 pt-2 border-t border-white/20">
                                <div className="text-white/90">Driver: <span className="font-bold text-white">{route.driver_name}</span></div>
                                <div className="text-white/90">Vehicle: <span className="font-bold text-white">{route.vehicle_type}</span></div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
            {data.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/30 to-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/50">
                        <svg className="w-8 h-8 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <p className="text-brand-primary font-bold">No route data available</p>
                </div>
            )}
        </GlassCard>
    );
}




