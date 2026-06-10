"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EventFormProps {
    artists: Array<{ id: string; name: string; slug: string | null }>
    event?: {
        id: string
        artistId: string
        title: string | null
        date: string // YYYY-MM-DD
        venue: string
        city: string
        state: string | null
        ticketUrl: string
        flyerUrl: string | null
        isPublished: boolean
    }
    action: (formData: FormData) => Promise<void>
}

export default function EventForm({ artists, event, action }: EventFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [artistId, setArtistId] = useState(event?.artistId ?? artists[0]?.id ?? "")

    const selectedArtist = artists.find((a) => a.id === artistId)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        if (event?.id) {
            formData.append("id", event.id)
        }

        try {
            await action(formData)
            router.push("/admin/events")
            router.refresh()
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                alert(`Error: ${error.message}`)
            } else {
                alert("An unexpected error occurred.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
            <div>
                <label htmlFor="artistId" className="block text-sm font-bold text-gray-700">Artista</label>
                <select
                    name="artistId"
                    id="artistId"
                    required
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold bg-white"
                >
                    {artists.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
                {selectedArtist && !selectedArtist.slug && (
                    <p className="text-xs text-amber-600 mt-1">
                        Este artista no tiene slug — el evento no será visible hasta que le pongas uno en su perfil (Artists → editar).
                    </p>
                )}
                {selectedArtist?.slug && (
                    <p className="text-xs text-gray-400 mt-1">
                        Página pública: <span className="font-mono text-gray-600">/e/{selectedArtist.slug}</span>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-bold text-gray-700">Fecha del evento</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        defaultValue={event?.date}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700">Título (opcional)</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={event?.title ?? ""}
                        placeholder="Gran Baile"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                    <p className="text-xs text-gray-400 mt-1">Si lo dejas vacío, se muestra el nombre del lugar.</p>
                </div>
            </div>

            <div>
                <label htmlFor="venue" className="block text-sm font-bold text-gray-700">Lugar / Venue</label>
                <input
                    type="text"
                    name="venue"
                    id="venue"
                    required
                    defaultValue={event?.venue}
                    placeholder="El Rodeo Nightclub"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-bold text-gray-700">Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        defaultValue={event?.city}
                        placeholder="Pico Rivera"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-bold text-gray-700">Estado (opcional)</label>
                    <input
                        type="text"
                        name="state"
                        id="state"
                        defaultValue={event?.state ?? ""}
                        placeholder="CA"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="ticketUrl" className="block text-sm font-bold text-gray-700">Link de boletos (Ticketón)</label>
                <input
                    type="url"
                    name="ticketUrl"
                    id="ticketUrl"
                    required
                    defaultValue={event?.ticketUrl}
                    placeholder="https://www.ticketon.com/..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold text-sm text-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">A donde llega el fan al tocar &quot;Boletos&quot;.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Flyer (opcional)</label>

                {event?.flyerUrl && (
                    <div className="mb-4 p-2 border border-gray-100 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Flyer actual:</p>
                        <div className="relative h-40 w-32">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={event.flyerUrl} alt="Flyer actual" className="h-full w-full object-cover rounded" />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="flyerFile" className="block text-sm font-medium text-gray-700">Subir flyer (GCS)</label>
                        <input
                            type="file"
                            name="flyerFile"
                            id="flyerFile"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gold file:text-white
                                hover:file:bg-gold-dark
                                cursor-pointer"
                        />
                    </div>

                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div>
                        <label htmlFor="flyerUrl" className="block text-sm font-medium text-gray-700">URL del flyer (manual)</label>
                        <input
                            type="text"
                            name="flyerUrl"
                            id="flyerUrl"
                            defaultValue={event?.flyerUrl ?? ""}
                            placeholder="https://..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold text-sm text-gray-600"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Si subes un archivo, reemplaza la URL manual. Sin flyer, el evento se muestra como tarjeta de texto.</p>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    defaultChecked={event?.isPublished ?? true}
                    className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold"
                />
                <label htmlFor="isPublished" className="text-sm font-bold text-gray-700">Publicado</label>
                <span className="text-xs text-gray-400">(desmárcalo para prepararlo sin que se vea todavía)</span>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Event"}
                </button>
            </div>
        </form>
    )
}
