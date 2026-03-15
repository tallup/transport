import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { registerServiceWorker, subscribeToPushNotifications } from './utils/serviceWorkerRegistration';
import offlineManager from './utils/offlineManager';
import ErrorBoundary from './Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'On-Time Transportation';

// Track authenticated GET requests so we can retry with a full page load
// if an XHR GET gets redirected to /login (cookie not sent on some proxies).
// NOTE: We deliberately do NOT inject X-CSRF-TOKEN from the meta tag for
// non-GET requests. The meta tag becomes stale after session regeneration
// (e.g. after login) and would cause 419 CSRF mismatches. Axios automatically
// sends the always-fresh XSRF-TOKEN cookie as X-XSRF-TOKEN, which is the
// correct and reliable mechanism.
router.on('before', (event) => {
    if (event.detail.visit.method === 'get') {
        // Remember the URL we're requesting for GET (so we can retry with full page load if we get redirected to login)
        const url = event.detail.visit.url;
        if (url && !url.includes('/login') && (url.startsWith('/parent/') || url.startsWith('/admin/') || url.startsWith('/driver/'))) {
            try {
                sessionStorage.setItem('inertia_last_get_url', url);
            } catch (_) {}
        }
    }
});

// If a GET to an authenticated page redirected to login (session/cookie not sent on XHR), retry once with full page load
router.on('finish', (event) => {
    try {
        const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
        if (!isLoginPage) {
            sessionStorage.removeItem('inertia_last_get_url');
            sessionStorage.removeItem('inertia_get_retried');
            return;
        }
        if (event.detail.visit.method !== 'get') return;
        const lastGetUrl = sessionStorage.getItem('inertia_last_get_url');
        const alreadyRetried = sessionStorage.getItem('inertia_get_retried');
        if (lastGetUrl && !alreadyRetried && !lastGetUrl.includes('/login')) {
            sessionStorage.setItem('inertia_get_retried', '1');
            sessionStorage.removeItem('inertia_last_get_url');
            window.location.href = lastGetUrl;
        }
    } catch (_) {}
});

// Clear GET-retry state when app loads on an authenticated page (so future navigations can retry if needed)
try {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        sessionStorage.removeItem('inertia_last_get_url');
        sessionStorage.removeItem('inertia_get_retried');
    }
} catch (_) {}

// Register service worker and initialize PWA features
registerServiceWorker();

// Initialize offline manager
offlineManager.init();

// Subscribe to push notifications if user is authenticated
if (document.querySelector('meta[name="user-id"]')) {
    subscribeToPushNotifications().catch(console.error);
}

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <>
                    <App {...props} />
                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        toastOptions={{
                            style: {
                                borderRadius: '12px',
                            },
                        }}
                    />
                </>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
