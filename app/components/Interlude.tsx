"use client"

interface InterludeProps {
    progress: number
}

export default function Interlude({ progress }: InterludeProps) {
    return (
        <section
            className="relative z-[2] text-center"
            style={{
                padding: '40px 32px 120px',
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
                    fontFamily: 'Sancreek, cursive',
                    fontSize: 10,
                    letterSpacing: '0.42em',
                    color: 'rgba(232,199,122,0.65)',
                    marginBottom: 22,
                }}
            >
                <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
                La privada continúa
                <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.5 }} />
            </div>
            <h2
                className="m-0"
                style={{
                    fontFamily: 'Sancreek, cursive',
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
                    Tu noche
                </em>
                , hecha a mano.
            </h2>
            <p
                className="mx-auto italic"
                style={{
                    margin: '20px auto 0',
                    maxWidth: 540,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'rgba(252,246,186,0.65)',
                }}
            >
                Cada artista, cada espacio y cada detalle — curado para que la música
                suene exactamente como la imaginaste.
            </p>
        </section>
    )
}
