/**
 * Default matches config('app.timezone') / APP_TIMEZONE when unset in Inertia.
 */
export const DEFAULT_TIMEZONE = 'America/Los_Angeles';

function isWallClockTimeOnlyString(timeString) {
    if (typeof timeString !== 'string') return false;
    const s = timeString.trim();
    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(s) && s.length <= 8;
}

function formatWallClock12h(timeString) {
    const parts = timeString.trim().split(':');
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] ?? '0', 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return timeString;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * @param {string|number|Date|null|undefined} timeString
 * @param {string} timezone IANA zone from Inertia shared props
 * @param {string} emptyValue when input is null/undefined/empty string
 */
export function formatDistrictTime(timeString, timezone = DEFAULT_TIMEZONE, emptyValue = '') {
    if (timeString === null || timeString === undefined || timeString === '') {
        return emptyValue;
    }
    try {
        if (typeof timeString === 'string' && isWallClockTimeOnlyString(timeString)) {
            return formatWallClock12h(timeString);
        }

        let date;
        if (typeof timeString === 'string') {
            if (timeString.includes('T') || timeString.includes(' ')) {
                date = new Date(timeString);
            } else if (timeString.includes(':') && timeString.length <= 8) {
                return formatWallClock12h(timeString);
            } else {
                return timeString;
            }
        } else {
            date = new Date(timeString);
        }

        if (Number.isNaN(date.getTime())) {
            return typeof timeString === 'string' ? timeString : emptyValue;
        }

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone,
        });
    } catch {
        return typeof timeString === 'string' ? timeString : emptyValue;
    }
}

/**
 * Calendar date in the district zone (helps YYYY-MM-DD strings parse consistently).
 */
export function formatDistrictDate(dateString, timezone = DEFAULT_TIMEZONE, emptyValue = '') {
    if (dateString === null || dateString === undefined || dateString === '') {
        return emptyValue;
    }
    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return typeof dateString === 'string' ? dateString : emptyValue;
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: timezone,
        });
    } catch {
        return typeof dateString === 'string' ? dateString : emptyValue;
    }
}
