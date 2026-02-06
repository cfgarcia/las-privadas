import { prisma } from "@/lib/prisma"
import ArtistForm from "../ArtistForm"
import { updateArtist } from "../../actions"
import { notFound } from "next/navigation"

export default async function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const artist = await prisma.artist.findUnique({
        where: { id },
    })

    if (!artist) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Artist: {artist.name}</h2>
            <ArtistForm artist={artist} action={updateArtist} />
        </div>
    )
}
