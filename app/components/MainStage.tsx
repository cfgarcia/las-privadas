"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { useLanguage } from "../context/LanguageContext"
import Header from "./Header"
import Hero from "./Hero"
import ArtistCarousel from "./ArtistCarousel"
import Interlude from "./Interlude"
import PrivFooter from "./PrivFooter"

interface Artist {
    id: string
    name: string
    description: string
    imageUrl: string | null
    hoverVideoUrl?: string | null
}

interface MainStageProps {
    artists: Artist[]
    initialSlide: number
    session: any
}

const FADE_LEN = 480
const CAROUSEL_HOLD = 480
const CAROUSEL_EXIT = 600

export default function MainStage({ artists, initialSlide, session }: MainStageProps) {
    const { t: copy } = useLanguage()
    const prefersReduced = useReducedMotion()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollY, setScrollY] = useState(0)
    const [headerHidden, setHeaderHidden] = useState(false)

    // Track previous scrollY in a ref so we don't re-create the listener
    const lastScrollYRef = useRef(0)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const HIDE_THRESHOLD = 8       // px of scroll-down before we hide
        const REVEAL_THRESHOLD = 4     // px of scroll-up before we re-show
        const ALWAYS_VISIBLE_TOP = 64  // never hide while in the top band

        const onScroll = () => {
            const y = el.scrollTop
            setScrollY(y)
            const dy = y - lastScrollYRef.current

            if (y < ALWAYS_VISIBLE_TOP) {
                setHeaderHidden(false)
            } else if (dy > HIDE_THRESHOLD) {
                setHeaderHidden(true)
            } else if (dy < -REVEAL_THRESHOLD) {
                setHeaderHidden(false)
            }
            lastScrollYRef.current = y
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [])

    // Hero fade-out across first FADE_LEN of scroll. Opacity fades are kept
    // under reduced-motion (scroll-linked reveals, not auto-motion); the
    // travel/scale/blur parallax is neutralized.
    const t = Math.min(1, scrollY / FADE_LEN)
    const heroOpacity = Math.max(0, 1 - t * 1.4)
    const heroTranslate = prefersReduced ? 0 : -t * 60
    const heroScale = prefersReduced ? 1 : 1 - t * 0.08
    const heroBlur = prefersReduced ? 0 : t * 4
    const heroPointer = t > 0.85 ? 'none' : 'auto'

    // Carousel comes into focus on entry, parallaxes on exit.
    // `carEntryPullY` lifts the carousel upward as the hero fades, so the
    // search bar + cards land in the upper-middle of the viewport instead of
    // sitting in the bottom half after the hero is gone.
    const carInScale = prefersReduced ? 1 : 0.94 + t * 0.06
    const carOpacity = 0.55 + t * 0.45
    const carEntryPullY = prefersReduced ? 0 : -t * 80

    const exitStart = FADE_LEN + CAROUSEL_HOLD
    const exitT = Math.max(0, Math.min(1, (scrollY - exitStart) / CAROUSEL_EXIT))
    const carParallaxY = prefersReduced ? 0 : -exitT * 120
    const carExitScale = prefersReduced ? 1 : 1 - exitT * 0.06
    const carExitOpacity = 1 - exitT * 0.55

    const cueOpacity = Math.max(0, 1 - t * 3)

    return (
        <div
            ref={scrollRef}
            className="relative w-full font-body"
            style={{
                height: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                background: '#0a0503',
            }}
        >
            {/* Unified background — sticky to viewport across the whole scroll */}
            <div
                className="pointer-events-none"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 0,
                    height: '100vh',
                    width: '100%',
                    marginBottom: '-100vh',
                }}
            >
                {/* Espresso radial vignette */}
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
                            'radial-gradient(ellipse at 50% 30%, rgba(201,162,74,0.10) 0%, rgba(201,162,74,0.03) 30%, transparent 60%)',
                    }}
                />
                {/* Film grain (self-contained, no network request) */}
                <div className="priv-grain" />
                {/* Outer vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)',
                    }}
                />
            </div>

            {/* Sticky header — hides on scroll down, reveals on scroll up */}
            <div
                className="sticky top-0 z-50"
                style={{
                    transform: headerHidden ? 'translateY(-100%)' : 'translateY(0)',
                    opacity: headerHidden ? 0 : 1,
                    transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease-out',
                    willChange: 'transform, opacity',
                }}
            >
                <Header session={session} />
            </div>

            {/* HERO STAGE */}
            <section
                className="relative z-[2] flex flex-col items-center"
                style={{
                    minHeight: 'min(620px, 72vh)',
                    padding: '24px 24px 28px',
                    opacity: heroOpacity,
                    transform: `translateY(${heroTranslate}px) scale(${heroScale})`,
                    filter: `blur(${heroBlur}px)`,
                    pointerEvents: heroPointer as React.CSSProperties['pointerEvents'],
                    willChange: 'transform, opacity, filter',
                }}
            >
                <div className="flex-1 flex items-center justify-center w-full">
                    <Hero />
                </div>

                {/* Scroll-down cue */}
                <div
                    className="flex flex-col items-center pointer-events-none"
                    style={{
                        marginTop: 32,
                        gap: 10,
                        opacity: cueOpacity,
                        transition: 'opacity 200ms',
                    }}
                >
                    <span
                        className="uppercase"
                        style={{
                            fontFamily: 'var(--font-accent), cursive',
                            fontSize: 11,
                            letterSpacing: '0.36em',
                            color: 'rgba(242,229,184,0.78)',
                        }}
                    >
                        {copy.home.hero.scroll_cue}
                    </span>
                    <div
                        className="relative"
                        style={{
                            width: 22,
                            height: 32,
                            borderRadius: 12,
                            border: '1px solid rgba(232,199,122,0.55)',
                        }}
                    >
                        <span
                            className="priv-scroll-dot absolute"
                            style={{
                                left: '50%',
                                top: 6,
                                width: 3,
                                height: 6,
                                borderRadius: 2,
                                background: '#E8C77A',
                                transform: 'translateX(-50%)',
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* CAROUSEL STAGE */}
            <section
                className="relative z-[2] flex flex-col"
                style={{
                    minHeight: 880,
                    padding: '0 0 80px',
                    opacity: carOpacity * carExitOpacity,
                    transform: `translateY(${carEntryPullY + carParallaxY}px) scale(${carInScale * carExitScale})`,
                    transformOrigin: 'center top',
                    willChange: 'transform, opacity',
                }}
            >
                <ArtistCarousel
                    artists={artists}
                    initialSlide={initialSlide}
                    scrollProgress={t}
                    exitProgress={exitT}
                />
            </section>

            <Interlude progress={exitT} />

            <PrivFooter />
        </div>
    )
}
