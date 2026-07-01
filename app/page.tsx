import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { centerOutOrder } from "@/lib/sort"
import LoginModal from "./components/LoginModal"
import MainStage from "./components/MainStage"

export default async function Home() {
  const session = await auth()
  const showLoginModal = !session

  // Fetch artists sorted by rank (index 0 = rank #1)
  const dbArtists = await prisma.artist.findMany({
    orderBy: { order: 'asc' },
  })

  // Center-out / pyramid order so the top-ranked artist sits at the carousel center.
  const { ordered: artists, centerIndex } = centerOutOrder(dbArtists)

  return (
    <>
      <MainStage artists={artists} initialSlide={centerIndex} session={session} />
      {showLoginModal && <LoginModal />}
    </>
  )
}
