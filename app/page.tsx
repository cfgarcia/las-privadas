import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import LoginModal from "./components/LoginModal"
import Header from "./components/Header"
import ArtistCarousel from "./components/ArtistCarousel"


export default async function Home() {
  const session = await auth()
  const showLoginModal = !session

  // Fetch artists sorted by rank
  const dbArtists = await prisma.artist.findMany({
    orderBy: { order: 'asc' },
  })

  // "Center-Out" / Pyramid Sort
  // Input: [1, 2, 3, 4, 5]
  // Output: [4, 2, 1, 3, 5]
  const artists = new Array(dbArtists.length)
  let left = Math.floor((dbArtists.length - 1) / 2)
  let right = left + 1

  dbArtists.forEach((artist, i) => {
    if (i % 2 === 0) {
      artists[left] = artist
      left--
    } else {
      artists[right] = artist
      right++
    }
  })

  // The center item (Rank 1) ends up at this index
  const centerIndex = Math.floor((dbArtists.length - 1) / 2)

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />

      <main className="flex-1 flex flex-col justify-center max-w-full overflow-hidden py-8">
        <div className="text-center mb-0 relative">
          <img
            src="/reserva_tu_artista_v2.png"
            alt="Reserva tu Artista"
            className="mx-auto block h-28 sm:h-40 object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-300 animate-shine-pulse"
          />
        </div>
        <ArtistCarousel artists={artists} initialSlide={centerIndex} />
      </main>

      {showLoginModal && <LoginModal />}
    </div>
  )
}
