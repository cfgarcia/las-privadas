"use client"

import { useLanguage } from "../context/LanguageContext"

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    const baseStyle: React.CSSProperties = {
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setLanguage("es")}
                style={{
                    ...baseStyle,
                    color: language === "es" ? '#fcf6ba' : 'rgba(252,246,186,0.45)',
                }}
            >
                ES
            </button>
            <span className="block w-px h-3 bg-[rgba(212,175,55,0.30)]" />
            <button
                onClick={() => setLanguage("en")}
                style={{
                    ...baseStyle,
                    color: language === "en" ? '#fcf6ba' : 'rgba(252,246,186,0.45)',
                }}
            >
                EN
            </button>
        </div>
    )
}
