import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Refresh CSRF token before every non-GET request
router.on('before', (event) => {
    // Only refresh for POST, PUT, PATCH, DELETE requests
    if (event.detail.visit.method !== 'get') {
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (token) {
            // Update axios defaults
            if (window.axios) {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
            }
            // Update Inertia defaults
            event.detail.visit.headers = event.detail.visit.headers || {};
            event.detail.visit.headers['X-CSRF-TOKEN'] = token.content;
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
