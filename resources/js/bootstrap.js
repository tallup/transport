import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to update CSRF token
const updateCsrfToken = () => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        return token.content;
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
        return null;
    }
};

// Set initial CSRF token
updateCsrfToken();

// Add request interceptor to refresh CSRF token before each request
window.axios.interceptors.request.use(
    (config) => {
        // Refresh token before each request
        updateCsrfToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Track if we're already handling a 419 error to prevent multiple redirects
let handling419 = false;

// Add response interceptor to handle CSRF token mismatch (419 errors)
window.axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle CSRF token mismatch
        if (error.response?.status === 419 && !handling419) {
            handling419 = true;
            // Redirect to login silently on session expiration
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Keep-alive mechanism: ping server periodically to keep session active
let keepAliveInterval = null;
const KEEP_ALIVE_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

const sendKeepAlivePing = async () => {
    try {
        await axios.get('/api/keep-alive', {
            headers: {
                'X-Keep-Alive': 'true',
            },
        }).catch(() => {
            // Silently fail - don't disrupt user experience
        });
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

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
        }
    });
}
