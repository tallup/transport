/**
 * Shared status styling and formatting for bookings and vehicles.
 * Use with StatusBadge or call directly for custom markup.
 */

const BOOKING_STATUS_CLASSES = {
    active: 'bg-amber-500/30 text-brand-primary border border-amber-400/50',
    pending: 'bg-yellow-500/30 text-brand-primary border border-yellow-400/50',
    awaiting_approval: 'bg-amber-500/30 text-brand-primary border border-amber-400/50',
    completed: 'bg-blue-500/30 text-brand-primary border border-blue-400/50',
    cancelled: 'bg-red-500/30 text-brand-primary border border-red-400/50',
    expired: 'bg-gray-500/30 text-brand-primary border border-gray-400/50',
    refunded: 'bg-amber-600/30 text-amber-200 border border-amber-400/50',
};

/** Variant with light text (e.g. on dark cards): amber-100, yellow-100, etc. */
const BOOKING_STATUS_CLASSES_LIGHT = {
    active: 'bg-amber-500/30 text-amber-100 border border-amber-400/50',
    pending: 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50',
    awaiting_approval: 'bg-orange-500/30 text-orange-100 border border-orange-400/50',
    completed: 'bg-blue-500/30 text-blue-100 border border-blue-400/50',
    cancelled: 'bg-red-500/30 text-red-100 border border-red-400/50',
    expired: 'bg-gray-500/30 text-gray-200 border border-gray-400/50',
    refunded: 'bg-amber-600/30 text-amber-100 border border-amber-400/50',
};

const VEHICLE_STATUS_CLASSES = {
    active: 'bg-amber-500/30 text-brand-primary border border-amber-400/50',
    maintenance: 'bg-yellow-500/30 text-brand-primary border border-yellow-400/50',
    retired: 'bg-gray-500/30 text-brand-primary border border-gray-400/50',
};

const DEFAULT_STATUS_CLASS = 'bg-gray-500/30 text-brand-primary border border-gray-400/50';
const DEFAULT_STATUS_CLASS_LIGHT = 'bg-gray-500/30 text-gray-200 border border-gray-400/50';

export function getBookingStatusColor(status, variant = 'default') {
    const map = variant === 'light' ? BOOKING_STATUS_CLASSES_LIGHT : BOOKING_STATUS_CLASSES;
    const fallback = variant === 'light' ? DEFAULT_STATUS_CLASS_LIGHT : DEFAULT_STATUS_CLASS;
    return status && map[status] ? map[status] : fallback;
}

export function formatBookingStatus(status) {
    if (!status) return '';
    return String(status).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getVehicleStatusColor(status) {
    if (!status) return DEFAULT_STATUS_CLASS;
    return VEHICLE_STATUS_CLASSES[status] ?? DEFAULT_STATUS_CLASS;
}

export function formatVehicleStatus(status) {
    if (!status) return '';
    return String(status).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
