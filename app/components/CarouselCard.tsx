"use client"

import Image from "next/image"
import { useLanguage } from "../context/LanguageContext"
import { useRef, useEffect } from "react"

interface CarouselCardProps {
    artist: {
        id: string
        name: string
        description: string
        imageUrl: string | null
        hoverVideoUrl?: string | null
    }
    isActive?: boolean
}

const CornerOrnament = ({ pos, active }: { pos: 'tl' | 'tr' | 'bl' | 'br'; active: boolean }) => {
    const corner: Record<string, React.CSSProperties> = {
        tl: { top: 4, left: 4, transform: 'rotate(0deg)' },
        tr: { top: 4, right: 4, transform: 'rotate(90deg)' },
        bl: { bottom: 4, left: 4, transform: 'rotate(-90deg)' },
        br: { bottom: 4, right: 4, transform: 'rotate(180deg)' },
    }
    return (
        <div
            className="absolute pointer-events-none z-[3] transition-opacity duration-500"
            style={{
                width: 18,
                height: 18,
                opacity: active ? 0.95 : 0.5,
                ...corner[pos],
            }}
        >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M0 0 L18 0 L18 1 L1 1 L1 18 L0 18 Z" fill="#E8C77A" />
                <path d="M2 2 L10 2 L10 2.5 L2.5 2.5 L2.5 10 L2 10 Z" fill="#C9A24A" opacity="0.7" />
            </svg>
        </div>
    )
}

