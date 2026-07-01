// Loading screen — a single, coherent Titan cassette-seal motif.
// The only motion is the two reels turning (priv-loader-spin); under
// prefers-reduced-motion the global contract freezes them and the mark stays
// on-brand. Server Component (no client deps); shown as a sub-second flash.

const REEL_SPOKES = [0, 60, 120, 180, 240, 300]

function Reel({ cx, cy }: { cx: number; cy: number }) {
    const ringR = 21
    const spokeR = 17
    return (
        <g>
            {/* Static outer ring + drive ring */}
            <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="rgba(232,199,122,0.55)" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={ringR - 5} fill="none" stroke="rgba(232,199,122,0.22)" strokeWidth={1} />
            {/* Rotating hub + spokes — the cassette "playing" */}
            <g
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: 'priv-loader-spin 2.6s linear infinite',
                }}
            >
                {REEL_SPOKES.map((deg) => {
                    const rad = (deg * Math.PI) / 180
                    return (
                        <line
                            key={deg}
                            x1={cx}
                            y1={cy}
                            x2={cx + spokeR * Math.cos(rad)}
                            y2={cy + spokeR * Math.sin(rad)}
                            stroke="#C9A24A"
                            strokeWidth={2}
                            strokeLinecap="round"
                        />
                    )
                })}
                <circle cx={cx} cy={cy} r={7} fill="#E8C77A" />
                <circle cx={cx} cy={cy} r={2.5} fill="#0a0503" />
            </g>
        </g>
    )
}

export default function Loading() {
    return (
        <div
            role="status"
            aria-label="Cargando Las Privadas"
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            style={{ background: '#0a0503' }}
        >
            {/* Espresso radial vignette — matches the main stage */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 38%, #2c1810 0%, #1a0f0a 52%, #0a0503 100%)',
                }}
            />
            {/* Single film-grain layer */}
            <div className="priv-grain" />
            {/* Outer vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.5) 100%)',
                }}
            />

            <div className="relative z-10 flex flex-col items-center" style={{ gap: 26 }}>
                {/* Cassette */}
                <svg
                    width="232"
                    height="146"
                    viewBox="0 0 240 150"
                    fill="none"
                    aria-hidden="true"
                    style={{ filter: 'drop-shadow(0 0 28px rgba(232,199,122,0.18))' }}
                >
                    {/* Body */}
                    <rect x={4} y={4} width={232} height={142} rx={14} fill="#221510" stroke="#C9A24A" strokeWidth={2} />
                    <rect x={12} y={12} width={216} height={126} rx={10} fill="none" stroke="rgba(232,199,122,0.25)" strokeWidth={1} />
                    {/* Label strip */}
                    <rect x={28} y={22} width={184} height={30} rx={5} fill="rgba(232,199,122,0.06)" stroke="rgba(232,199,122,0.4)" strokeWidth={1} />
                    <line x1={38} y1={33} x2={202} y2={33} stroke="rgba(232,199,122,0.3)" strokeWidth={1} />
                    <line x1={38} y1={42} x2={170} y2={42} stroke="rgba(232,199,122,0.22)" strokeWidth={1} />
                    {/* Tape window */}
                    <rect x={40} y={64} width={160} height={58} rx={10} fill="#140c07" stroke="rgba(232,199,122,0.5)" strokeWidth={1.5} />
                    {/* Tape band spanning the reels */}
                    <rect x={84} y={87} width={72} height={12} fill="rgba(232,199,122,0.10)" />
                    {/* Reels */}
                    <Reel cx={84} cy={93} />
                    <Reel cx={156} cy={93} />
                    {/* Drive holes */}
                    <circle cx={70} cy={134} r={4.5} fill="#0a0503" stroke="rgba(232,199,122,0.45)" strokeWidth={1} />
                    <circle cx={170} cy={134} r={4.5} fill="#0a0503" stroke="rgba(232,199,122,0.45)" strokeWidth={1} />
                </svg>

                {/* Las Privadas wordmark — gold shimmer */}
                <h1
                    className="priv-hero-title m-0"
                    style={{
                        fontFamily: 'var(--font-western), serif',
                        fontSize: 30,
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
                            'drop-shadow(0 1px 0 rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(232,199,122,0.28))',
                    }}
                >
                    Las Privadas
                </h1>

                {/* Titan tagline */}
                <div
                    className="uppercase flex items-center"
                    style={{
                        gap: 12,
                        fontFamily: 'var(--font-accent), cursive',
                        fontSize: 11,
                        letterSpacing: '0.4em',
                        color: 'rgba(242,229,184,0.7)',
                    }}
                >
                    <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.5 }} />
                    El Sonido del Éxito
                    <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.5 }} />
                </div>
            </div>
        </div>
    )
}
