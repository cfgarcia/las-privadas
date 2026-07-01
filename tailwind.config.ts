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
                // Espresso/saddle leather — the surface story.
                leather: {
                    DEFAULT: '#5D4037', // Deep Saddle Brown
                    light: '#8D6E63',
                    dark: '#3E2723',
                    mid: '#2c1810',
                    night: '#1a0f0a',
                    deepest: '#271c19',
                },
                cream: {
                    DEFAULT: '#FDFBF7', // Warm Cream
                    dark: '#F5F5DC', // Beige
                    text: '#fcf6ba', // Cream-yellow text on espresso
                },
                // Single canonical gold family (resolves the prior #D4AF37 vs
                // #C9A24A drift — components/CSS-vars already used this set).
                gold: {
                    DEFAULT: '#C9A24A',
                    light: '#E8C77A',
                    dark: '#8F6A1F',
                    pale: '#F2E5B8',
                    deep: '#6B4A12',
                },
                denim: {
                    DEFAULT: '#2C3E50', // Dark Denim
                    light: '#34495E',
                },
            },
            fontFamily: {
                // Driven by next/font CSS variables (see app/layout.tsx).
                western: ['var(--font-western)', 'serif'],
                display: ['var(--font-accent)', 'cursive'],
                body: ['var(--font-body)', 'serif'],
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
