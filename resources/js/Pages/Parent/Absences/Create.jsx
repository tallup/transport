import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassCard from '@/Components/GlassCard';
import InputError from '@/Components/InputError';
import GlassButton from '@/Components/GlassButton';

export default function Create({ bookings, selectedBookingId }) {
    const { data, setData, post, processing, errors } = useForm({
        booking_id: selectedBookingId || '',
        absence_date: new Date().toISOString().split('T')[0],
        period: 'both',
        reason: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/parent/absences');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Report Absence" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link
                            href="/parent/absences"
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition mb-4"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Absences
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900">Report Absence</h1>
                        <p className="text-lg font-medium text-slate-500">Let the driver know which trip your student will miss</p>
                    </div>

                    <GlassCard className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Student & Route</label>
                                <select
                                    value={data.booking_id}
                                    onChange={(e) => setData('booking_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                >
                                    <option value="">Select a student...</option>
                                    {bookings.map((booking) => (
                                        <option key={booking.id} value={booking.id}>
                                            {booking.student.name} - {booking.route.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.booking_id} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Absence Date</label>
                                    <input
                                        type="date"
                                        value={data.absence_date}
                                        onChange={(e) => setData('absence_date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary"
                                        required
                                    />
                                    <InputError message={errors.absence_date} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Period</label>
                                    <select
                                        value={data.period}
                                        onChange={(e) => setData('period', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary"
                                        required
                                    >
                                        <option value="am">Morning Only (AM)</option>
                                        <option value="pm">Afternoon Only (PM)</option>
                                        <option value="both">Both (AM & PM)</option>
                                    </select>
                                    <InputError message={errors.period} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Optional)</label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-brand-primary focus:ring-brand-primary resize-none"
                                    rows="3"
                                    placeholder="e.g. Doctor appointment, family emergency..."
                                ></textarea>
                                <InputError message={errors.reason} className="mt-2" />
                            </div>

                            <div className="pt-4">
                                <GlassButton
                                    type="submit"
                                    className="w-full py-4 text-base"
                                    disabled={processing}
                                >
                                    {processing ? 'Reporting...' : 'Submit Absence Report'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>

                    <div className="mt-8 rounded-xl bg-blue-50 p-6 border border-blue-100">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 text-blue-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide">Important Note</h4>
                                <p className="mt-1 text-sm text-blue-700 leading-relaxed">
                                    Reporting an absence helps the driver optimize their route and ensures they don't wait at the pickup point. 
                                    Please try to report absences as early as possible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
