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

    const axisColor = '#64748b';
    const gridColor = 'rgba(148, 163, 184, 0.25)';
    const tooltipStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: '12px',
        color: '#0f172a',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
    };
    const legendStyle = { color: '#475569', fontSize: 12 };

    const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
        if (!percent) return null;
        const radius = outerRadius + 22;
        const radians = Math.PI / 180;
        const x = cx + radius * Math.cos(-midAngle * radians);
        const y = cy + radius * Math.sin(-midAngle * radians);

        return (
            <text
                x={x}
                y={y}
                fill="#475569"
                fontSize="12"
                fontWeight="600"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${name}: ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <AdminLayout>
            <Head title="Analytics Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="mb-2 text-3xl font-extrabold text-text-primary sm:text-4xl md:text-5xl">
                                Analytics Dashboard
                            </h1>
                            <p className="text-base font-semibold text-text-secondary sm:text-lg">
                                Comprehensive insights into your transport operations
                            </p>
                        </div>
                        <ReportExporter />
                    </div>

                    {/* Date Range Filter */}
                    <GlassCard className="mb-6 p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleDateRangeChange}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="flex space-x-2 border-b border-slate-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-bold transition ${
                                        activeTab === tab.id
                                            ? 'border-b-2 border-brand-primary text-brand-primary'
                                            : 'text-slate-500 hover:text-slate-800'
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Revenue</p>
                                            <p className="text-2xl font-extrabold text-amber-600">
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Active Routes</p>
                                            <p className="text-2xl font-extrabold text-sky-600">
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Drivers</p>
                                            <p className="text-2xl font-extrabold text-violet-600">
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Utilization</p>
                                            <p className="text-2xl font-extrabold text-emerald-600">
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
                                <h3 className="mb-4 text-xl font-bold text-slate-900">Revenue Trends</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis
                                            dataKey="label"
                                            stroke={axisColor}
                                            tick={{ fill: axisColor }}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke={axisColor}
                                            tick={{ fill: axisColor }}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend wrapperStyle={legendStyle} />
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Revenue</p>
                                            <p className="text-2xl font-extrabold text-amber-600">
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Daily Revenue</p>
                                            <p className="text-2xl font-extrabold text-sky-600">
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Growth</p>
                                            <p className={`text-2xl font-extrabold ${(revenueSummary.growth_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(revenueSummary.growth_percent || 0) >= 0 ? '+' : ''}{revenueSummary.growth_percent || 0}%
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">vs previous period</p>
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
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Bookings</p>
                                            <p className="text-2xl font-extrabold text-violet-600">
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
                                <h3 className="mb-4 text-xl font-bold text-slate-900">Revenue Trends</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={revenueTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis
                                            dataKey="label"
                                            stroke={axisColor}
                                            tick={{ fill: axisColor }}
                                        />
                                        <YAxis
                                            stroke={axisColor}
                                            tick={{ fill: axisColor }}
                                        />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend wrapperStyle={legendStyle} />
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
                                    <h3 className="mb-4 text-xl font-bold text-slate-900">Revenue by Plan Type</h3>
                                    {revenueSummary.revenue_by_plan_type && revenueSummary.revenue_by_plan_type.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={revenueSummary.revenue_by_plan_type}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                                        label={renderPieLabel}
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
                                                        contentStyle={tooltipStyle}
                                                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                    />
                                                    <Legend wrapperStyle={legendStyle} />
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
                                                                <span className="text-sm font-semibold text-slate-700">{plan.label}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-bold text-slate-900">${plan.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                                <span className="ml-2 text-xs text-slate-500">({percentage}%)</span>
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
                                    <h3 className="mb-4 text-xl font-bold text-slate-900">Revenue Comparison by Plan</h3>
                                    {revenueSummary.revenue_by_plan_type && revenueSummary.revenue_by_plan_type.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={revenueSummary.revenue_by_plan_type}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                                <XAxis
                                                    dataKey="label"
                                                    stroke={axisColor}
                                                    tick={{ fill: axisColor }}
                                                />
                                                <YAxis
                                                    stroke={axisColor}
                                                    tick={{ fill: axisColor }}
                                                />
                                                <Tooltip
                                                    contentStyle={tooltipStyle}
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
                                    <h3 className="mb-4 text-xl font-bold text-slate-900">Top Revenue Generating Routes</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Route</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Revenue</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Bookings</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">Avg per Booking</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-brand-primary uppercase">% of Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 bg-white">
                                                {revenueSummary.revenue_by_route.slice(0, 10).map((route) => {
                                                    const avgPerBooking = route.bookings_count > 0 
                                                        ? (route.revenue / route.bookings_count).toFixed(2)
                                                        : '0.00';
                                                    const percentage = revenueSummary.total_revenue > 0
                                                        ? ((route.revenue / revenueSummary.total_revenue) * 100).toFixed(1)
                                                        : '0.0';
                                                    return (
                                                        <tr key={route.route_id} className="transition hover:bg-slate-50">
                                                            <td className="px-4 py-3 text-base font-bold text-slate-900">{route.route_name}</td>
                                                            <td className="px-4 py-3 text-base font-semibold text-slate-700">
                                                                ${route.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="px-4 py-3 text-base font-semibold text-slate-700">
                                                                {route.bookings_count}
                                                            </td>
                                                            <td className="px-4 py-3 text-base font-semibold text-slate-700">
                                                                ${avgPerBooking}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <div className="mr-2 h-2 w-24 rounded-full bg-slate-200">
                                                                        <div
                                                                            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                                            style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-base font-semibold text-slate-700">{percentage}%</span>
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
                                <h3 className="mb-4 text-xl font-bold text-slate-900">Route Efficiency Metrics</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-slate-500">Route</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-slate-500">Capacity</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-slate-500">Utilization</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-slate-500">Avg Bookings/Day</th>
                                                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-slate-500">Driver</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {routeMetrics.map((route) => (
                                                <tr key={route.route_id} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-3 text-base font-bold text-slate-900">{route.route_name}</td>
                                                    <td className="px-4 py-3 text-base font-semibold text-slate-700">
                                                        {route.active_bookings}/{route.capacity}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className="mr-2 h-2 w-24 rounded-full bg-slate-200">
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
                                                            <span className="text-base font-semibold text-slate-700">
                                                                {route.utilization_percent}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-base font-semibold text-slate-700">
                                                        {route.avg_bookings_per_day}
                                                    </td>
                                                    <td className="px-4 py-3 text-base font-semibold text-slate-700">
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




