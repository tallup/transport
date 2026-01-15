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

// Add response interceptor to handle CSRF token mismatch (419 errors)
window.axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle CSRF token mismatch
        if (error.response?.status === 419) {
            // Refresh the page to get a new CSRF token
            console.warn('CSRF token mismatch detected. Refreshing page...');
            if (confirm('Your session has expired. Please click OK to refresh the page.')) {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);
