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

// Track if we're already handling a 419 error to prevent multiple dialogs
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
            // Refresh the page to get a new CSRF token
            console.warn('CSRF token mismatch detected. Refreshing page...');
            
            // Show a more user-friendly message
            const message = 'Your session has expired due to inactivity. The page will refresh to log you back in.';
            
            // Use a timeout to show message briefly before reload
            setTimeout(() => {
                alert(message);
                window.location.reload();
            }, 100);
        }
        return Promise.reject(error);
    }
);

// Keep-alive mechanism: ping server every 5 minutes to keep session active
let keepAliveInterval = null;
let lastActivityTime = Date.now();

// Function to send keep-alive ping
const sendKeepAlivePing = async () => {
    try {
        // Only send if user has been active in last 30 minutes
        const timeSinceActivity = Date.now() - lastActivityTime;
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeSinceActivity < thirtyMinutes) {
            await axios.get('/api/keep-alive', {
                headers: {
                    'X-Keep-Alive': 'true'
                }
            }).catch(() => {
                // Silently fail - don't disrupt user experience
            });
        }
    } catch (error) {
        // Silently fail
    }
};

// Track user activity
const updateActivityTime = () => {
    lastActivityTime = Date.now();
};

// Listen for user activity
if (typeof document !== 'undefined') {
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, updateActivityTime, { passive: true });
    });
}

// Start keep-alive interval (every 5 minutes)
if (typeof window !== 'undefined') {
    keepAliveInterval = setInterval(sendKeepAlivePing, 5 * 60 * 1000);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
        }
    });
}
