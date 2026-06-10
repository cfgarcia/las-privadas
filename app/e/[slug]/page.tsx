import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { laTodayStart, formatEventDate } from "@/lib/events"

export const revalidate = 300

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const artist = await prisma.artist.findUnique({
        where: { slug },
        select: { name: true, imageUrl: true },
    })
    if (!artist) {
        // Thrown here (before streaming starts) so the response is a real 404,
        // not a 200 with not-found UI streamed in.
        notFound()
    }
    const title = `${artist.name} | Próximos Eventos`
    const description = `Boletos para los próximos eventos de ${artist.name}`
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            images: artist.imageUrl ? [artist.imageUrl] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: artist.imageUrl ? [artist.imageUrl] : [],
        },
    }
}

function eventDateLabel(date: Date): string {
    const label = formatEventDate(date, { weekday: "long", day: "numeric", month: "long" })
    return label.charAt(0).toUpperCase() + label.slice(1)
}

export default async function ArtistEventsPage({ params }: PageProps) {
    const { slug } = await params
    const artist = await prisma.artist.findUnique({
        where: { slug },
        include: {
            events: {
                where: { isPublished: true, date: { gte: laTodayStart() } },
                orderBy: { date: "asc" },
            },
        },
    })

    if (!artist) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-[#0a0503] text-cream">
            <div className="max-w-md mx-auto px-5 py-10 sm:py-14">
                {/* Header */}
                <header className="flex flex-col items-center text-center mb-10">
                    {artist.imageUrl && (
                        <div className="relative h-28 w-28 mb-5 rounded-full overflow-hidden ring-2 ring-gold ring-offset-4 ring-offset-[#0a0503]">
                            <Image
                                src={artist.imageUrl}
                                alt={artist.name}
                                fill
                                sizes="112px"
                                priority
                                className="object-cover"
                            />
                        </div>
                    )}
                    <h1 className="font-western text-3xl sm:text-4xl text-gold tracking-wide">
                        {artist.name}
                    </h1>
                    <p className="font-body italic text-cream/70 mt-2 text-sm tracking-widest uppercase">
                        Próximos Eventos
                    </p>
                    <div className="w-16 h-px bg-gold/60 mt-4" aria-hidden />
                </header>

                {/* Events */}
                {artist.events.length === 0 ? (
                    <p className="font-body italic text-center text-cream/60 py-12">
                        No hay eventos por el momento. ¡Vuelve pronto!
                    </p>
                ) : (
                    <ul className="space-y-6">
                        {artist.events.map((event) => (
                            <li
                                key={event.id}
                                className="rounded-xl overflow-hidden border border-gold/30 bg-leather-dark/40"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    {event.flyerUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={event.flyerUrl}
                                            alt={`Flyer: ${event.title || event.venue}`}
                                            loading="lazy"
                                            className={`absolute inset-0 h-full w-full object-cover object-center ${event.isSoldOut ? "opacity-40 saturate-50" : ""}`}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-b from-leather-dark to-[#0a0503] flex items-center justify-center">
                                            <span className={`font-western text-2xl tracking-wide text-center px-4 ${event.isSoldOut ? "text-gold/40" : "text-gold/80"}`}>
                                                {event.venue}
                                            </span>
                                        </div>
                                    )}
                                    {event.isSoldOut && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="-rotate-12 border-4 border-red-600 text-red-500 bg-black/60 rounded-md px-6 py-2 text-3xl font-extrabold tracking-[0.3em] uppercase shadow-2xl shadow-black">
                                                Agotado
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-gold text-sm font-semibold tracking-wide mb-1">
                                        {eventDateLabel(event.date)}
                                    </p>
                                    <h2 className="font-body text-xl text-cream font-bold leading-snug">
                                        {event.title || event.venue}
                                    </h2>
                                    <p className="font-body text-cream/70 text-sm mt-1">
                                        {event.venue} · {event.city}
                                        {event.state ? `, ${event.state}` : ""}
                                    </p>
                                    {event.isSoldOut ? (
                                        <div
                                            aria-disabled="true"
                                            className="block w-full mt-4 bg-cream/10 text-cream/40 border border-cream/15 text-center font-bold tracking-[0.2em] uppercase py-3.5 rounded-lg cursor-not-allowed select-none"
                                        >
                                            Boletos Agotados
                                        </div>
                                    ) : (
                                        <a
                                            href={`/go/${event.id}`}
                                            className="block w-full mt-4 bg-gold hover:bg-gold-dark active:bg-gold-dark text-[#0a0503] text-center font-bold tracking-[0.2em] uppercase py-3.5 rounded-lg transition-colors"
                                        >
                                            Boletos
                                        </a>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <footer className="text-center mt-12">
                    <p className="font-body italic text-cream/40 text-xs">Las Privadas</p>
                </footer>
            </div>
        </main>
    )
}
