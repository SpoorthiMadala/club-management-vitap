/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f3ef',
                    100: '#d9d0b4',
                    200: '#c9bd9f',
                    300: '#b9aa8a',
                    400: '#a99775',
                    500: '#998460',
                    600: '#7d6b57',
                    700: '#66574a',
                    800: '#4f433d',
                    900: '#382f30',
                },
                secondary: {
                    50: '#f0f3f1',
                    100: '#879e82',
                    200: '#758f70',
                    300: '#63805e',
                    400: '#51714c',
                    500: '#3f623a',
                    600: '#666b5e',
                    700: '#545850',
                    800: '#424542',
                    900: '#303234',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
