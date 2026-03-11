import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import ChartCard from '@/Components/ChartCard';
import GlassButton from '@/Components/GlassButton';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinanceDashboard({
    totalRevenue,
    activeBookings,
    cancelledBookings,
    revenueByPlanType,
    revenueTrends,
    monthlyRevenue,
    bookingStats,
    statusSummary,
}) {
    const statusDistributionData = [
        { name: 'Active', value: statusSummary?.active || 0, color: '#ca8a04' },
        { name: 'Pending', value: statusSummary?.pending || 0, color: '#f59e0b' },
        { name: 'Awaiting Approval', value: statusSummary?.awaiting_approval || 0, color: '#f97316' },
        { name: 'Cancelled', value: statusSummary?.cancelled || 0, color: '#ef4444' },
        { name: 'Completed', value: statusSummary?.completed || 0, color: '#3b82f6' },
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
        if (!percent) {
            return null;
        }

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
            <Head title="Finance Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="mb-2 text-3xl font-extrabold text-text-primary sm:text-4xl md:text-5xl">
                                Finance Dashboard
                            </h1>
                            <p className="text-base font-semibold text-text-secondary sm:text-lg">
                                Revenue overview and financial analytics
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <GlassButton
                                variant="primary"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/admin/finance/export', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                            },
                                            body: JSON.stringify({ format: 'pdf' }),
                                        });
                                        const data = await response.json();
                                        if (data.success) {
                                            window.open(data.url, '_blank');
                                        }
                                    } catch (error) {
                                        alert('Export failed');
                                    }
                                }}
                            >
                                Export PDF
                            </GlassButton>
                            <GlassButton
                                variant="secondary"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/admin/finance/export', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                                            },
                                            body: JSON.stringify({ format: 'excel' }),
                                        });
                                        const data = await response.json();
                                        if (data.success) {
                                            window.open(data.url, '_blank');
                                        }
                                    } catch (error) {
                                        alert('Export failed');
                                    }
                                }}
                            >
                                Export Excel
                            </GlassButton>
                        </div>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 sm:text-base">Total Estimated Revenue</p>
                                    <p className="mt-2 text-3xl font-extrabold text-amber-600 sm:text-4xl">
                                        ${totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center border border-yellow-400/50">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 sm:text-base">Active Bookings</p>
                                    <p className="mt-2 text-3xl font-extrabold text-sky-600 sm:text-4xl">
                                        {activeBookings || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center border border-yellow-400/50">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 sm:text-base">Cancelled Bookings</p>
                                    <p className="mt-2 text-3xl font-extrabold text-rose-500 sm:text-4xl">
                                        {cancelledBookings || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center border border-yellow-400/50">
                                    <svg className="w-6 h-6 !text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <ChartCard title="Revenue Trends (Last 30 Days)">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeWidth={1} />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={legendStyle} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#ca8a04" 
                                        strokeWidth={2}
                                        name="Revenue ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Booking Status Distribution">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                        label={renderPieLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={legendStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Revenue by Plan Type */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <ChartCard title="Revenue by Plan Type">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByPlanType || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={legendStyle} />
                                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Monthly Revenue (Last 6 Months)">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyRevenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke={axisColor}
                                        tick={{ fill: axisColor, fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend wrapperStyle={legendStyle} />
                                    <Bar dataKey="revenue" fill="#ca8a04" name="Revenue ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Bookings by Plan Type Table */}
                    <GlassCard>
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">Bookings by Plan Type</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Plan Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Count
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {revenueByPlanType && revenueByPlanType.length > 0 ? (
                                            revenueByPlanType.map((item, index) => (
                                                <tr key={index} className="transition hover:bg-slate-50">
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold leading-5 text-sky-700">
                                                            {item.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-base font-semibold text-slate-700">
                                                        {item.count}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-base font-bold text-slate-900">
                                                        ${item.revenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-4 text-center text-slate-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}


