import type { Metadata } from "next";
import { Rye, Playfair_Display, Sancreek } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

// Self-hosted via next/font (no render-blocking @import). Each font exposes a
// CSS variable consumed by Tailwind (`font-western`/`body`/`display`) and by the
// inline `fontFamily: 'var(--font-*)'` references throughout the app.
const rye = Rye({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-western",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const sancreek = Sancreek({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Las Privadas — Reserva tu artista",
  description: "Corridos, banda y norteño en vivo. Elige tu artista y llévalo a tu privada.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${rye.variable} ${playfair.variable} ${sancreek.variable}`}
    >
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
