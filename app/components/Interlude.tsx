"use client"

import { useLanguage } from "../context/LanguageContext"

interface InterludeProps {
    progress: number
}

export default function Interlude({ progress }: InterludeProps) {
    const { t } = useLanguage()
    const copy = t.home.interlude
    return (
        <section
            className="relative z-[2] text-center"
            style={{
                padding: '40px clamp(20px, 6vw, 32px) clamp(48px, 13vw, 120px)',
                opacity: progress,
                transform: `translateY(${(1 - progress) * 40}px)`,
                pointerEvents: progress > 0.05 ? 'auto' : 'none',
                willChange: 'opacity, transform',
            }}
        >
            <div
                className="inline-flex items-center uppercase"
                style={{
                    gap: 14,
                    fontFamily: 'var(--font-accent), cursive',
                    fontSize: 10,
                    letterSpacing: '0.42em',
                    color: 'rgba(232,199,122,0.65)',
                    marginBottom: 22,
                }}
            >
                <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
                {copy.eyebrow}
                <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
            </div>
            <h2
                className="m-0"
                style={{
                    fontFamily: 'var(--font-accent), cursive',
                    fontSize: 'clamp(40px, 5vw, 72px)',
                    lineHeight: 1.0,
                    letterSpacing: '-0.01em',
                    fontWeight: 400,
                    color: '#fcf6ba',
                    maxWidth: 880,
                    marginInline: 'auto',
                }}
            >
                <em className="italic" style={{ color: '#E8C77A' }}>
                    {copy.title_em}
                </em>
                {copy.title_rest}
            </h2>
            <p
                className="mx-auto italic"
                style={{
                    margin: '20px auto 0',
                    maxWidth: 540,
                    fontFamily: 'var(--font-body), serif',
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'rgba(242,229,184,0.82)',
                }}
            >
                {copy.body}
            </p>
        </section>
    )
}
