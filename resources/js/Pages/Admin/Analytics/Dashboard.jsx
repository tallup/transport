import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import CapacityHeatmap from '@/Components/Analytics/CapacityHeatmap';
import DriverPerformanceTable from '@/Components/Analytics/DriverPerformanceTable';
import ReportExporter from '@/Components/Analytics/ReportExporter';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard({
    revenueTrends = [],
    revenueSummary = {},
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
                    <GlassCard className="mb-6 p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="px-3 py-2 bg-white/10 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-500/10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="px-3 py-2 bg-white/10 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-500/10"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleDateRangeChange}
                                    className="px-4 py-2 bg-brand-primary/20 border-2 border-brand-primary/50 text-brand-primary hover:bg-brand-primary/30 hover:border-brand-primary/70 font-bold rounded-lg transition-all"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="flex space-x-2 border-b border-brand-primary/20">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-bold transition ${
                                        activeTab === tab.id
                                            ? 'text-brand-primary border-b-2 border-yellow-400'
                                            : 'text-brand-primary/70 hover:text-brand-primary'
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
                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Total Revenue</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                ${revenueTrends.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Active Routes</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                {capacityUtilization.length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Total Drivers</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                {driverMetrics.length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Avg Utilization</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                {capacityUtilization.length > 0
                                                    ? Math.round(capacityUtilization.reduce((sum, r) => sum + r.utilization_percent, 0) / capacityUtilization.length)
                                                    : 0}%
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Revenue Trends Chart */}
                            <GlassCard className="p-6">
                                <h3 className="text-xl font-extrabold text-brand-primary mb-4">Revenue Trends</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#22304d" strokeOpacity={0.3} />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#22304d"
                                            tick={{ fill: '#22304d' }}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#22304d"
                                            tick={{ fill: '#22304d' }}
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
                            </GlassCard>

                            {/* Capacity Utilization */}
                            <CapacityHeatmap data={capacityUtilization} />
                        </div>
                    )}

                    {/* Revenue Tab */}
                    {activeTab === 'revenue' && (
                        <div className="space-y-6">
                            {/* Revenue Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Total Revenue</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                ${(revenueSummary.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Avg Daily Revenue</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                ${(revenueSummary.avg_daily_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Growth</p>
                                            <p className={`text-2xl font-extrabold ${(revenueSummary.growth_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(revenueSummary.growth_percent || 0) >= 0 ? '+' : ''}{revenueSummary.growth_percent || 0}%
                                            </p>
                                            <p className="text-xs text-brand-primary/60 mt-1">vs previous period</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wide mb-2">Total Bookings</p>
                                            <p className="text-2xl font-extrabold text-white">
                                                {revenueSummary.total_bookings || 0}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Revenue Trends Chart */}
                            <GlassCard className="p-6">
                                <h3 className="text-xl font-extrabold text-brand-primary mb-4">Revenue Trends</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#22304d" strokeOpacity={0.3} />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#22304d"
                                            tick={{ fill: '#22304d' }}
                                        />
                                        <YAxis
                                            stroke="#22304d"
                                            tick={{ fill: '#22304d' }}
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
                                            stroke="#facc15"
                                            strokeWidth={3}
                                            name="Revenue ($)"
                                            dot={{ fill: '#facc15', r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bookings_count"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Bookings"
                                            dot={{ fill: '#3b82f6', r: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </GlassCard>

                            {/* Revenue Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Revenue by Plan Type */}
                                <GlassCard className="p-6">
                                    <h3 className="text-xl font-extrabold text-brand-primary mb-4">Revenue by Plan Type</h3>
                                    {revenueSummary.revenue_by_plan_type && revenueSummary.revenue_by_plan_type.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={revenueSummary.revenue_by_plan_type}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="revenue"
                                                    >
                                                        {revenueSummary.revenue_by_plan_type.map((entry, index) => {
                                                            const colors = ['#facc15', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                        })}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                            color: '#ffffff',
                                                        }}
                                                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="mt-4 space-y-2">
                                                {revenueSummary.revenue_by_plan_type.map((plan, index) => {
                                                    const colors = ['#facc15', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                                                    const percentage = revenueSummary.total_revenue > 0 
                                                        ? ((plan.revenue / revenueSummary.total_revenue) * 100).toFixed(1)
                                                        : 0;
                                                    return (
                                                        <div key={plan.plan_type} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                                                                <span className="text-sm font-semibold text-white">{plan.label}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-bold text-white">${plan.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                                <span className="text-xs text-brand-primary/70 ml-2">({percentage}%)</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-brand-primary/70">No revenue data available</p>
                                        </div>
                                    )}
                                </GlassCard>

                                {/* Revenue by Plan Type Bar Chart */}
                                <GlassCard className="p-6">
                                    <h3 className="text-xl font-extrabold text-brand-primary mb-4">Revenue Comparison by Plan</h3>
                                    {revenueSummary.revenue_by_plan_type && revenueSummary.revenue_by_plan_type.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={revenueSummary.revenue_by_plan_type}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#22304d" strokeOpacity={0.3} />
                                                <XAxis
                                                    dataKey="label"
                                                    stroke="#22304d"
                                                    tick={{ fill: '#22304d' }}
                                                />
                                                <YAxis
                                                    stroke="#22304d"
                                                    tick={{ fill: '#22304d' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        color: '#ffffff',
                                                    }}
                                                    formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                />
                                                <Bar dataKey="revenue" fill="#facc15" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-brand-primary/70">No revenue data available</p>
                                        </div>
                                    )}
                                </GlassCard>
                            </div>

                            {/* Top Revenue Generating Routes */}
                            {revenueSummary.revenue_by_route && revenueSummary.revenue_by_route.length > 0 && (
                                <GlassCard className="p-6">
                                    <h3 className="text-xl font-extrabold text-brand-primary mb-4">Top Revenue Generating Routes</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-brand-primary/20">
                                            <thead className="bg-white/10">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Route</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Revenue</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Bookings</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Avg per Booking</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">% of Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                                {revenueSummary.revenue_by_route.slice(0, 10).map((route) => {
                                                    const avgPerBooking = route.bookings_count > 0 
                                                        ? (route.revenue / route.bookings_count).toFixed(2)
                                                        : '0.00';
                                                    const percentage = revenueSummary.total_revenue > 0
                                                        ? ((route.revenue / revenueSummary.total_revenue) * 100).toFixed(1)
                                                        : '0.0';
                                                    return (
                                                        <tr key={route.route_id} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                            <td className="px-4 py-3 text-base font-bold text-white">{route.route_name}</td>
                                                            <td className="px-4 py-3 text-base font-semibold text-white">
                                                                ${route.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="px-4 py-3 text-base font-semibold text-white/90">
                                                                {route.bookings_count}
                                                            </td>
                                                            <td className="px-4 py-3 text-base font-semibold text-white/90">
                                                                ${avgPerBooking}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <div className="w-24 bg-white/10 rounded-full h-2 mr-2">
                                                                        <div
                                                                            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                                            style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-base font-semibold text-white/90">{percentage}%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassCard>
                            )}
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
                            <GlassCard className="p-6">
                                <h3 className="text-xl font-extrabold text-brand-primary mb-4">Route Efficiency Metrics</h3>
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
                            </GlassCard>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}




