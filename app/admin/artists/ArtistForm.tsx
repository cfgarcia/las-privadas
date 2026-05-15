"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface SongRow {
    localId: string
    dbId?: string
    title: string
    mp3Url: string
    fileKey?: string // identifier for the file input (when a new file is staged)
    removed?: boolean
}

interface ArtistFormProps {
    artist?: {
        id: string
        name: string
        tagline: string | null
        description: string
        albumCount: number | null
        careerYears: number | null
        imageUrl: string | null
        bookingImageUrl: string | null
        hoverVideoUrl: string | null
    }
    songs?: Array<{ id: string; title: string; mp3Url: string | null }>
    action: (formData: FormData) => Promise<void>
}

let songLocalCounter = 0
const newLocalId = () => `s${Date.now().toString(36)}-${++songLocalCounter}`

export default function ArtistForm({ artist, songs, action }: ArtistFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [songRows, setSongRows] = useState<SongRow[]>(() =>
        (songs ?? []).map((s) => ({
            localId: newLocalId(),
            dbId: s.id,
            title: s.title,
            mp3Url: s.mp3Url ?? "",
        })),
    )

    const updateSong = (localId: string, patch: Partial<SongRow>) => {
        setSongRows((rows) => rows.map((r) => (r.localId === localId ? { ...r, ...patch } : r)))
    }
    const addSong = () => {
        setSongRows((rows) => [...rows, { localId: newLocalId(), title: "", mp3Url: "" }])
    }
    const removeSong = (localId: string) => {
        setSongRows((rows) =>
            rows
                .map((r) => (r.localId === localId ? { ...r, removed: true } : r))
                .filter((r) => !(r.removed && !r.dbId)), // drop unsaved rows immediately
        )
    }
    const moveSong = (localId: string, dir: -1 | 1) => {
        setSongRows((rows) => {
            const visible = rows.filter((r) => !r.removed)
            const idx = visible.findIndex((r) => r.localId === localId)
            const swapWith = visible[idx + dir]
            if (!swapWith) return rows
            // swap in the original array preserving any removed entries' positions
            const a = rows.findIndex((r) => r.localId === localId)
            const b = rows.findIndex((r) => r.localId === swapWith.localId)
            const next = rows.slice()
            ;[next[a], next[b]] = [next[b], next[a]]
            return next
        })
    }

    const visibleSongs = songRows.filter((r) => !r.removed)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        if (artist?.id) {
            formData.append("id", artist.id)
        }

        // Pack songs metadata. Order in the array = display order.
        const songsMeta = songRows.map((r, idx) => ({
            localId: r.localId,
            dbId: r.dbId ?? null,
            title: r.title.trim(),
            mp3Url: r.mp3Url.trim(),
            order: idx,
            removed: !!r.removed,
            hasNewFile: !!r.fileKey,
        }))
        formData.append("songsMeta", JSON.stringify(songsMeta))

        try {
            await action(formData)
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
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={artist?.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                />
            </div>

            <div>
                <label htmlFor="tagline" className="block text-sm font-bold text-gray-700">
                    Tagline (Hero)
                </label>
                <input
                    type="text"
                    name="tagline"
                    id="tagline"
                    defaultValue={artist?.tagline ?? ""}
                    placeholder="Patrón de Patrones · Pura Época Pesada · Ícono de los 90s"
                    maxLength={140}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                />
                <p className="text-xs text-gray-400 mt-1">
                    Una línea — apodo, frase pegadora. Si la dejas vacía, el hero solo muestra el nombre del artista.
                </p>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description</label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    required
                    defaultValue={artist?.description}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="albumCount" className="block text-sm font-bold text-gray-700">
                        Álbumes / Discos
                    </label>
                    <input
                        type="number"
                        name="albumCount"
                        id="albumCount"
                        min={0}
                        defaultValue={artist?.albumCount ?? ""}
                        placeholder="30"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                    <p className="text-xs text-gray-400 mt-1">Stat del Hero (sección &ldquo;La historia&rdquo;).</p>
                </div>
                <div>
                    <label htmlFor="careerYears" className="block text-sm font-bold text-gray-700">
                        Años de carrera
                    </label>
                    <input
                        type="number"
                        name="careerYears"
                        id="careerYears"
                        min={0}
                        defaultValue={artist?.careerYears ?? ""}
                        placeholder="25"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold"
                    />
                    <p className="text-xs text-gray-400 mt-1">Se muestra como &ldquo;{`{n}`} años&rdquo;.</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Artist Image</label>

                {artist?.imageUrl && (
                    <div className="mb-4 p-2 border border-gray-100 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                        <div className="relative h-32 w-32">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={artist.imageUrl} alt="Current" className="h-full w-full object-cover rounded" />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Upload New Image (GCS)</label>
                        <input
                            type="file"
                            name="imageFile"
                            id="imageFile"
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
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Manual)</label>
                        <input
                            type="text"
                            name="imageUrl"
                            id="imageUrl"
                            defaultValue={artist?.imageUrl || ""}
                            placeholder="https://..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold text-sm text-gray-600"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Uploading a file will automatically upload to Google Cloud Storage and override the text URL.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Booking/Calendar Image (Detail View)</label>

                {artist?.bookingImageUrl && (
                    <div className="mb-4 p-2 border border-gray-100 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Current Booking Image:</p>
                        <div className="relative h-32 w-32">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={artist.bookingImageUrl} alt="Current Booking" className="h-full w-full object-cover rounded" />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="bookingImageFile" className="block text-sm font-medium text-gray-700">Upload Booking Image (GCS)</label>
                        <input
                            type="file"
                            name="bookingImageFile"
                            id="bookingImageFile"
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
                        <label htmlFor="bookingImageUrl" className="block text-sm font-medium text-gray-700">Booking Image URL (Manual)</label>
                        <input
                            type="text"
                            name="bookingImageUrl"
                            id="bookingImageUrl"
                            defaultValue={artist?.bookingImageUrl || ""}
                            placeholder="https://..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hover Video (Canvas - MP4)</label>

                {/* @ts-ignore - artist type might not be updated in client yet */}
                {artist?.hoverVideoUrl && (
                    <div className="mb-4 p-2 border border-gray-100 rounded bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Current Video (Canvas):</p>
                        <div className="relative h-48 w-32 bg-black rounded overflow-hidden">
                            {/* @ts-ignore */}
                            <video
                                src={artist.hoverVideoUrl}
                                className="h-full w-full object-cover opacity-80"
                                muted
                                loop
                                playsInline
                                autoPlay
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="hoverVideoFile" className="block text-sm font-medium text-gray-700">Upload Video (MP4 - Max 8s recommended)</label>
                        <input
                            type="file"
                            name="hoverVideoFile"
                            id="hoverVideoFile"
                            accept="video/mp4"
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
                        <label htmlFor="hoverVideoUrl" className="block text-sm font-medium text-gray-700">Video URL (Manual)</label>
                        <input
                            type="text"
                            name="hoverVideoUrl"
                            id="hoverVideoUrl"
                            // @ts-ignore
                            defaultValue={artist?.hoverVideoUrl || ""}
                            placeholder="https://..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gold focus:border-gold text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-sm font-bold text-gray-700">Repertorio · Demos</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Las canciones aparecen como chips en la página del artista. Las que tengan MP3 se podrán reproducir en el demo.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addSong}
                        className="bg-gold/10 text-gold-dark border border-gold/40 hover:bg-gold/20 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                    >
                        + Añadir canción
                    </button>
                </div>

                {visibleSongs.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-3">Aún no hay canciones. Pulsa &quot;Añadir canción&quot; para empezar.</p>
                ) : (
                    <div className="space-y-3">
                        {visibleSongs.map((s, displayIdx) => (
                            <div
                                key={s.localId}
                                className="border border-gray-200 rounded-md p-3 bg-gray-50/50 space-y-3"
                            >
                                <div className="flex items-start gap-2">
                                    <div className="flex flex-col gap-1 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => moveSong(s.localId, -1)}
                                            disabled={displayIdx === 0}
                                            className="text-xs text-gray-500 hover:text-gold-dark disabled:opacity-30 disabled:cursor-not-allowed w-5 h-5"
                                            aria-label="Subir"
                                        >▲</button>
                                        <button
                                            type="button"
                                            onClick={() => moveSong(s.localId, 1)}
                                            disabled={displayIdx === visibleSongs.length - 1}
                                            className="text-xs text-gray-500 hover:text-gold-dark disabled:opacity-30 disabled:cursor-not-allowed w-5 h-5"
                                            aria-label="Bajar"
                                        >▼</button>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Título</label>
                                        <input
                                            type="text"
                                            required
                                            value={s.title}
                                            onChange={(e) => updateSong(s.localId, { title: e.target.value })}
                                            placeholder="El Rey"
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSong(s.localId)}
                                        className="mt-5 text-xs text-red-500 hover:text-red-700 underline"
                                    >
                                        Quitar
                                    </button>
                                </div>

                                {s.mp3Url && !s.fileKey && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 shrink-0">MP3 actual:</span>
                                        <audio src={s.mp3Url} controls preload="none" className="h-7 flex-1 min-w-0" />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Subir MP3 (GCS)</label>
                                        <input
                                            type="file"
                                            name={`song-${s.localId}-mp3`}
                                            accept="audio/mpeg,audio/mp3,audio/*"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                updateSong(s.localId, { fileKey: f ? s.localId : undefined })
                                            }}
                                            className="block w-full text-xs text-gray-500
                                                file:mr-3 file:py-1 file:px-2
                                                file:rounded file:border-0
                                                file:text-xs file:font-semibold
                                                file:bg-gold file:text-white
                                                hover:file:bg-gold-dark
                                                cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">o URL manual</label>
                                        <input
                                            type="text"
                                            value={s.mp3Url}
                                            onChange={(e) => updateSong(s.localId, { mp3Url: e.target.value })}
                                            placeholder="https://…/track.mp3"
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">Si subes un archivo, reemplazará la URL manual al guardar.</p>
                            </div>
                        ))}
                    </div>
                )}
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
                    {isSubmitting ? "Saving..." : "Save Artist"}
                </button>
            </div>
        </form>
    )
}
