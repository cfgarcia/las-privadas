"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface ArtistFormProps {
    artist?: {
        id: string
        name: string
        description: string
        imageUrl: string | null
        bookingImageUrl: string | null
        hoverVideoUrl: string | null
    }
    action: (formData: FormData) => Promise<void>
}

export default function ArtistForm({ artist, action }: ArtistFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        if (artist?.id) {
            formData.append("id", artist.id)
        }

        try {
            await action(formData)
            // Redirect handled in server action or manually
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
