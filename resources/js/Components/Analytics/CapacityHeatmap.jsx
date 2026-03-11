import GlassCard from '@/Components/GlassCard';

export default function CapacityHeatmap({ data = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'full':
                return 'bg-rose-50 border-rose-200 text-rose-700';
            case 'high':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'low':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            default:
                return 'bg-slate-100 border-slate-200 text-slate-600';
        }
    };

    return (
        <GlassCard className="p-6">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Capacity Utilization by Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((route) => (
                    <GlassCard
                        key={route.route_id}
                        className={`border-2 p-4 ${getStatusColor(route.status)}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-slate-900">{route.route_name}</h4>
                            <span className={`rounded-lg border px-2 py-1 text-xs font-semibold ${getStatusColor(route.status)}`}>
                                {route.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Capacity:</span>
                                <span className="font-semibold text-slate-800">{route.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Active Bookings:</span>
                                <span className="font-semibold text-slate-800">{route.active_bookings}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Available:</span>
                                <span className="font-semibold text-slate-800">{route.available_seats}</span>
                            </div>
                            <div className="mt-2">
                                <div className="h-2 w-full rounded-full bg-slate-200">
                                    <div
                                        className={`h-2 rounded-full ${
                                            route.utilization_percent >= 80
                                                ? 'bg-red-500'
                                                : route.utilization_percent >= 50
                                                ? 'bg-yellow-500'
                                                : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${Math.min(route.utilization_percent, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-1 text-center text-xs font-semibold text-slate-600">
                                    {route.utilization_percent}% utilized
                                </div>
                            </div>
                            <div className="mt-2 border-t border-slate-200 pt-2 text-xs">
                                <div className="text-slate-600">Driver: <span className="font-semibold text-slate-800">{route.driver_name}</span></div>
                                <div className="text-slate-600">Vehicle: <span className="font-semibold text-slate-800">{route.vehicle_type}</span></div>
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




