"use client"

import { ReactNode, useState } from "react"

// Custom engraved G — monochrome cream/brass so it sits on the plaque
// without the chromatic clash of Google's multicolor mark.
const GoogleGIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <defs>
            <linearGradient id="lp-g-cream" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff8d6" />
                <stop offset="55%" stopColor="#f3e3a8" />
                <stop offset="100%" stopColor="#c89d3e" />
            </linearGradient>
        </defs>
        {/* engraved shadow */}
        <path
            transform="translate(0.6,0.8)"
            fill="rgba(40,22,8,0.55)"
            d="M16 6.2c2.4 0 4.5.85 6.2 2.45l-2.4 2.4c-1-.9-2.3-1.45-3.8-1.45-3.05 0-5.55 2.55-5.55 5.7s2.5 5.7 5.55 5.7c2.6 0 4.45-1.4 5.05-3.7H16v-3.3h9.05c.1.55.15 1.1.15 1.7 0 5.4-3.7 9.25-9.2 9.25-5.3 0-9.6-4.3-9.6-9.65S10.7 6.2 16 6.2z"
        />
        {/* cream G face */}
        <path
            fill="url(#lp-g-cream)"
            d="M16 6.2c2.4 0 4.5.85 6.2 2.45l-2.4 2.4c-1-.9-2.3-1.45-3.8-1.45-3.05 0-5.55 2.55-5.55 5.7s2.5 5.7 5.55 5.7c2.6 0 4.45-1.4 5.05-3.7H16v-3.3h9.05c.1.55.15 1.1.15 1.7 0 5.4-3.7 9.25-9.2 9.25-5.3 0-9.6-4.3-9.6-9.65S10.7 6.2 16 6.2z"
        />
    </svg>
)

// ── Brass-plaque Google button — submits the wrapping <form>. ────────────────
function BrassGoogleButton() {
    const [hover, setHover] = useState(false)
    const [press, setPress] = useState(false)
    return (
        <button
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false)
                setPress(false)
            }}
            onMouseDown={() => setPress(true)}
            onMouseUp={() => setPress(false)}
            className="relative w-full overflow-hidden uppercase cursor-pointer flex items-center justify-center"
            style={{
                padding: '18px 24px',
                gap: 16,
                background: hover
                    ? 'linear-gradient(180deg, #ffeec6 0%, #e8c77a 40%, #c89d3e 70%, #6b4912 100%)'
                    : 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 35%, #b38728 65%, #5c4018 100%)',
                border: '1px solid rgba(252,246,186,0.55)',
                borderRadius: 2,
                boxShadow: press
                    ? 'inset 0 2px 4px rgba(0,0,0,0.45), 0 1px 0 rgba(252,246,186,0.20)'
                    : hover
                        ? 'inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.55), 0 0 26px rgba(232,199,122,0.45)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.45), 0 5px 14px rgba(0,0,0,0.50)',
                color: '#2a1505',
                fontFamily: 'var(--font-western), serif',
                fontSize: 16,
                letterSpacing: '0.16em',
                transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)',
                transform: press ? 'translateY(1px)' : 'translateY(0)',
                textShadow: '0 1px 0 rgba(255,235,180,0.45)',
            }}
        >
            {/* Sheen sweep on hover */}
            <span
                className="absolute pointer-events-none"
                style={{
                    top: 0,
                    bottom: 0,
                    left: hover ? '110%' : '-30%',
                    width: '40%',
                    background:
                        'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                    transition: 'left 700ms cubic-bezier(0.16,1,0.3,1)',
                }}
            />
            <span
                className="relative flex items-center justify-center"
                style={{ width: 26, height: 26 }}
            >
                <GoogleGIcon size={24} />
            </span>
            <span className="relative">Continuar con Google</span>
        </button>
    )
}

// ── Guest link — creamier dotted-underline style. Renders either a client
//    button (modal use) or a form-wrapped submit (page use, server action). ──
export function GuestLink({
    onClick,
    formAction,
}: {
    onClick?: () => void
    formAction?: () => Promise<void> | void
}) {
    const [hover, setHover] = useState(false)
    const baseStyle: React.CSSProperties = {
        background: 'transparent',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        color: hover ? '#fff8d6' : '#fcf6ba',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        letterSpacing: 'inherit',
        textTransform: 'inherit' as const,
        fontWeight: 500,
        transition: 'color 200ms, border-color 200ms',
        borderBottom: `1px dotted ${hover ? '#E8C77A' : 'rgba(252,246,186,0.65)'}`,
        paddingBottom: 2,
        textShadow: '0 1px 0 rgba(0,0,0,0.45)',
    }
    const label = 'Echar un vistazo como invitado'
    if (formAction) {
        return (
            <form action={formAction} className="inline">
                <button
                    type="submit"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={baseStyle}
                >
                    {label}
                </button>
            </form>
        )
    }
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={baseStyle}
        >
            {label}
        </button>
    )
}

// ── The plaque card. Used by both the modal and the standalone /login page. ──
interface LoginCardProps {
    googleAction: () => Promise<void> | void
    guestSlot: ReactNode
    onClose?: () => void
    isMember?: boolean
    compact?: boolean
}

