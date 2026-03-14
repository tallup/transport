import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';
import StatusBadge from '@/Components/StatusBadge';
import { Calendar, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Index({ absences }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this absence record? This cannot be undone.')) {
            router.delete(`/admin/absences/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Student Absences" />

            <div className="py-10">
                <div className="container space-y-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                Student Absences
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 md:text-base">
                                Monitor and manage reported student absences.
                            </p>
                        </div>
                    </div>

                    <GlassCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Route</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date & Period</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Driver Seen</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {absences.data.length > 0 ? (
                                        absences.data.map((absence) => (
                                            <tr key={absence.id} className="hover:bg-slate-50 transition">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{absence.student?.name}</div>
                                                        <div className="text-xs text-slate-500">{absence.student?.parent?.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-700 font-medium">
                                                        {absence.booking?.route?.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {new Date(absence.absence_date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mt-0.5">
                                                        {absence.period === 'both' ? 'Both (AM & PM)' : absence.period.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {absence.acknowledged_at ? (
                                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span className="text-xs font-bold">Yes</span>
                                                            <span className="text-[10px] text-emerald-500/70 border-l border-emerald-100 pl-1.5 ml-0.5">
                                                                {new Date(absence.acknowledged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-xs font-bold">No</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600 italic truncate max-w-[150px]" title={absence.reason}>
                                                        {absence.reason ? `"${absence.reason}"` : '-'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(absence.id)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                No student absences found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    <div className="mt-8">
                        <PaginationLinks links={absences.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
