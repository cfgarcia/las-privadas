"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { useLanguage } from "../context/LanguageContext"
import { filterArtists, normalize } from "@/lib/search"
import CarouselCard from './CarouselCard'
import CardBack from './CardBack'
import SearchBar from './SearchBar'

interface Artist {
    id: string
    name: string
    description: string
    imageUrl: string | null
    hoverVideoUrl?: string | null
}

interface ArtistCarouselProps {
    artists: Artist[]
    initialSlide?: number
    scrollProgress?: number
    exitProgress?: number
}

const arrowBtn = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [side]: 24,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'rgba(26,15,10,0.85)',
    color: '#fcf6ba',
    border: '1px solid rgba(212,175,55,0.55)',
    fontSize: 30,
    fontFamily: 'var(--font-western), serif',
    cursor: 'pointer',
    zIndex: 100,
    boxShadow: '0 8px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(232,199,122,0.20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    backdropFilter: 'blur(8px)',
})

export default function ArtistCarousel({
    artists: allArtists,
    initialSlide = 0,
    scrollProgress = 0,
    exitProgress = 0,
}: ArtistCarouselProps) {
    const { t: copy } = useLanguage()
    const prefersReduced = useReducedMotion()
    const [index, setIndex] = useState(initialSlide)
    const [query, setQuery] = useState('')

    // Touch swipe — phones expect to drag between cards, not just tap arrows.
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)
    const swipedRef = useRef(false)

    const q = normalize(query.trim())
    const artists = useMemo(() => filterArtists(allArtists, query), [allArtists, query])

    // When the query changes mid-session: jump to the first matching result
    // while filtering, and restore the center-out `initialSlide` once cleared.
    // Skip the initial mount so the prop sticks on first paint.
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setIndex(q ? 0 : initialSlide)
    }, [q, initialSlide])

    const total = artists.length
    const prev = () => setIndex((i) => (i - 1 + total) % total)
    const next = () => setIndex((i) => (i + 1) % total)

    const SWIPE_THRESHOLD = 40
    const onTouchStart = (e: React.TouchEvent) => {
        const tch = e.touches[0]
        touchStartRef.current = { x: tch.clientX, y: tch.clientY }
        swipedRef.current = false
    }
    const onTouchEnd = (e: React.TouchEvent) => {
        const start = touchStartRef.current
        if (!start) return
        const tch = e.changedTouches[0]
        const dx = tch.clientX - start.x
        const dy = tch.clientY - start.y
        // Horizontal intent only — ignore vertical scrolls.
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            swipedRef.current = true // suppress the card's tap-to-navigate
            if (dx < 0) next()
            else prev()
        }
        touchStartRef.current = null
    }

    const searchAppear = Math.max(0, Math.min(1, (scrollProgress - 0.45) / 0.4))

    // Gallery-wall layout — active + one neighbor on each side visible
    const xStep = 360
    const rotStep = -8
    const scaleStep = 0.14
    const half = Math.floor(total / 2)

    return (
        <>
            <SearchBar
                query={query}
                onQuery={setQuery}
                appear={searchAppear}
                resultCount={total}
            />

            {total === 0 && (
                <div
                    className="relative z-[2] text-center"
                    style={{
                        maxWidth: 420,
                        margin: '40px auto',
                        padding: '32px 28px',
                        background: 'rgba(26,15,10,0.55)',
                        border: '1px dashed rgba(212,175,55,0.40)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'var(--font-western), serif',
                            fontSize: 22,
                            color: '#fcf6ba',
                            letterSpacing: '0.04em',
                            marginBottom: 8,
                        }}
                    >
                        {copy.home.empty_title}
                    </div>
                    <p
                        className="m-0 italic"
                        style={{
                            fontFamily: 'var(--font-body), serif',
                            fontSize: 15,
                            color: 'rgba(242,229,184,0.82)',
                            lineHeight: 1.55,
                        }}
                    >
                        {copy.home.empty_body}
                    </p>
                </div>
            )}

            {total > 0 && (
                <div
                    className="relative w-full flex-1 flex items-center justify-center"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    style={{
                        perspective: 2200,
                        padding: '0 24px 60px',
                        minHeight: 700,
                        // Clip horizontally (off-screen cards stay hidden) but let
                        // the active card's pin-spot bleed UP behind the search bar.
                        overflowX: 'clip',
                        overflowY: 'visible',
                    }}
                >
                    {artists.map((artist, i) => {
                        // Circular shortest-path slot from active center.
                        // Stable key per artist means CSS transitions interpolate
                        // between renders when index changes.
                        let slot = i - index
                        if (slot > half) slot -= total
                        else if (slot < -half) slot += total

                        const isActive = slot === 0
                        const visible = Math.abs(slot) <= 1

                        // Cap transform slot at ±2 so off-screen cards don't
                        // animate huge horizontal flights when the user clicks.
                        const tSlot = Math.max(-2, Math.min(2, slot))
                        const tAbs = Math.abs(tSlot)

                        const x = tSlot * xStep
                        const z = -tAbs * 80
                        const rot = tSlot * rotStep
                        const scale = isActive ? 1 : 1 - tAbs * scaleStep

                        const slotOpacity = isActive ? 1 : visible ? 0.7 : 0

                        // Reveal-on-scroll flip — uses the visible-neighborhood
                        // distance so off-screen cards don't add useless stagger.
                        const stagger = Math.min(2, Math.abs(slot)) * 0.16
                        const inT = Math.max(
                            0,
                            Math.min(1, (scrollProgress - 0.20 - stagger) / 0.55),
                        )
                        const outT = Math.max(0, Math.min(1, (exitProgress - stagger) / 0.55))
                        // Reduced motion: skip the 3D flip + blur reveal — cards
                        // are simply present (inEase=1, outEase=0 zeroes angle/blur).
                        const inEase = prefersReduced ? 1 : 1 - Math.pow(1 - inT, 3)
                        const outEase = prefersReduced ? 0 : outT * outT

                        const revealAngle = 180 * (1 - inEase) - 180 * outEase
                        const tilt = (1 - inEase) * 6 - outEase * 6

                        const tOpacity = slotOpacity * inEase * (1 - outEase * 0.7)
                        const tBlur = (1 - inEase) * 4 + outEase * 3

                        return (
                            <div
                                key={artist.id}
                                className="absolute"
                                style={{
                                    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`,
                                    transformStyle: 'preserve-3d',
                                    transition:
                                        'transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 700ms cubic-bezier(0.16,1,0.3,1)',
                                    opacity: tOpacity,
                                    zIndex: 10 - tAbs,
                                    filter: tBlur > 0.1 ? `blur(${tBlur}px)` : 'none',
                                    pointerEvents: visible ? 'auto' : 'none',
                                    willChange: 'transform, opacity, filter',
                                }}
                            >
                                {/* Inner flip container */}
                                <div
                                    className="relative"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: `rotateX(${tilt}deg) rotateY(${revealAngle}deg)`,
                                        transition: 'transform 200ms linear',
                                        willChange: 'transform',
                                    }}
                                    onClick={() => {
                                        // A horizontal swipe just fired — don't also
                                        // treat the touch-release as a tap.
                                        if (swipedRef.current) {
                                            swipedRef.current = false
                                            return
                                        }
                                        if (isActive) {
                                            window.location.href = `/artist/${artist.id}`
                                        } else if (visible) {
                                            setIndex(i)
                                        }
                                    }}
                                >
                                    {/* FRONT — artist */}
                                    <div
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            filter: isActive ? 'none' : 'brightness(0.55)',
                                            transition: 'filter 700ms',
                                        }}
                                    >
                                        <CarouselCard artist={artist} isActive={isActive} />
                                    </div>

                                    {/* BACK — closed display case */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            transform: 'rotateY(180deg)',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <CardBack />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Arrows */}
                    <button onClick={prev} style={arrowBtn('left')} aria-label="Anterior">
                        ‹
                    </button>
                    <button onClick={next} style={arrowBtn('right')} aria-label="Siguiente">
                        ›
                    </button>

                    {/* Dot pagination */}
                    <div
                        className="absolute flex justify-center"
                        style={{ bottom: 0, left: 0, right: 0, gap: 8 }}
                    >
                        {artists.map((artist, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Ver ${artist.name}`}
                                aria-current={i === index}
                                className="cursor-pointer p-0"
                                style={{
                                    width: i === index ? 28 : 8,
                                    height: 6,
                                    borderRadius: 3,
                                    border: 'none',
                                    background:
                                        i === index
                                            ? 'linear-gradient(to right, #996515, #fcf6ba, #996515)'
                                            : 'rgba(212,175,55,0.30)',
                                    transition: 'all 350ms cubic-bezier(0.16,1,0.3,1)',
                                    boxShadow: i === index ? '0 0 8px rgba(212,175,55,0.55)' : 'none',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