export default function CarouselCard({ artist, isActive = false }: CarouselCardProps) {
    const { t } = useLanguage()
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (!videoRef.current) return
        if (isActive) {
            const playPromise = videoRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    /* autoplay may be blocked */
                })
            }
        } else {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }, [isActive])

    const handleMouseEnter = () => {
        if (videoRef.current && !isActive) {
            videoRef.current.play().catch((e: any) => console.error("Video play error:", e))
        }
    }

    const handleMouseLeave = () => {
        if (videoRef.current && !isActive) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    return (
        <div
            className={`relative block cursor-pointer group z-20 transition-all duration-700 ease-out ${
                isActive ? '' : 'brightness-[0.6]'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid={isActive ? 'artist-card-active' : undefined}
            style={{
                // Caps at 380px on desktop, shrinks to fit phones (no overflow at
                // 320–375px). Height tracks width at the original 380:560 ratio.
                width: 'min(380px, 86vw)',
                height: 'calc(min(380px, 86vw) * 1.474)',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Pin-spot of warm gold light — only on active card. The lighting IS the indicator. */}
            {isActive && (
                <div
                    className="absolute pointer-events-none z-0"
                    style={{
                        left: '50%',
                        top: '-200px',
                        transform: 'translateX(-50%)',
                        width: 720,
                        height: 460,
                        background:
                            'radial-gradient(ellipse at 50% 80%, rgba(232,199,122,0.32) 0%, rgba(232,199,122,0.10) 35%, transparent 65%)',
                        filter: 'blur(6px)',
                    }}
                />
            )}

            {/* Outer dark-wood frame */}
            <div
                className="relative w-full h-full p-[14px] z-[1] rounded-[3px] overflow-hidden"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 8px),
                        repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 4px),
                        linear-gradient(to bottom right, #3E2723, #1a0f0a)
                    `,
                    boxShadow: isActive
                        ? 'inset 0 0 28px rgba(0,0,0,0.85), inset 2px 2px 5px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.35), 0 0 50px rgba(232,199,122,0.25)'
                        : 'inset 0 0 22px rgba(0,0,0,0.85), inset 2px 2px 5px rgba(255,255,255,0.06), 0 16px 36px rgba(0,0,0,0.55)',
                }}
            >
                {/* Gold corner ornaments */}
                <CornerOrnament pos="tl" active={isActive} />
                <CornerOrnament pos="tr" active={isActive} />
                <CornerOrnament pos="bl" active={isActive} />
                <CornerOrnament pos="br" active={isActive} />

                {/* Gold inner trim — replaces silver matte */}
                <div
                    className="absolute pointer-events-none transition-colors duration-700"
                    style={{
                        inset: 8,
                        border: `1px solid ${isActive ? 'rgba(232,199,122,0.55)' : 'rgba(212,175,55,0.28)'}`,
                        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)',
                    }}
                />
                <div
                    className="absolute pointer-events-none"
                    style={{
                        inset: 11,
                        border: `1px solid ${isActive ? 'rgba(212,175,55,0.30)' : 'rgba(212,175,55,0.12)'}`,
                    }}
                />

                {/* Photo + brass plaque + chevron CTA. The espresso gradient
                   backdrop means transparent / portrait-cutout stills read as an
                   intentional studio sweep instead of a black void. next/image
                   serves a card-sized variant (sizes) instead of the full-res
                   source — big win on mobile data. */}
                <div
                    className="relative w-full h-full overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, #2c1810 0%, #1a0f0a 55%, #0a0503 100%)' }}
                >
                    <Image
                        src={artist.imageUrl || "https://via.placeholder.com/400x600"}
                        alt={artist.name}
                        fill
                        sizes="(max-width: 480px) 86vw, 380px"
                        className="object-cover transition-[filter,transform] duration-1000 ease-out"
                        style={{
                            filter: isActive
                                ? 'sepia(0.20) brightness(1.05) contrast(1.05)'
                                : 'sepia(0.45) brightness(0.55) grayscale(0.15)',
                            transform: isActive ? 'scale(1.04)' : 'scale(1)',
                        }}
                    />

                    {/* Hover/active video */}
                    {artist.hoverVideoUrl && (
                        <div
                            className={`absolute inset-0 z-0 transition-opacity duration-500 bg-black/5 ${
                                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                        >
                            <video
                                ref={videoRef}
                                src={artist.hoverVideoUrl}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                            />
                        </div>
                    )}

                    {/* Film grain (self-contained, no network request) */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.14]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: '160px 160px',
                            mixBlendMode: 'overlay',
                        }}
                    />

                    {/* Bottom gradient for plaque legibility */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 35%, transparent 60%)',
                        }}
                    />

                    {/* Top vignette */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse at 50% 0%, rgba(255,220,160,0.10) 0%, transparent 50%)',
                        }}
                    />

                    {/* Brass plaque (bottom) */}
                    <div
                        className="absolute backdrop-blur-[2px]"
                        style={{
                            left: 16,
                            right: 16,
                            bottom: 16,
                            padding: '14px 16px 12px',
                            background: 'linear-gradient(to bottom, rgba(26,15,10,0.85), rgba(0,0,0,0.92))',
                            border: '1px solid rgba(212,175,55,0.45)',
                            borderTop: '1px solid rgba(232,199,122,0.65)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(232,199,122,0.10)',
                        }}
                    >
                        <div
                            className="uppercase mb-1.5 transition-opacity duration-500"
                            style={{
                                fontFamily: 'var(--font-accent), cursive',
                                fontSize: 9,
                                letterSpacing: '0.30em',
                                color: '#D4AF37',
                                opacity: isActive ? 0.95 : 0.65,
                            }}
                        >
                            Privada
                        </div>
                        <h3
                            className="m-0 transition-[font-size] duration-500"
                            style={{
                                fontFamily: 'var(--font-western), serif',
                                fontSize: isActive ? 26 : 21,
                                lineHeight: 1.1,
                                letterSpacing: '0.04em',
                                color: '#fcf6ba',
                                textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                            }}
                        >
                            {artist.name}
                        </h3>

                        {/* Divider + description (italic) — only when active */}
                        <div
                            className="overflow-hidden transition-[max-height,opacity] duration-500"
                            style={{
                                maxHeight: isActive ? 80 : 0,
                                opacity: isActive ? 1 : 0,
                            }}
                        >
                            <div
                                className="my-2"
                                style={{
                                    width: 38,
                                    height: 1,
                                    background:
                                        'linear-gradient(to right, transparent, rgba(232,199,122,0.7), transparent)',
                                }}
                            />
                            <p
                                className="m-0 italic line-clamp-2"
                                style={{
                                    fontFamily: 'var(--font-body), serif',
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                    color: 'rgba(252,246,186,0.7)',
                                }}
                            >
                                {artist.description}
                            </p>
                        </div>
                    </div>

                    {/* Bronze chevron CTA — only on active. No rotated red flag. */}
                    {isActive && (
                        <div
                            className="absolute flex items-center justify-center animate-fade-in"
                            style={{
                                top: 18,
                                right: 18,
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'linear-gradient(to bottom, #b38728, #5c4018)',
                                border: '1px solid rgba(252,246,186,0.55)',
                                boxShadow:
                                    '0 4px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(252,246,186,0.30)',
                            }}
                            title={t.home.view_details}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fcf6ba" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Floor reflection — only active */}
            {isActive && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left: '8%',
                        right: '8%',
                        bottom: -22,
                        height: 22,
                        background:
                            'radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.55) 0%, transparent 70%)',
                        filter: 'blur(4px)',
                    }}
                />
            )}
        </div>
    )
}
