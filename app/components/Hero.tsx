"use client"

export default function Hero() {
    return (
        <div className="relative z-[5] text-center px-6 pt-5 pb-2 w-full">
            {/* Editorial eyebrow flanked by hairlines */}
            <div
                className="flex items-center justify-center gap-[18px] mb-[18px] uppercase"
                style={{
                    fontFamily: 'Sancreek, cursive',
                    fontSize: 11,
                    letterSpacing: '0.36em',
                    color: 'rgba(252,246,186,0.55)',
                }}
            >
                <span className="block h-px" style={{ flex: '0 0 80px', background: 'rgba(212,175,55,0.45)' }} />
                <span>Privada · 2026</span>
                <span className="block h-px" style={{ flex: '0 0 80px', background: 'rgba(212,175,55,0.45)' }} />
            </div>

            <div className="priv-hero-animated relative inline-block px-2">
                {/* Ghost backdrop — large, faded, integrated into bg */}
                <div
                    aria-hidden="true"
                    className="priv-hero-ghost absolute pointer-events-none select-none whitespace-nowrap"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -52%)',
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 'clamp(110px, 16vw, 240px)',
                        letterSpacing: '0.06em',
                        lineHeight: 1,
                        color: 'rgba(232,199,122,0.06)',
                        textShadow: '0 0 60px rgba(232,199,122,0.15)',
                        zIndex: 0,
                    }}
                >
                    RESERVA
                </div>

                {/* Gold-ink title with continuous shimmer wash */}
                <h1
                    className="priv-hero-title relative m-0"
                    style={{
                        zIndex: 1,
                        fontFamily: 'Rye, serif',
                        fontSize: 'clamp(72px, 10vw, 156px)',
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
                    Reserva tu Artista
                </h1>

                {/* Hand-drawn flourish underline that wipes in */}
                <svg
                    className="priv-hero-flourish relative block mx-auto mt-1.5"
                    viewBox="0 0 600 40"
                    preserveAspectRatio="none"
                    style={{ zIndex: 1, width: '88%', height: 36, overflow: 'visible' }}
                >
                    <defs>
                        <linearGradient id="flourishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
                        stroke="url(#flourishGrad)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(232,199,122,0.55))' }}
                    />
                    <path
                        d="M 580 14 L 586 11 L 592 14 L 586 17 Z"
                        fill="#F2E5B8"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(232,199,122,0.7))' }}
                    />
                </svg>

                {/* Italic subtitle */}
                <p
                    className="priv-hero-sub relative mx-auto italic"
                    style={{
                        zIndex: 1,
                        margin: '20px auto 0',
                        maxWidth: 560,
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 17,
                        lineHeight: 1.55,
                        color: 'rgba(252,246,186,0.65)',
                    }}
                >
                    Corridos, banda y norteño para tu próxima privada.
                </p>
            </div>
        </div>
    )
}
