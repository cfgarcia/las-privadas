"use client"

import Link from "next/link"
import BookingForm from "./BookingForm"
import { useLanguage } from "../../context/LanguageContext"

interface ArtistDetailViewProps {
    artist: {
        id: string
        name: string
        description: string
        imageUrl: string | null
        bookingImageUrl: string | null
    }
    user?: {
        name?: string | null
        email?: string | null
    }
}

export default function ArtistDetailView({ artist, user }: ArtistDetailViewProps) {
    const { t } = useLanguage()

    return (
        <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 mb-8 inline-block">
                &larr; {t.artist.back_to_catalog}
            </Link>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="h-64 sm:h-80 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={artist.bookingImageUrl || artist.imageUrl || "https://via.placeholder.com/800x400"}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{artist.name}</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {artist.description}
                    </p>

                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.artist.book_title}</h2>
                        <BookingForm artistId={artist.id} user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}
