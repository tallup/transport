import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import PaginationLinks from '@/Components/PaginationLinks';

export default function Index({ absences }) {
    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this absence report?')) {
            router.delete(`/parent/absences/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Absences" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900">Student Absences</h1>
                            <p className="text-lg font-medium text-slate-500">Report when your child will not be taking the transport</p>
                        </div>
                        <Link
                            href="/parent/absences/create"
                            className="inline-flex items-center rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary/90"
                        >
                            Report Absence
                        </Link>
                    </div>

                    {absences.data && absences.data.length > 0 ? (
                        <div className="space-y-4">
                            {absences.data.map((absence) => (
                                <GlassCard key={absence.id} className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{absence.student?.name}</h3>
                                                <p className="text-sm font-medium text-slate-500">
                                                    {new Date(absence.absence_date).toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                    <span className="mx-2 text-slate-300">•</span>
                                                    <span className="uppercase font-bold text-xs tracking-wider">
                                                        {absence.period === 'both' ? 'Both (AM & PM)' : absence.period.toUpperCase()}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            {absence.reason && (
                                                <div className="hidden md:block max-w-xs transition-all">
                                                    <p className="text-sm italic text-slate-600 truncate" title={absence.reason}>
                                                        "{absence.reason}"
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {new Date(absence.absence_date) >= new Date().setHours(0,0,0,0) && (
                                                <button
                                                    onClick={() => handleCancel(absence.id)}
                                                    className="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-12 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No absences reported</h3>
                            <p className="text-slate-500 mt-2">Any future or past absences you report will appear here.</p>
                            <Link
                                href="/parent/absences/create"
                                className="mt-6 inline-block text-brand-primary font-bold hover:underline"
                            >
                                Report your first absence
                            </Link>
                        </GlassCard>
                    )}

                    <div className="mt-8">
                        <PaginationLinks links={absences.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
