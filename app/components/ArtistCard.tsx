"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { useLanguage } from "../context/LanguageContext"

interface ArtistCardProps {
    artist: {
        id: string
        name: string
        description: string
        imageUrl: string | null
        hoverVideoUrl?: string | null
    }
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const { t } = useLanguage()

    const videoRef = useRef<HTMLVideoElement>(null)

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((e: any) => console.error("Video play error:", e))
        }
    }

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    return (
        <Link
            href={`/artist/${artist.id}`}
            className="group block h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="bg-cream-dark border-2 border-leather-light/20 rounded-sm shadow-md overflow-hidden hover:shadow-xl hover:border-gold/50 transition-all duration-500 transform hover:-translate-y-1 h-full flex flex-col">
                <div className="h-64 bg-leather-light relative overflow-hidden">
                    {/* Image with Sepia & Zoom Effect */}
                    <div className="absolute inset-0 transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:sepia-0 sepia-[.3] will-change-transform">
                        <Image
                            src={artist.imageUrl || "https://via.placeholder.com/400x300"}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    {/* Canvas Video Overlay */}
                    {artist.hoverVideoUrl && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-black/5">
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-leather-dark/90 via-transparent to-transparent opacity-60 pointer-events-none z-20"></div>
                </div>

                <div className="p-6 relative bg-leather-texture flex-1 flex flex-col border-t border-leather/10">
                    <h3 className="text-2xl font-western text-leather-dark group-hover:text-leather transition-colors drop-shadow-sm">
                        {artist.name}
                    </h3>
                    <p className="mt-2 text-leather/80 font-body line-clamp-2 leading-relaxed flex-1">
                        {artist.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-leather/10 flex items-center text-gold-dark font-western font-bold uppercase tracking-wider text-xs group-hover:text-gold transition-colors">
                        {t.home.view_details}
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}
