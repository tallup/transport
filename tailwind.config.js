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
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'brand': {
                    'primary': '#22304d', // Dark blue for text and accents
                    'secondary': '#1a2a47',
                    'light': '#ecf3fb',
                    'yellow': '#FFEB3B', // Bright yellow background from flyer
                },
            },
        },
    },

    plugins: [forms],
};
