/** Mirrors App\Models\Route::serviceTypeLabels() for Inertia/JS surfaces. */
export const ROUTE_SERVICE_TYPE_OPTIONS = [
    { value: 'am', label: 'One Way Route Pickup Only' },
    { value: 'pm', label: 'One Way Route Pickup Only' },
    { value: 'both', label: 'Two Way Pickup and Dropoff' },
];

const LABEL_MAP = Object.fromEntries(ROUTE_SERVICE_TYPE_OPTIONS.map((o) => [o.value, o.label]));

export function routeServiceTypeLabel(value) {
    if (value === null || value === undefined || value === '') {
        return '';
    }
    return LABEL_MAP[value] ?? value;
}