export default function LoginCard({
    googleAction,
    guestSlot,
    onClose,
    isMember = false,
    compact = false,
}: LoginCardProps) {
    const W = compact ? 460 : 520

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
                padding: compact ? '40px 44px 32px' : '52px 56px 40px',
                background: 'linear-gradient(155deg, #2a1a10 0%, #1a0e08 55%, #0d0805 100%)',
                boxShadow: [
                    'inset 0 0 0 1px rgba(232,199,122,0.45)',
                    'inset 0 0 60px rgba(0,0,0,0.45)',
                    '0 30px 80px rgba(0,0,0,0.65)',
                    '0 0 0 1px rgba(0,0,0,0.4)',
                ].join(', '),
                color: '#fcf6ba',
                fontFamily: 'var(--font-body), serif',
                isolation: 'isolate',
            }}
        >
            {/* Paper grain */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    opacity: 0.10,
                    backgroundImage:
                        'url(https://www.transparenttextures.com/patterns/stardust.png)',
                }}
            />
            {/* Spotlight halo from above */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: -120,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 480,
                    height: 280,
                    background:
                        'radial-gradient(ellipse at 50% 100%, rgba(232,199,122,0.25), transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />

            {/* Gold corner brackets */}
            {corners.map((s, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        width: 24,
                        height: 24,
                        borderColor: 'rgba(232,199,122,0.65)',
                        ...s,
                    }}
                />
            ))}

            {/* Close X — only when modal */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute flex items-center justify-center cursor-pointer"
                    style={{
                        top: 18,
                        right: 18,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '1px solid rgba(232,199,122,0.30)',
                        color: 'rgba(232,199,122,0.65)',
                        fontSize: 14,
                        lineHeight: 1,
                        transition: 'all 200ms',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(232,199,122,0.65)'
                        e.currentTarget.style.color = '#E8C77A'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(232,199,122,0.30)'
                        e.currentTarget.style.color = 'rgba(232,199,122,0.65)'
                    }}
                >
                    ×
                </button>
            )}

            {/* Eyebrow */}
            <div
                className="text-center uppercase"
                style={{
                    fontFamily: 'var(--font-accent), cursive',
                    fontSize: 10,
                    letterSpacing: '0.42em',
                    color: 'rgba(232,199,122,0.65)',
                    marginBottom: 18,
                }}
            >
                Privada en sesión · Acceso
            </div>

            {/* Wordmark — gradient gold */}
            <h1
                className="m-0 text-center"
                style={{
                    fontFamily: 'var(--font-western), serif',
                    fontSize: compact ? 38 : 44,
                    lineHeight: 1.0,
                    letterSpacing: '0.02em',
                    background:
                        'linear-gradient(180deg, #fcf6ba 0%, #E8C77A 50%, #996515 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 1px 0 rgba(0,0,0,0.6)',
                }}
            >
                Las Privadas
            </h1>

            {/* Hairline + diamond rule */}
            <div
                className="flex items-center justify-center"
                style={{ gap: 12, marginTop: 18, marginBottom: 18 }}
            >
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 100,
                        background:
                            'linear-gradient(to right, transparent, rgba(232,199,122,0.40), transparent)',
                    }}
                />
                <div
                    style={{
                        width: 7,
                        height: 7,
                        transform: 'rotate(45deg)',
                        background: '#E8C77A',
                        boxShadow: '0 0 10px rgba(232,199,122,0.55)',
                    }}
                />
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 100,
                        background:
                            'linear-gradient(to right, transparent, rgba(232,199,122,0.40), transparent)',
                    }}
                />
            </div>

            {/* Italic prompt */}
            <p
                className="mx-auto text-center italic"
                style={{
                    margin: '0 auto 28px',
                    maxWidth: 360,
                    fontFamily: 'var(--font-body), serif',
                    fontSize: compact ? 14 : 15.5,
                    lineHeight: 1.55,
                    color: 'rgba(252,246,186,0.70)',
                }}
            >
                Inicia sesión para reservar tu próxima privada.
            </p>

            {/* Brass Google button (wrapped in its own form so the action submits) */}
            <form action={googleAction}>
                <BrassGoogleButton />
            </form>

            {/* Guest row */}
            <div
                className="text-center uppercase"
                style={{
                    marginTop: 20,
                    fontFamily: 'var(--font-accent), cursive',
                    fontSize: 12,
                    letterSpacing: '0.26em',
                }}
            >
                <span style={{ color: 'rgba(252,246,186,0.45)' }}>O bien · </span>
                {guestSlot}
            </div>

            {/* Fine print */}
            <p
                className="mx-auto text-center"
                style={{
                    margin: '32px auto 0',
                    maxWidth: 320,
                    fontFamily: 'var(--font-body), serif',
                    fontSize: 11,
                    color: 'rgba(232,199,122,0.40)',
                    lineHeight: 1.5,
                }}
            >
                Al continuar aceptas los{' '}
                <u
                    style={{
                        textDecorationColor: 'rgba(232,199,122,0.30)',
                        textUnderlineOffset: 2,
                    }}
                >
                    Términos
                </u>{' '}
                y la{' '}
                <u
                    style={{
                        textDecorationColor: 'rgba(232,199,122,0.30)',
                        textUnderlineOffset: 2,
                    }}
                >
                    Privacidad
                </u>{' '}
                de Las Privadas.
            </p>
        </div>
    )
}
