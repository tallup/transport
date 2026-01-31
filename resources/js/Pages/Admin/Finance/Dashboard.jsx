import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import ChartCard from '@/Components/ChartCard';
import GlassButton from '@/Components/GlassButton';
import { useState } from 'react';
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
    const { auth } = usePage().props;

    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

    const statusDistributionData = [
        { name: 'Active', value: statusSummary?.active || 0, color: '#10b981' },
        { name: 'Pending', value: statusSummary?.pending || 0, color: '#f59e0b' },
        { name: 'Awaiting Approval', value: statusSummary?.awaiting_approval || 0, color: '#f97316' },
        { name: 'Cancelled', value: statusSummary?.cancelled || 0, color: '#ef4444' },
        { name: 'Completed', value: statusSummary?.completed || 0, color: '#3b82f6' },
    ];

    return (
        <AdminLayout>
            <Head title="Finance Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 drop-shadow-lg">
                                Finance Dashboard
                            </h1>
                            <p className="text-base sm:text-lg font-semibold text-brand-primary/90">
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
                                    <p className="text-sm sm:text-base font-bold text-white">Total Estimated Revenue</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2 drop-shadow">
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
                                    <p className="text-sm sm:text-base font-bold text-white">Active Bookings</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-200 mt-2 drop-shadow">
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
                                    <p className="text-sm sm:text-base font-bold text-white">Cancelled Bookings</p>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-red-200 mt-2 drop-shadow">
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="#22304d40" strokeWidth={1} />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke="#22304d"
                                        tick={{ fill: '#22304d', fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#22304d"
                                        tick={{ fill: '#22304d', fontSize: 12 }}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#ffffff'
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
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#ffffff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Revenue by Plan Type */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <ChartCard title="Revenue by Plan Type">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByPlanType || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke="#ffffff"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#ffffff"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ color: '#ffffff' }} />
                                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Monthly Revenue (Last 6 Months)">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyRevenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis 
                                        dataKey="label" 
                                        stroke="#ffffff"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#ffffff"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ color: '#ffffff' }} />
                                    <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Bookings by Plan Type Table */}
                    <GlassCard>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Bookings by Plan Type</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-brand-primary/20">
                                    <thead className="bg-white/10">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Plan Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Count
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/5 divide-y divide-brand-primary/20">
                                        {revenueByPlanType && revenueByPlanType.length > 0 ? (
                                            revenueByPlanType.map((item, index) => (
                                                <tr key={index} className="hover:bg-white/10 transition border-b border-brand-primary/20">
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50">
                                                            {item.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-base font-semibold text-white/90">
                                                        {item.count}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-base font-bold text-white">
                                                        ${item.revenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-4 text-center text-white/60">
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


