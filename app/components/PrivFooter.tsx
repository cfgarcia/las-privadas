"use client"

const COLUMNS = [
    { label: 'Explorar', items: ['Artistas', 'Géneros', 'Ciudades'] },
    { label: 'La Casa', items: ['Quiénes somos', 'Para artistas', 'Prensa'] },
    { label: 'Ayuda', items: ['Cómo reservar', 'Contacto', '+52 81 0000 0000'] },
] as const

export default function PrivFooter() {
    const txt = 'rgba(252,246,186,0.70)'
    const muted = 'rgba(252,246,186,0.45)'
    const ruleColor = 'rgba(212,175,55,0.22)'

    const bg =
        'linear-gradient(to bottom, rgba(20,10,6,0) 0%, rgba(15,8,4,0.92) 35%, #0a0503 100%)'

    return (
        <footer
            className="relative z-[2] w-full"
            style={{
                padding: '64px 32px 32px',
                background: bg,
                color: txt,
                fontFamily: 'Playfair Display, serif',
            }}
        >
            {/* Top hairline + diamond ornament */}
            <div
                className="flex items-center justify-center"
                style={{ gap: 12, marginBottom: 32 }}
            >
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 160,
                        background: `linear-gradient(to right, transparent, ${ruleColor}, transparent)`,
                    }}
                />
                <div
                    style={{
                        width: 6,
                        height: 6,
                        transform: 'rotate(45deg)',
                        background: 'rgba(212,175,55,0.55)',
                        boxShadow: '0 0 10px rgba(212,175,55,0.40)',
                    }}
                />
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        maxWidth: 160,
                        background: `linear-gradient(to right, transparent, ${ruleColor}, transparent)`,
                    }}
                />
            </div>

            <div
                className="mx-auto grid items-start"
                style={{
                    maxWidth: 1100,
                    gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(3, minmax(0, 1fr))',
                    gap: 40,
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: 'Rye, serif',
                            fontSize: 22,
                            lineHeight: 1,
                            letterSpacing: '0.02em',
                            color: '#fcf6ba',
                            marginBottom: 10,
                        }}
                    >
                        Las Privadas
                    </div>
                    <p
                        className="m-0 italic"
                        style={{
                            maxWidth: 260,
                            fontSize: 12,
                            lineHeight: 1.55,
                            color: muted,
                        }}
                    >
                        Reservas íntimas con artistas regionales — curadas para tu noche.
                    </p>
                </div>

                {COLUMNS.map((col) => (
                    <div key={col.label}>
                        <div
                            className="uppercase"
                            style={{
                                fontFamily: 'Sancreek, cursive',
                                fontSize: 9,
                                letterSpacing: '0.32em',
                                color: 'rgba(232,199,122,0.65)',
                                marginBottom: 12,
                            }}
                        >
                            {col.label}
                        </div>
                        <ul
                            className="list-none p-0 m-0 flex flex-col"
                            style={{ gap: 7 }}
                        >
                            {col.items.map((it) => (
                                <li
                                    key={it}
                                    style={{ fontSize: 12.5, color: txt, lineHeight: 1.4 }}
                                >
                                    {it}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div
                className="mx-auto"
                style={{ maxWidth: 1100, margin: '36px auto 0', height: 1, background: ruleColor }}
            />
            <div
                className="mx-auto flex justify-between items-center flex-wrap"
                style={{
                    maxWidth: 1100,
                    margin: '14px auto 0',
                    gap: 12,
                    fontSize: 11,
                    color: muted,
                }}
            >
                <div>© {new Date().getFullYear()} Las Privadas · Monterrey, MX</div>
                <div
                    className="flex uppercase"
                    style={{
                        gap: 20,
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 9,
                        letterSpacing: '0.28em',
                    }}
                >
                    <span>Términos</span>
                    <span>Privacidad</span>
                    <span>Cookies</span>
                </div>
            </div>
        </footer>
    )
}
