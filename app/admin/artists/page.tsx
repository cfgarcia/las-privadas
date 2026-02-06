import { prisma } from "@/lib/prisma"
import SortableArtistList from "./SortableArtistList"
import { updateArtistOrder } from "../actions"

export default async function ArtistsPage() {
    const artists = await prisma.artist.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { bookings: true } } }
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Artists</h2>
                <a href="/admin/artists/new" className="bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-md shadow transition-colors font-medium">
                    + Add New Artist
                </a>
            </div>

            <SortableArtistList initialArtists={artists} onSaveOrder={updateArtistOrder} />
        </div>
    )
}
