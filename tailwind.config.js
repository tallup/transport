import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1.5rem',
                lg: '2rem',
                xl: '2.5rem',
                '2xl': '3rem',
            },
        },
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    primary: '#1f2f4f',
                    secondary: '#15233f',
                    light: '#ecf3fb',
                    yellow: '#FFEB3B',
                },
                surface: {
                    page: '#f8f7f3',
                    card: '#ffffff',
                    elevated: '#ffffff',
                    subtle: '#f3f4f6',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#334155',
                    muted: '#64748b',
                    inverse: '#f8fafc',
                },
                accent: {
                    primary: '#3159c9',
                    success: '#0f766e',
                    warning: '#b45309',
                    danger: '#b91c1c',
                },
            },
            borderRadius: {
                xl: '0.875rem',
                '2xl': '1.125rem',
            },
            boxShadow: {
                soft: '0 1px 2px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.06)',
                panel: '0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.08)',
                nav: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 20px rgba(15, 23, 42, 0.08)',
            },
        },
    },

    plugins: [forms],
};
