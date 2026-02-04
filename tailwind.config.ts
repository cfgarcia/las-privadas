import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                leather: {
                    DEFAULT: '#5D4037', // Deep Saddle Brown
                    light: '#8D6E63',
                    dark: '#3E2723',
                },
                cream: {
                    DEFAULT: '#FDFBF7', // Warm Cream
                    dark: '#F5F5DC', // Beige
                },
                gold: {
                    DEFAULT: '#D4AF37', // Classic Gold
                    light: '#F4C430',
                    dark: '#B8860B',
                },
                denim: {
                    DEFAULT: '#2C3E50', // Dark Denim
                    light: '#34495E',
                },
            },
            fontFamily: {
                western: ['Rye', 'serif'],
                display: ['Sancreek', 'cursive'],
                body: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "leather-texture": "url('https://www.transparenttextures.com/patterns/black-scales.png')",
            },
        },
    },
    plugins: [],
};
export default config;
