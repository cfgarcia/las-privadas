"use client"

import Link from "next/link"
import { useLanguage } from "../context/LanguageContext"

interface ArtistCardProps {
    artist: {
        id: string
        name: string
        description: string
        imageUrl: string | null
    }
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const { t } = useLanguage()

    return (
        <Link href={`/artist/${artist.id}`} className="group">
            <div className="bg-cream-dark border-2 border-leather-light/20 rounded-sm shadow-md overflow-hidden hover:shadow-xl hover:border-gold/50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-56 bg-leather-light relative sepia-[.3] group-hover:sepia-0 transition-all duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={artist.imageUrl || "https://via.placeholder.com/400x300"}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-leather-dark/80 to-transparent opacity-60"></div>
                </div>
                <div className="p-6 relative bg-leather-texture">
                    <h3 className="text-2xl font-western text-leather-dark group-hover:text-leather transition-colors drop-shadow-sm">
                        {artist.name}
                    </h3>
                    <p className="mt-2 text-leather/80 font-body line-clamp-2 leading-relaxed">
                        {artist.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-leather/10 flex items-center text-gold-dark font-bold uppercase tracking-wider text-xs">
                        {t.home.view_details}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}
