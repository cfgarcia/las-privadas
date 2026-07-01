'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            style={{ background: '#0a0503' }}
        >
            {/* Espresso radial vignette — matches the main stage */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 30%, #2c1810 0%, #1a0f0a 50%, #0a0503 100%)',
                }}
            />
            {/* Warm gold spotlight */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '12%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    height: '70%',
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 30%, transparent 60%)',
                }}
            />
            {/* Paper grain */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    opacity: 0.12,
                    backgroundImage:
                        'url(https://www.transparenttextures.com/patterns/stardust.png)',
                }}
            />
            {/* Outer vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)',
                }}
            />

            <div className="relative z-10 text-center px-6 w-full max-w-xl">
                {/* Eyebrow with flanking hairlines */}
                <div
                    className="flex items-center justify-center uppercase"
                    style={{
                        gap: 14,
                        fontFamily: 'var(--font-accent), cursive',
                        fontSize: 11,
                        letterSpacing: '0.36em',
                        color: 'rgba(252,246,186,0.55)',
                        marginBottom: 24,
                    }}
                >
                    <span className="block h-px" style={{ flex: '0 0 80px', background: 'rgba(212,175,55,0.45)' }} />
                    <span>Privada · Algo no jaló</span>
                    <span className="block h-px" style={{ flex: '0 0 80px', background: 'rgba(212,175,55,0.45)' }} />
                </div>

                <div className="priv-hero-animated relative inline-block px-2">
                    {/* Ghost backdrop — faded glyph behind the title */}
                    <div
                        aria-hidden="true"
                        className="priv-hero-ghost absolute pointer-events-none select-none whitespace-nowrap"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -52%)',
                            fontFamily: 'var(--font-accent), cursive',
                            fontSize: 'clamp(140px, 22vw, 320px)',
                            letterSpacing: '0.04em',
                            lineHeight: 1,
                            color: 'rgba(232,199,122,0.06)',
                            textShadow: '0 0 60px rgba(232,199,122,0.15)',
                            zIndex: 0,
                        }}
                    >
                        ERROR
                    </div>

                    {/* Gold-ink title with shimmer */}
                    <h1
                        className="priv-hero-title relative m-0"
                        style={{
                            zIndex: 1,
                            fontFamily: 'var(--font-western), serif',
                            fontSize: 'clamp(56px, 8vw, 112px)',
                            letterSpacing: '0.04em',
                            lineHeight: 1.0,
                            background: 'linear-gradient(100deg, #8F6A1F 0%, #C9A24A 25%, #F2E5B8 50%, #C9A24A 75%, #8F6A1F 100%)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                            filter: 'drop-shadow(0 3px 0 rgba(0,0,0,0.55)) drop-shadow(0 0 36px rgba(232,199,122,0.30))',
                        }}
                    >
                        Algo no jaló.
                    </h1>

                    {/* Hand-drawn flourish underline */}
                    <svg
                        className="priv-hero-flourish relative block mx-auto mt-1.5"
                        viewBox="0 0 600 40"
                        preserveAspectRatio="none"
                        style={{ zIndex: 1, width: '88%', height: 32, overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient id="flourishGradError" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8F6A1F" stopOpacity="0" />
                                <stop offset="15%" stopColor="#C9A24A" stopOpacity="1" />
                                <stop offset="50%" stopColor="#F2E5B8" stopOpacity="1" />
                                <stop offset="85%" stopColor="#C9A24A" stopOpacity="1" />
                                <stop offset="100%" stopColor="#8F6A1F" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 20 22 Q 80 4, 160 18 T 300 16 T 440 20 T 580 14"
                            fill="none"
                            stroke="url(#flourishGradError)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(232,199,122,0.55))' }}
                        />
                    </svg>
                </div>

                <p
                    className="priv-hero-sub mx-auto italic"
                    style={{
                        margin: '28px auto 0',
                        maxWidth: 480,
                        fontFamily: 'var(--font-body), serif',
                        fontSize: 16,
                        lineHeight: 1.55,
                        color: 'rgba(252,246,186,0.65)',
                    }}
                >
                    Tuvimos un problema. Intenta otra vez o regresa al catálogo.
                </p>

                <div
                    className="priv-hero-sub flex flex-col sm:flex-row gap-3 justify-center items-center"
                    style={{ marginTop: 36 }}
                >
                    {/* Primary — retry */}
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center uppercase transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                            gap: 10,
                            padding: '12px 28px',
                            fontFamily: 'var(--font-accent), cursive',
                            fontSize: 12,
                            letterSpacing: '0.28em',
                            color: '#0a0503',
                            border: '1px solid rgba(212,175,55,0.65)',
                            background: 'linear-gradient(180deg, #F2E5B8 0%, #C9A24A 100%)',
                            boxShadow:
                                '0 0 22px rgba(232,199,122,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                        }}
                    >
                        Intentar otra vez
                    </button>

                    {/* Secondary — back home */}
                    <Link
                        href="/"
                        className="inline-flex items-center uppercase transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                            gap: 10,
                            padding: '12px 28px',
                            fontFamily: 'var(--font-accent), cursive',
                            fontSize: 12,
                            letterSpacing: '0.28em',
                            color: '#fcf6ba',
                            border: '1px solid rgba(212,175,55,0.45)',
                            background: 'rgba(20,12,8,0.65)',
                            backdropFilter: 'blur(6px)',
                            boxShadow:
                                '0 0 18px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                    >
                        Volver al catálogo
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
