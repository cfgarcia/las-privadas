import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import LoginModal from "./components/LoginModal"
import MainStage from "./components/MainStage"

export default async function Home() {
  const session = await auth()
  const showLoginModal = !session

  // Fetch artists sorted by rank
  const dbArtists = await prisma.artist.findMany({
    orderBy: { order: 'asc' },
  })

  // "Center-Out" / Pyramid Sort
  // Input: [1, 2, 3, 4, 5]  →  [4, 2, 1, 3, 5]
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
    <>
      <MainStage artists={artists} initialSlide={centerIndex} session={session} />
      {showLoginModal && <LoginModal />}
    </>
  )
}
