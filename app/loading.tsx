export default function Loading() {
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

            <div className="relative z-10 flex flex-col items-center" style={{ gap: 28 }}>
                {/* Eyebrow with hairlines */}
                <div
                    className="flex items-center uppercase"
                    style={{
                        gap: 14,
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 10,
                        letterSpacing: '0.42em',
                        color: 'rgba(232,199,122,0.65)',
                    }}
                >
                    <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
                    Privada
                    <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
                </div>

                {/* Spinner ring + orbiting diamond + center diamond */}
                <div className="relative" style={{ width: 96, height: 96 }}>
                    {/* Outer rotating ring (slow) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            borderRadius: '50%',
                            border: '1px solid rgba(212,175,55,0.18)',
                            animation:
                                'priv-loader-spin 8s linear infinite, priv-loader-pulse 3.2s ease-in-out infinite',
                        }}
                    />
                    {/* Inner conic-gradient ring (fast) — the metallic spinner */}
                    <div
                        className="absolute"
                        style={{
                            inset: 8,
                            borderRadius: '50%',
                            background:
                                'conic-gradient(from 0deg, transparent 0deg, rgba(232,199,122,0.05) 90deg, #C9A24A 250deg, #F2E5B8 320deg, transparent 360deg)',
                            WebkitMask: 'radial-gradient(circle, transparent 56%, #000 57%)',
                            mask: 'radial-gradient(circle, transparent 56%, #000 57%)',
                            animation: 'priv-loader-spin 1.6s cubic-bezier(0.6, 0.05, 0.4, 0.95) infinite',
                            filter: 'drop-shadow(0 0 12px rgba(232,199,122,0.45))',
                        }}
                    />
                    {/* Counter-rotating tick marks */}
                    <div
                        className="absolute inset-0"
                        style={{
                            borderRadius: '50%',
                            background:
                                'conic-gradient(from 0deg, rgba(232,199,122,0.3) 0deg 1deg, transparent 1deg 30deg, rgba(232,199,122,0.15) 30deg 31deg, transparent 31deg 60deg, rgba(232,199,122,0.3) 60deg 61deg, transparent 61deg 90deg, rgba(232,199,122,0.15) 90deg 91deg, transparent 91deg 120deg, rgba(232,199,122,0.3) 120deg 121deg, transparent 121deg 150deg, rgba(232,199,122,0.15) 150deg 151deg, transparent 151deg 180deg, rgba(232,199,122,0.3) 180deg 181deg, transparent 181deg 210deg, rgba(232,199,122,0.15) 210deg 211deg, transparent 211deg 240deg, rgba(232,199,122,0.3) 240deg 241deg, transparent 241deg 270deg, rgba(232,199,122,0.15) 270deg 271deg, transparent 271deg 300deg, rgba(232,199,122,0.3) 300deg 301deg, transparent 301deg 330deg, rgba(232,199,122,0.15) 330deg 331deg, transparent 331deg 360deg)',
                            WebkitMask: 'radial-gradient(circle, transparent 64%, #000 65%, #000 70%, transparent 71%)',
                            mask: 'radial-gradient(circle, transparent 64%, #000 65%, #000 70%, transparent 71%)',
                            animation: 'priv-loader-spin-rev 18s linear infinite',
                            opacity: 0.7,
                        }}
                    />
                    {/* Orbiting gold diamond */}
                    <div
                        className="absolute"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: 8,
                            height: 8,
                            margin: '-4px 0 0 -4px',
                            transform: 'rotate(0deg) translateY(-44px) rotate(0deg)',
                            animation: 'priv-loader-orbit 2.6s cubic-bezier(0.6, 0.05, 0.4, 0.95) infinite',
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                background: '#F2E5B8',
                                transform: 'rotate(45deg)',
                                boxShadow: '0 0 14px rgba(232,199,122,0.85), 0 0 4px rgba(255,255,255,0.6)',
                            }}
                        />
                    </div>
                    {/* Center diamond — still */}
                    <div
                        className="absolute"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: 10,
                            height: 10,
                            margin: '-5px 0 0 -5px',
                            background: '#E8C77A',
                            transform: 'rotate(45deg)',
                            boxShadow:
                                '0 0 12px rgba(232,199,122,0.6), inset 0 0 4px rgba(255,255,255,0.4)',
                        }}
                    />
                </div>

                {/* Las Privadas wordmark — gold shimmer */}
                <h1
                    className="priv-hero-title m-0"
                    style={{
                        fontFamily: 'Rye, serif',
                        fontSize: 32,
                        letterSpacing: '0.06em',
                        lineHeight: 1.0,
                        background:
                            'linear-gradient(100deg, #8F6A1F 0%, #C9A24A 25%, #F2E5B8 50%, #C9A24A 75%, #8F6A1F 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        filter:
                            'drop-shadow(0 1px 0 rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(232,199,122,0.30))',
                    }}
                >
                    Las Privadas
                </h1>

                {/* Caption with animated dots */}
                <div
                    className="priv-loader-dots uppercase"
                    style={{
                        fontFamily: 'Playfair Display, serif',
                        fontStyle: 'italic',
                        fontSize: 12,
                        letterSpacing: '0.42em',
                        color: 'rgba(252,246,186,0.55)',
                        textTransform: 'uppercase',
                        animation: 'priv-loader-fade-up 800ms cubic-bezier(0.16,1,0.3,1) 200ms both',
                    }}
                >
                    Preparando la privada
                </div>
            </div>
        </div>
    )
}
