import { useState } from 'react';
import { router } from '@inertiajs/react';
import GlassButton from '@/Components/GlassButton';

export default function ReportExporter() {
    const [isOpen, setIsOpen] = useState(false);
    const [reportType, setReportType] = useState('revenue');
    const [format, setFormat] = useState('pdf');
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch('/admin/analytics/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    type: reportType,
                    format: format,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Open the file in a new tab
                window.open(data.url, '_blank');
                setIsOpen(false);
            } else {
                alert('Export failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Export failed: ' + error.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <GlassButton
                variant="primary"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                Export Report
            </GlassButton>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 z-50">
                        <h3 className="text-lg font-bold text-white mb-4">Export Report</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">
                                    Report Type
                                </label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="revenue">Revenue</option>
                                    <option value="capacity">Capacity</option>
                                    <option value="driver">Driver Performance</option>
                                    <option value="route">Route Efficiency</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">
                                    Format
                                </label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <GlassButton
                                    variant="primary"
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="flex-1"
                                >
                                    {isExporting ? 'Exporting...' : 'Export'}
                                </GlassButton>
                                <GlassButton
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}




