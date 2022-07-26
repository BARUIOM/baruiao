/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#b71c1c',
            },
        },
        boxShadow: {
            sm: '0px 1px 2px 0px rgb(0 0 0 / 0.3), 0px 1px 3px 1px rgb(0 0 0 / 0.15)',
            DEFAULT: '0px 1px 2px 0px rgb(0 0 0 / 0.3), 0px 2px 6px 2px rgb(0 0 0 / 0.15)',
            md: '0px 1px 3px 0px rgb(0 0 0 / 0.3), 0px 4px 8px 3px rgb(0 0 0 / 0.15)',
            lg: '0px 2px 3px 0px rgb(0 0 0 / 0.3), 0px 6px 10px 4px rgb(0 0 0 / 0.15)',
            xl: '0px 4px 4px 0px rgb(0 0 0 / 0.3), 0px 8px 12px 6px rgb(0 0 0 / 0.15)',
            none: 'none',
        },
    },
    plugins: [],
};
