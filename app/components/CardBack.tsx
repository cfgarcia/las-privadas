"use client"

const W = 380
const H = 560

export default function CardBack() {
    const corners: React.CSSProperties[] = [
        { top: 14, left: 14, borderTop: '1px solid', borderLeft: '1px solid' },
        { top: 14, right: 14, borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: 14, left: 14, borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: 14, right: 14, borderBottom: '1px solid', borderRight: '1px solid' },
    ]

    return (
        <div
            className="relative overflow-hidden"
            style={{
                width: W,
                height: H,
                borderRadius: 4,
                background: 'linear-gradient(140deg, #2a1a10 0%, #1a0e08 50%, #0a0503 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.40), 0 22px 60px rgba(0,0,0,0.65)',
                isolation: 'isolate',
            }}
        >
            {corners.map((c, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{ width: 28, height: 28, borderColor: 'rgba(232,199,122,0.65)', ...c }}
                />
            ))}

            {/* Damask radial-dot pattern */}
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: 30,
                    opacity: 0.18,
                    backgroundImage: 'radial-gradient(rgba(232,199,122,0.9) 1px, transparent 1.5px)',
                    backgroundSize: '12px 12px',
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Center plaque */}
            <div
                className="absolute flex flex-col items-center text-center"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    gap: 14,
                }}
            >
                <div
                    style={{
                        width: 14,
                        height: 14,
                        transform: 'rotate(45deg)',
                        background: '#E8C77A',
                        boxShadow: '0 0 14px rgba(232,199,122,0.55)',
                    }}
                />
                <div
                    style={{
                        fontFamily: 'var(--font-western), serif',
                        fontSize: 20,
                        lineHeight: 1.0,
                        letterSpacing: '0.08em',
                        color: '#fcf6ba',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    }}
                >
                    Las Privadas
                </div>
                <div style={{ width: 64, height: 1, background: 'rgba(232,199,122,0.55)' }} />
                <div
                    className="uppercase"
                    style={{
                        fontFamily: 'var(--font-accent), cursive',
                        fontSize: 9,
                        letterSpacing: '0.42em',
                        color: 'rgba(232,199,122,0.75)',
                    }}
                >
                    Privada en sesión
                </div>
            </div>

            {/* Subtle vertical sheen */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(105deg, rgba(232,199,122,0) 40%, rgba(232,199,122,0.10) 50%, rgba(232,199,122,0) 60%)',
                }}
            />
        </div>
    )
}
