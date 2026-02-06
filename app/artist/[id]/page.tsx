import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import LoginModal from "../../components/LoginModal"
import Header from "../../components/Header"
import ArtistDetailView from "./ArtistDetailView"

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const showLoginModal = !session
    const { id } = await params
    const artist = await prisma.artist.findUnique({
        where: { id },
    })

    if (!artist) {
        return <div>Artist not found</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header session={session} />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <ArtistDetailView artist={artist} user={session?.user} />
            </div>
            {showLoginModal && <LoginModal />}
        </div>
    )
}
