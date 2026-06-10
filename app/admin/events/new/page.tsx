import { prisma } from "@/lib/prisma"
import EventForm from "../EventForm"
import { createEvent } from "../../actions"

export default async function NewEventPage() {
    const artists = await prisma.artist.findMany({
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true },
    })

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Evento</h2>
            <EventForm artists={artists} action={createEvent} />
        </div>
    )
}
