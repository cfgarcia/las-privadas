import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { laTodayStart, formatEventDate } from "@/lib/events"
import { deleteEvent } from "../actions"

export const dynamic = "force-dynamic"

type EventWithArtist = Awaited<ReturnType<typeof fetchEvents>>[number]

function fetchEvents() {
    return prisma.event.findMany({
        include: { artist: { select: { name: true, slug: true } } },
    })
}

function EventRow({ event, isPast }: { event: EventWithArtist; isPast: boolean }) {
    return (
        <li className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${isPast ? "opacity-50" : ""}`}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {event.flyerUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={event.flyerUrl} alt="" className="h-16 w-16 object-cover rounded shrink-0" />
                    ) : (
                        <div className="h-16 w-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 text-xs shrink-0">
                            Sin flyer
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {!event.isPublished && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide bg-gray-200 text-gray-600">
                                    Borrador
                                </span>
                            )}
                            {isPast && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide bg-red-100 text-red-700">
                                    Pasado
                                </span>
                            )}
                            <span className="text-sm text-gray-500">{event.artist.name}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">{event.title || event.venue}</h3>
                        <p className="text-sm text-gray-600">
                            {formatEventDate(event.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {event.venue} · {event.city}
                            {event.state ? `, ${event.state}` : ""}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{event.clickCount}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Clicks</p>
                    </div>
                    <Link
                        href={`/admin/events/${event.id}`}
                        className="bg-gold text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gold-dark"
                    >
                        Editar
                    </Link>
                    <form action={deleteEvent.bind(null, event.id)}>
                        <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200">
                            Borrar
                        </button>
                    </form>
                </div>
            </div>
        </li>
    )
}

export default async function EventsPage() {
    const events = await fetchEvents()
    const today = laTodayStart()
    const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime())
    const past = events.filter((e) => e.date < today).sort((a, b) => b.date.getTime() - a.date.getTime())

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
                <Link
                    href="/admin/events/new"
                    className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark text-sm font-medium"
                >
                    + Nuevo evento
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {events.length === 0 && (
                        <li className="p-6 text-center text-gray-500">
                            No hay eventos. Crea el primero con &quot;+ Nuevo evento&quot;.
                        </li>
                    )}
                    {upcoming.map((event) => (
                        <EventRow key={event.id} event={event} isPast={false} />
                    ))}
                    {past.map((event) => (
                        <EventRow key={event.id} event={event} isPast />
                    ))}
                </ul>
            </div>
            <p className="text-xs text-gray-400 mt-3">
                Los eventos pasados se ocultan solos de la página pública. &quot;Clicks&quot; = veces que alguien tocó el botón de Boletos.
            </p>
        </div>
    )
}
