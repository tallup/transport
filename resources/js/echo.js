/**
 * Laravel Echo + Reverb for real-time updates.
 * Requires VITE_REVERB_APP_KEY, VITE_REVERB_HOST, VITE_REVERB_PORT, VITE_REVERB_SCHEME in .env
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST || 'localhost';
const port = import.meta.env.VITE_REVERB_PORT || '8080';
const scheme = (import.meta.env.VITE_REVERB_SCHEME || 'http').toLowerCase();
const useTLS = scheme === 'https';

export function getEcho() {
    if (window.Echo) {
        return window.Echo;
    }
    if (!key || !host) {
        return null;
    }
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: useTLS,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: {
                'X-XSRF-TOKEN': getCsrfToken(),
                Accept: 'application/json',
            },
        },
    });
    return window.Echo;
}

function getCsrfToken() {
    const tag = document.querySelector('meta[name="csrf-token"]');
    if (tag) return tag.getAttribute('content') || '';
    const name = 'XSRF-TOKEN';
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : '';
}

export default getEcho;
