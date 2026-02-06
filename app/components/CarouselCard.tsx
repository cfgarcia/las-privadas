"use client"

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

export default function CarouselCard({ artist, isActive = false }: CarouselCardProps) {
    const { t } = useLanguage()
    const videoRef = useRef<HTMLVideoElement>(null)

    // Handle Mobile/Active State Playback
    useEffect(() => {
        if (!videoRef.current) return

        if (isActive) {
            const playPromise = videoRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Auto-play might be blocked by browser policy without user interaction first
                    console.log("Auto-play prevented:", error)
                })
            }
        } else {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }, [isActive])

    const handleMouseEnter = () => {
        if (videoRef.current && !isActive) { // Only handle hover if not already active (desktop hover logic)
            videoRef.current.play().catch((e: any) => console.error("Video play error:", e))
        }
    }

    const handleMouseLeave = () => {
        if (videoRef.current && !isActive) { // Only stop if not active
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    return (
        <div
            className={`block relative w-full h-[540px] transition-all duration-500 group z-20 cursor-pointer ${isActive ? 'scale-105' : 'scale-95 opacity-80 grayscale-[0.3]'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >

            {/* --- VINTAGE WOOD FRAME CONTAINER --- */}
            {/* 
                We use CSS gradients to create a realistic wood texture.
                - Base: Dark Mahogany Brown
                - Texture: Repeating lines for grain + Noise overlay
            */}
            <div
                className={`w-full h-full relative p-6 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden ${isActive ? 'shadow-[0_0_60px_rgba(0,0,0,0.8)]' : ''}`}
                style={{
                    backgroundColor: '#3E2723',
                    backgroundImage: `
                        repeating-linear-gradient(
                            45deg,
                            rgba(255, 255, 255, 0.02) 0px,
                            rgba(255, 255, 255, 0.02) 2px,
                            transparent 2px,
                            transparent 8px
                        ),
                        repeating-linear-gradient(
                            -45deg,
                            rgba(0, 0, 0, 0.1) 0px,
                            rgba(0, 0, 0, 0.1) 2px,
                            transparent 2px,
                            transparent 4px
                        ),
                        linear-gradient(to bottom right, #3E2723, #271c19)
                    `,
                    boxShadow: `
                        inset 0 0 20px rgba(0,0,0,0.8), /* Inner depth */
                        inset 2px 2px 5px rgba(255,255,255,0.1), /* Top-left highlight */
                        0 10px 20px rgba(0,0,0,0.5) /* Drop shadow */
                    `
                }}
            >
                {/* Silver Inner Trim (The visual "matting" between wood and photo) */}
                <div className="absolute inset-4 border-[3px] border-[#C0C0C0] rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"></div>

                {/* --- INNER CONTENT AREA --- */}
                <div className="relative w-full h-full overflow-hidden bg-gray-900 shadow-inner rounded-sm">

                    {/* Image Background */}
                    <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={artist.imageUrl || "https://via.placeholder.com/400x600"}
                            alt={artist.name}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-110 sepia-[.2]"
                        />

                        {/* Canvas Video Overlay */}
                        {artist.hoverVideoUrl && (
                            <div className={`absolute inset-0 transition-opacity duration-500 bg-black/5 z-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                        {/* Old Photo Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none"></div>
                    </div>

                    {/* "Select" Indicator (Now correctly positioned relative to main card) */}
                    {isActive && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-900 to-red-700 text-[#fcf6ba] font-western border-2 border-[#d4af37] px-4 py-1 text-sm shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-fade-in rotate-2 z-50">
                            Seleccionar
                        </div>
                    )}

                    {/* Content Overlay */}
                    <div className={`absolute bottom-0 left-0 w-full p-2 text-center transform transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                        <h3 className={`font-western text-[#fcf6ba] text-3xl mb-1 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300 tracking-wide`}>
                            {artist.name}
                        </h3>

                        <div className={`space-y-2 overflow-hidden transition-all duration-500 ${isActive ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-2"></div>
                            {/* Description text added back for better context */}
                            {isActive && (
                                <p className="text-white/80 font-body text-xs line-clamp-2 italic mb-2 px-2 drop-shadow-md">
                                    {artist.description}
                                </p>
                            )}

                            <div className="inline-block mt-1 pb-1">
                                <button className="bg-gradient-to-b from-[#b38728] to-[#5c4018] text-[#fcf6ba] font-display uppercase tracking-widest px-6 py-1.5 text-xs rounded-sm border border-[#fcf6ba]/50 hover:brightness-125 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.6)] transform hover:-translate-y-0.5 active:translate-y-0">
                                    {t.home.view_details}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
