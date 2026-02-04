import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import LoginModal from "./components/LoginModal"
import Header from "./components/Header"
import ArtistCard from "./components/ArtistCard"

async function getArtists() {
  return await prisma.artist.findMany()
}

export default async function Home() {
  const session = await auth()
  const showLoginModal = !session

  const artists = await getArtists()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </main>

      {showLoginModal && <LoginModal />}
    </div>
  )
}
