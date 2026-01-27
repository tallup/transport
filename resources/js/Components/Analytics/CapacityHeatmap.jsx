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
        <GlassCard>
            <h3 className="text-xl font-bold text-white mb-4">Capacity Utilization by Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((route) => (
                    <div
                        key={route.route_id}
                        className={`p-4 rounded-lg border-2 ${getStatusColor(route.status)}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg">{route.route_name}</h4>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full border">
                                {route.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Capacity:</span>
                                <span className="font-semibold">{route.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Active Bookings:</span>
                                <span className="font-semibold">{route.active_bookings}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Available:</span>
                                <span className="font-semibold">{route.available_seats}</span>
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
                                <div className="text-xs mt-1 text-center">
                                    {route.utilization_percent}% utilized
                                </div>
                            </div>
                            <div className="text-xs mt-2 pt-2 border-t border-white/20">
                                <div>Driver: {route.driver_name}</div>
                                <div>Vehicle: {route.vehicle_type}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <p className="text-white/60 text-center py-8">No route data available</p>
            )}
        </GlassCard>
    );
}




