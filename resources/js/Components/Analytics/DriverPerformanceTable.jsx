import { useState } from 'react';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

export default function DriverPerformanceTable({ data = [] }) {
    const [sortField, setSortField] = useState('driver_name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterRoute, setFilterRoute] = useState('');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const getOnTimeRateColor = (rate) => {
        if (rate >= 90) return 'text-green-400';
        if (rate >= 75) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Driver Performance Metrics</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Filter by driver name..."
                        value={filterRoute}
                        onChange={(e) => setFilterRoute(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/30">
                    <thead className="bg-white/10">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('driver_name')}
                            >
                                Driver {sortField === 'driver_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('total_routes')}
                            >
                                Routes {sortField === 'total_routes' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('total_bookings')}
                            >
                                Bookings {sortField === 'total_bookings' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('total_completions')}
                            >
                                Completions {sortField === 'total_completions' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('total_pickups')}
                            >
                                Pickups {sortField === 'total_pickups' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-bold text-white uppercase cursor-pointer hover:bg-white/20"
                                onClick={() => handleSort('on_time_rate')}
                            >
                                On-Time Rate {sortField === 'on_time_rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">
                                Avg Completion Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-gray-200/20">
                        {sortedData
                            .filter((driver) =>
                                filterRoute === '' || driver.driver_name.toLowerCase().includes(filterRoute.toLowerCase())
                            )
                            .map((driver) => (
                                <tr key={driver.driver_id} className="hover:bg-white/10 transition">
                                    <td className="px-4 py-3 text-base font-bold text-white">{driver.driver_name}</td>
                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                        {driver.total_routes}
                                    </td>
                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                        {driver.total_bookings}
                                    </td>
                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                        {driver.total_completions}
                                    </td>
                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                        {driver.total_pickups}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-base font-bold ${getOnTimeRateColor(driver.on_time_rate)}`}>
                                            {driver.on_time_rate}%
                                        </span>
                                        <div className="w-24 bg-white/10 rounded-full h-2 mt-1">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    driver.on_time_rate >= 90
                                                        ? 'bg-green-500'
                                                        : driver.on_time_rate >= 75
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                }`}
                                                style={{ width: `${Math.min(driver.on_time_rate, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                        {driver.avg_completion_time_minutes
                                            ? `${Math.round(driver.avg_completion_time_minutes)} min`
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {sortedData.length === 0 && (
                <p className="text-white/60 text-center py-8">No driver data available</p>
            )}
        </div>
    );
}




