import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import LoginModal from "../../components/LoginModal"
import ReservationClient from "../../components/reservation/ReservationClient"
import type { ReservationArtist } from "../../components/reservation/types"

export default async function ArtistPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ type?: string }>
}) {
    const session = await auth()
    const showLoginModal = !session
    const { id } = await params
    const { type } = await searchParams
    const initialEventType = type === "negocio" ? "negocio" : undefined

    const [artist, others] = await Promise.all([
        prisma.artist.findUnique({
            where: { id },
            include: {
                songs: {
                    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
                },
            },
        }),
        prisma.artist.findMany({
            where: { id: { not: id } },
            orderBy: { order: "asc" },
            take: 3,
        }),
    ])

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0503] text-[#fcf6ba]" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                Artist not found
            </div>
        )
    }

    const reservationArtist: ReservationArtist = {
        ...mapArtist(artist),
        songs: artist.songs.map((s) => ({
            id: s.id,
            title: s.title,
            mp3Url: s.mp3Url,
        })),
    }
    const similar: ReservationArtist[] = others.map(mapArtist)

    return (
        <>
            <ReservationClient
                artist={reservationArtist}
                similar={similar}
                user={session?.user ?? undefined}
                initialEventType={initialEventType}
            />
            {showLoginModal && <LoginModal />}
        </>
    )
}

type DbArtist = {
    id: string
    name: string
    tagline: string | null
    description: string
    albumCount: number | null
    careerYears: number | null
    imageUrl: string | null
    bookingImageUrl: string | null
}

function mapArtist(a: DbArtist): ReservationArtist {
    return {
        id: a.id,
        name: a.name,
        tagline: a.tagline,
        description: a.description,
        albumCount: a.albumCount,
        careerYears: a.careerYears,
        imageUrl: a.imageUrl,
        bookingImageUrl: a.bookingImageUrl,
        genre: null,
        city: null,
    }
}
