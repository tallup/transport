import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpRight,
    Bus,
    CalendarClock,
    CircleDollarSign,
    ClipboardList,
    Map,
    Users,
    UserCheck,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AdminLayout from '@/Layouts/AdminLayout';
import ChartCard from '@/Components/ChartCard';
import GlassButton from '@/Components/GlassButton';
import GlassCard from '@/Components/GlassCard';
import StatusBadge from '@/Components/StatusBadge';
import { Button } from '@/Components/ui/button';

const chartColors = ['#3159c9', '#0f766e', '#b45309', '#b91c1c', '#7c3aed'];

export default function AdminDashboard({
    stats,
    recentBookings,
    recentBookingsPagination,
    revenueTrends,
    bookingStatusDistribution,
    upcomingEvents,
    activeRoutes,
    recentActivity,
    recentActivityPagination,
}) {
    const { auth } = usePage().props;

    const metricCards = [
        {
            title: 'Total Students',
            value: stats?.total_students || 0,
            href: '/admin/students',
            icon: Users,
            tone: 'text-accent-primary',
        },
        {
            title: 'Active Routes',
            value: stats?.total_routes || 0,
            href: '/admin/routes',
            icon: Map,
            tone: 'text-amber-600',
        },
        {
            title: 'Vehicles',
            value: stats?.total_vehicles || 0,
            href: '/admin/vehicles',
            icon: Bus,
            tone: 'text-violet-600',
        },
        {
            title: 'Active Bookings',
            value: stats?.active_bookings || 0,
            href: '/admin/bookings',
            icon: ClipboardList,
            tone: 'text-sky-600',
        },
        {
            title: 'Drivers',
            value: stats?.total_drivers || 0,
            href: '/admin/users?role=driver',
            icon: UserCheck,
            tone: 'text-cyan-600',
        },
        {
            title: 'Revenue',
            value: `$${stats?.total_revenue?.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) || '0.00'}`,
            href: '/admin/finance',
            icon: CircleDollarSign,
            tone: 'text-amber-600',
        },
    ];

    const bookingColumns = useMemo(
        () => [
            {
                accessorKey: 'student',
                header: 'Student',
                cell: ({ row }) => (
                    <span className="font-medium text-slate-900">
                        {row.original.student?.name || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'route',
                header: 'Route',
                cell: ({ row }) => (
                    <span className="text-slate-700">{row.original.route?.name || '-'}</span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <StatusBadge
                        type="booking"
                        status={row.original.status}
                        variant="light"
                        className="rounded-full px-2 py-1 text-xs font-semibold"
                    />
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Date',
                cell: ({ row }) => (
                    <span className="text-slate-700">
                        {new Date(row.original.created_at).toLocaleDateString()}
                    </span>
                ),
            },
        ],
        [],
    );

    const bookingsTable = useReactTable({
        data: recentBookings || [],
        columns: bookingColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="py-10">
                <div className="container space-y-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Welcome back, {auth?.user?.name || 'Admin'}
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">
                                Monitor operations, revenue, and route health in one place.
                            </p>
                        </div>
                        <Link
                            href="/admin/bookings/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-secondary"
                        >
                            Create booking
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {metricCards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: index * 0.04 }}
                                >
                                    <Link href={card.href} className="block">
                                        <GlassCard className="h-full">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                                    <p className={`mt-2 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
                                                </div>
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                                                    <Icon className="h-5 w-5 text-slate-600" />
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <ChartCard title="Revenue Trend (30 days)">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={revenueTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3159c9"
                                        strokeWidth={3}
                                        dot={false}
                                        name="Revenue ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Booking Status Distribution">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={bookingStatusDistribution || []}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={88}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {(bookingStatusDistribution || []).map((entry, index) => (
                                            <Cell key={`${entry.name}-${index}`} fill={entry.color || chartColors[index % chartColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <GlassCard>
                            <h3 className="mb-4 text-base font-semibold text-slate-900">Quick Actions</h3>
                            <div className="grid gap-3">
                                <Link href="/admin/users/create"><GlassButton className="w-full">Create User</GlassButton></Link>
                                <Link href="/admin/students/create"><GlassButton variant="secondary" className="w-full">Add Student</GlassButton></Link>
                                <Link href="/admin/routes/create"><GlassButton variant="success" className="w-full">Create Route</GlassButton></Link>
                                <Link href="/admin/vehicles/create"><GlassButton variant="secondary" className="w-full">Add Vehicle</GlassButton></Link>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-base font-semibold text-slate-900">Upcoming Events</h3>
                                <Link href="/admin/calendar-events/create" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
                                    Add Event
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {(upcomingEvents || []).length > 0 ? (
                                    upcomingEvents.slice(0, 5).map((event) => (
                                        <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <CalendarClock className="h-3.5 w-3.5" />
                                                {event.date_label}
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{event.description || event.type}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-sm text-slate-500">No upcoming events</p>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Activity</h3>
                            <div className="space-y-3">
                                {(recentActivity || []).length > 0 ? (
                                    <>
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id || activity.timestamp} className="rounded-xl border border-slate-200 bg-white p-3">
                                                <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                                                <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                                            </div>
                                        ))}
                                        {recentActivityPagination && recentActivityPagination.last_page > 1 && (
                                            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                                                <span className="text-xs text-slate-500">
                                                    Page {recentActivityPagination.current_page} of {recentActivityPagination.last_page}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => router.get('/admin/dashboard', { activity_page: recentActivityPagination.current_page - 1 }, { preserveState: true, preserveScroll: true })}
                                                        disabled={recentActivityPagination.current_page === 1}
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => router.get('/admin/dashboard', { activity_page: recentActivityPagination.current_page + 1 }, { preserveState: true, preserveScroll: true })}
                                                        disabled={recentActivityPagination.current_page === recentActivityPagination.last_page}
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="py-4 text-center text-sm text-slate-500">No recent activity</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    <GlassCard>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-slate-900">Active Routes Snapshot</h3>
                            <Link href="/admin/routes"><GlassButton variant="secondary">View all</GlassButton></Link>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={(activeRoutes || []).slice(0, 6)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                    }}
                                />
                                <Bar dataKey="bookings_count" name="Bookings" fill="#3159c9" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="capacity" name="Capacity" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    <GlassCard>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-slate-900">Recent Bookings</h3>
                            <Link href="/admin/bookings"><GlassButton variant="secondary">View all</GlassButton></Link>
                        </div>

                        {recentBookings && recentBookings.length > 0 ? (
                            <>
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            {bookingsTable.getHeaderGroups().map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {bookingsTable.getRowModel().rows.map((row) => (
                                                <tr key={row.id} className="hover:bg-slate-50">
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td key={cell.id} className="px-4 py-3 text-sm">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {recentBookingsPagination && recentBookingsPagination.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                                        <div className="text-xs text-slate-500">
                                            Showing {((recentBookingsPagination.current_page - 1) * recentBookingsPagination.per_page) + 1}
                                            {' '}to{' '}
                                            {Math.min(recentBookingsPagination.current_page * recentBookingsPagination.per_page, recentBookingsPagination.total)}
                                            {' '}of {recentBookingsPagination.total} bookings
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                onClick={() => router.get('/admin/dashboard', { bookings_page: recentBookingsPagination.current_page - 1 }, { preserveState: true, preserveScroll: true })}
                                                disabled={recentBookingsPagination.current_page === 1}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => router.get('/admin/dashboard', { bookings_page: recentBookingsPagination.current_page + 1 }, { preserveState: true, preserveScroll: true })}
                                                disabled={recentBookingsPagination.current_page === recentBookingsPagination.last_page}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="py-8 text-center text-sm text-slate-500">No recent bookings</p>
                        )}
                    </GlassCard>
                </div>
            </div>
        </AdminLayout>
    );
}
