import { getBookingStatusColor, formatBookingStatus, getVehicleStatusColor, formatVehicleStatus } from '@/utils/statusHelpers';

/**
 * Renders a status badge for bookings or vehicles using shared styling.
 * @param {string} type - 'booking' | 'vehicle'
 * @param {string} status - status value (e.g. 'active', 'pending')
 * @param {string} [variant='default'] - 'default' (brand-primary text) or 'light' (green-100, etc.)
 * @param {string} [label] - override display label; otherwise formatted from status
 * @param {string} [className] - extra classes (e.g. px-3 py-1 rounded-lg text-xs font-bold)
 */
export default function StatusBadge({ type, status, variant = 'default', label, className = '' }) {
    if (type === 'vehicle') {
        const colorClass = getVehicleStatusColor(status);
        const displayLabel = label ?? formatVehicleStatus(status);
        return (
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colorClass} ${className}`.trim()}>
                {displayLabel}
            </span>
        );
    }
    const colorClass = getBookingStatusColor(status, variant);
    const displayLabel = label ?? formatBookingStatus(status);
    return (
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colorClass} ${className}`.trim()}>
            {displayLabel}
        </span>
    );
}
