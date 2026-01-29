import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CapacityHeatmap from '@/Components/Analytics/CapacityHeatmap';
import DriverPerformanceTable from '@/Components/Analytics/DriverPerformanceTable';
import ReportExporter from '@/Components/Analytics/ReportExporter';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard({
    revenueTrends = [],
    capacityUtilization = [],
    driverMetrics = [],
    routeMetrics = [],
    startDate,
    endDate,
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState({
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: endDate || new Date().toISOString().split('T')[0],
    });

    const handleDateRangeChange = () => {
        router.get('/admin/analytics', {
            start_date: dateRange.start,
            end_date: dateRange.end,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'capacity', label: 'Capacity' },
        { id: 'drivers', label: 'Drivers' },
        { id: 'routes', label: 'Routes' },
    ];

    return (
        <AdminLayout>
            <Head title="Analytics Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                Analytics Dashboard
                            </h1>
                            <p className="text-base sm:text-lg font-semibold text-brand-primary/90">
                                Comprehensive insights into your transport operations
                            </p>
                        </div>
                        <ReportExporter />
                    </div>

                    {/* Date Range Filter */}
                    <div className="mb-6 bg-brand-primary rounded-xl p-6 shadow-lg">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleDateRangeChange}
                                    className="px-4 py-2 bg-white text-brand-primary hover:bg-white/90 font-semibold rounded-lg transition"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="flex space-x-2 border-b border-white/20">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-semibold transition ${
                                        activeTab === tab.id
                                            ? 'text-white border-b-2 border-blue-500'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">Total Revenue</p>
                                            <p className="text-2xl font-extrabold text-white mt-2">
                                                ${revenueTrends.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">Active Routes</p>
                                            <p className="text-2xl font-extrabold text-white mt-2">
                                                {capacityUtilization.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">Total Drivers</p>
                                            <p className="text-2xl font-extrabold text-white mt-2">
                                                {driverMetrics.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase">Avg Utilization</p>
                                            <p className="text-2xl font-extrabold text-white mt-2">
                                                {capacityUtilization.length > 0
                                                    ? Math.round(capacityUtilization.reduce((sum, r) => sum + r.utilization_percent, 0) / capacityUtilization.length)
                                                    : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Trends Chart */}
                            <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">Revenue Trends</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#ffffff"
                                            tick={{ fill: '#ffffff' }}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#ffffff"
                                            tick={{ fill: '#ffffff' }}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: '#ffffff',
                                            }}
                                        />
                                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Revenue ($)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Capacity Utilization */}
                            <CapacityHeatmap data={capacityUtilization} />
                        </div>
                    )}

                    {/* Revenue Tab */}
                    {activeTab === 'revenue' && (
                        <div className="space-y-6">
                            <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">Revenue Trends</h3>
                                <div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#ffffff"
                                            tick={{ fill: '#ffffff' }}
                                        />
                                        <YAxis
                                            stroke="#ffffff"
                                            tick={{ fill: '#ffffff' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: '#ffffff',
                                            }}
                                        />
                                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="Revenue ($)"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bookings_count"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Bookings"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Capacity Tab */}
                    {activeTab === 'capacity' && (
                        <div className="space-y-6">
                            <CapacityHeatmap data={capacityUtilization} />
                        </div>
                    )}

                    {/* Drivers Tab */}
                    {activeTab === 'drivers' && (
                        <div className="space-y-6">
                            <DriverPerformanceTable data={driverMetrics} />
                        </div>
                    )}

                    {/* Routes Tab */}
                    {activeTab === 'routes' && (
                        <div className="space-y-6">
                            <div className="bg-brand-primary rounded-xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Route Efficiency Metrics</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-primary/20">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Route</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Capacity</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Utilization</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Avg Bookings/Day</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase">Driver</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                            {routeMetrics.map((route) => (
                                                <tr key={route.route_id} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                    <td className="px-4 py-3 text-base font-bold text-white">{route.route_name}</td>
                                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                                        {route.active_bookings}/{route.capacity}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="w-24 bg-white/10 rounded-full h-2 mr-2">
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
                                                            <span className="text-base font-semibold text-white/90">
                                                                {route.utilization_percent}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                                        {route.avg_bookings_per_day}
                                                    </td>
                                                    <td className="px-4 py-3 text-base font-semibold text-white/90">
                                                        {route.driver_name}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}




