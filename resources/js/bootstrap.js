import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Axios automatically handles the X-XSRF-TOKEN header from the cookie set by Laravel.
// We do NOT need to manually read the meta tag, as it becomes stale in an SPA after login.

// CSRF token mismatch (419) recovery.
// Previously ANY 419 hard-redirected to /login, which logged users out on transient
// token desyncs (e.g. after some idle time or concurrent requests) — the "logged out
// while clicking the menu" bug. Instead, refresh the XSRF-TOKEN cookie via Sanctum and
// retry the original request ONCE. Only send the user to login if recovery genuinely fails.
window.axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 419 && original && !original._csrfRetried) {
            original._csrfRetried = true;
            try {
                await window.axios.get('/sanctum/csrf-cookie');
                return await window.axios(original); // retry with the fresh XSRF-TOKEN cookie
            } catch (_) {
                // Recovery failed — the session is genuinely gone.
                window.location.href = '/login?expired=1';
            }
        }

        return Promise.reject(error);
    }
);

// Keep-alive mechanism: ping server periodically to keep session active
let keepAliveInterval = null;
let lastKeepAliveAt = 0;
const KEEP_ALIVE_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const KEEP_ALIVE_ACTIVITY_MIN_MS = 60 * 1000; // 1 minute

const sendKeepAlivePing = async () => {
    try {
        await axios.get('/api/keep-alive', {
            headers: {
                'X-Keep-Alive': 'true',
            },
        }).catch(() => {
            // Silently fail - don't disrupt user experience
        });
        lastKeepAliveAt = Date.now();
    } catch (error) {
        // Silently fail
    }
};

if (typeof window !== 'undefined') {
    keepAliveInterval = setInterval(sendKeepAlivePing, KEEP_ALIVE_INTERVAL_MS);

    // Ping when tab becomes active again
    window.addEventListener('focus', () => {
        sendKeepAlivePing();
    });

    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                sendKeepAlivePing();
            }
        });
    }

    // Ping on user activity (throttled)
    const activityHandler = () => {
        const now = Date.now();
        if (now - lastKeepAliveAt >= KEEP_ALIVE_ACTIVITY_MIN_MS) {
            sendKeepAlivePing();
        }
    };

    if (typeof document !== 'undefined') {
        ['click', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach((event) => {
            document.addEventListener(event, activityHandler, { passive: true });
        });
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
        }
    });
}
