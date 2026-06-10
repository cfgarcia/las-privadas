import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EventForm from "../EventForm"
import { updateEvent } from "../../actions"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [event, artists] = await Promise.all([
        prisma.event.findUnique({ where: { id } }),
        prisma.artist.findMany({
            orderBy: { order: "asc" },
            select: { id: true, name: true, slug: true },
        }),
    ])

    if (!event) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Evento</h2>
            <EventForm
                artists={artists}
                event={{
                    id: event.id,
                    artistId: event.artistId,
                    title: event.title,
                    date: event.date.toISOString().slice(0, 10),
                    venue: event.venue,
                    city: event.city,
                    state: event.state,
                    ticketUrl: event.ticketUrl,
                    flyerUrl: event.flyerUrl,
                    isPublished: event.isPublished,
                }}
                action={updateEvent}
            />
        </div>
    )
}
