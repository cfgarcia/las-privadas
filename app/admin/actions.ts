"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { uploadToGCS } from "@/lib/storage"
import { z } from "zod"
import {
    CreateArtistSchema,
    UpdateArtistSchema,
    SongsMetaSchema,
    EventSchema,
    UpdateEventSchema,
} from "./schemas"

function isUniqueViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

type ResolvedSong = {
    localId: string
    dbId: string | null
    title: string
    mp3Url: string | null
    order: number
    removed: boolean
}

async function resolveSongsFromForm(formData: FormData): Promise<ResolvedSong[]> {
    const raw = formData.get("songsMeta")
    if (typeof raw !== "string" || !raw) return []
    let parsed: z.infer<typeof SongsMetaSchema>
    try {
        parsed = SongsMetaSchema.parse(JSON.parse(raw))
    } catch (err) {
        console.error("Invalid songsMeta payload:", err)
        throw new Error("Invalid songs payload")
    }

    const resolved: ResolvedSong[] = []
    for (const s of parsed) {
        let mp3Url: string | null = s.mp3Url.trim() ? s.mp3Url.trim() : null
        if (s.hasNewFile && !s.removed) {
            const file = formData.get(`song-${s.localId}-mp3`) as File | null
            if (file && file.size > 0) {
                mp3Url = await uploadToGCS(file, "audio")
            }
        }
        resolved.push({
            localId: s.localId,
            dbId: s.dbId ?? null,
            title: s.title.trim(),
            mp3Url,
            order: s.order,
            removed: s.removed,
        })
    }
    return resolved
}

async function persistSongsForArtist(artistId: string, songs: ResolvedSong[]) {
    const ops: Array<Promise<unknown>> = []
    for (const s of songs) {
        if (s.removed) {
            if (s.dbId) {
                ops.push(prisma.song.delete({ where: { id: s.dbId } }))
            }
            continue
        }
        if (!s.title) continue // skip blanks
        if (s.dbId) {
            ops.push(
                prisma.song.update({
                    where: { id: s.dbId },
                    data: { title: s.title, mp3Url: s.mp3Url, order: s.order },
                }),
            )
        } else {
            ops.push(
                prisma.song.create({
                    data: { artistId, title: s.title, mp3Url: s.mp3Url, order: s.order },
                }),
            )
        }
    }
    if (ops.length) {
        await Promise.all(ops)
    }
}

async function checkAdmin() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }
}

export async function updateBookingStatus(bookingId: string, status: string) {
    await checkAdmin()

    await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
    })

    revalidatePath("/admin/bookings")
}

export async function deleteBooking(bookingId: string) {
    await checkAdmin()

    await prisma.booking.delete({
        where: { id: bookingId },
    })

    revalidatePath("/admin/bookings")
}

export async function createArtist(formData: FormData) {
    await checkAdmin()

    const rawData = {
        name: formData.get("name"),
        slug: String(formData.get("slug") ?? "").trim() || null,
        tagline: formData.get("tagline"),
        description: formData.get("description"),
        albumCount: formData.get("albumCount") || null,
        careerYears: formData.get("careerYears") || null,
        imageUrl: formData.get("imageUrl"),
        bookingImageUrl: formData.get("bookingImageUrl"),
        hoverVideoUrl: formData.get("hoverVideoUrl"),
    }

    // Validate string fields
    const validatedData = CreateArtistSchema.parse(rawData)

    const { name, slug, tagline, description, albumCount, careerYears } = validatedData
    let { imageUrl, bookingImageUrl, hoverVideoUrl } = validatedData
    const imageFile = formData.get("imageFile") as File | null
    const bookingImageFile = formData.get("bookingImageFile") as File | null
    const hoverVideoFile = formData.get("hoverVideoFile") as File | null

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadToGCS(imageFile)
    }

    if (bookingImageFile && bookingImageFile.size > 0) {
        bookingImageUrl = await uploadToGCS(bookingImageFile)
    }

    if (hoverVideoFile && hoverVideoFile.size > 0) {
        hoverVideoUrl = await uploadToGCS(hoverVideoFile, "videos")
    }

    const resolvedSongs = await resolveSongsFromForm(formData)

    let created
    try {
        created = await prisma.artist.create({
            data: {
                name,
                slug,
                tagline: tagline?.trim() || null,
                description,
                albumCount: albumCount ?? null,
                careerYears: careerYears ?? null,
                imageUrl: imageUrl || null,
                bookingImageUrl: bookingImageUrl || null,
                hoverVideoUrl: hoverVideoUrl || null
            },
        })
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw new Error("Ese slug ya está en uso por otro artista")
        }
        throw error
    }

    if (resolvedSongs.length) {
        await persistSongsForArtist(created.id, resolvedSongs)
    }

    revalidatePath("/admin/artists") // Revalidate list
    revalidatePath("/") // Revalidate home
}

export async function updateArtist(formData: FormData) {
    await checkAdmin()

    const rawData = {
        id: formData.get("id"),
        name: formData.get("name"),
        slug: String(formData.get("slug") ?? "").trim() || null,
        tagline: formData.get("tagline"),
        description: formData.get("description"),
        albumCount: formData.get("albumCount") || null,
        careerYears: formData.get("careerYears") || null,
        imageUrl: formData.get("imageUrl"),
        bookingImageUrl: formData.get("bookingImageUrl"),
        hoverVideoUrl: formData.get("hoverVideoUrl"),
    }

    const validatedData = UpdateArtistSchema.parse(rawData)

    // eslint-disable-next-line prefer-const
    let { id, name, slug, tagline, description, albumCount, careerYears, imageUrl, bookingImageUrl, hoverVideoUrl } = validatedData
    const imageFile = formData.get("imageFile") as File | null
    const bookingImageFile = formData.get("bookingImageFile") as File | null
    const hoverVideoFile = formData.get("hoverVideoFile") as File | null

    try {
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadToGCS(imageFile)
        }

        if (bookingImageFile && bookingImageFile.size > 0) {
            bookingImageUrl = await uploadToGCS(bookingImageFile)
        }

        if (hoverVideoFile && hoverVideoFile.size > 0) {
            hoverVideoUrl = await uploadToGCS(hoverVideoFile, "videos")
        }

        const resolvedSongs = await resolveSongsFromForm(formData)

        await prisma.artist.update({
            where: { id },
            data: {
                name,
                slug,
                tagline: tagline?.trim() || null,
                description,
                albumCount: albumCount ?? null,
                careerYears: careerYears ?? null,
                imageUrl: imageUrl || null,
                bookingImageUrl: bookingImageUrl || null,
                hoverVideoUrl: hoverVideoUrl || null
            },
        })

        await persistSongsForArtist(id, resolvedSongs)
    } catch (error) {
        console.error("Server Action Error:", error)
        if (isUniqueViolation(error)) {
            throw new Error("Ese slug ya está en uso por otro artista")
        }
        const errorMessage = error instanceof Error ? error.message : "Failed to update artist"
        throw new Error(errorMessage)
    }

    revalidatePath("/admin/artists")
    revalidatePath("/")
    revalidatePath(`/artist/${id}`)
    revalidatePath(`/admin/artists/${id}`)
    if (slug) {
        revalidatePath(`/e/${slug}`)
    }
}

// ── Events (public ticket pages) ────────────────────────────────────────────

function eventRawData(formData: FormData) {
    return {
        artistId: formData.get("artistId"),
        title: String(formData.get("title") ?? "").trim() || null,
        date: formData.get("date"),
        venue: formData.get("venue"),
        city: formData.get("city"),
        state: String(formData.get("state") ?? "").trim() || null,
        ticketUrl: formData.get("ticketUrl"),
        flyerUrl: formData.get("flyerUrl"),
        isPublished: formData.get("isPublished") === "on",
        isSoldOut: formData.get("isSoldOut") === "on",
    }
}

async function resolveFlyerUrl(formData: FormData, manualUrl: string | null | undefined): Promise<string | null> {
    const flyerFile = formData.get("flyerFile") as File | null
    if (flyerFile && flyerFile.size > 0) {
        return uploadToGCS(flyerFile, "flyers")
    }
    return manualUrl || null
}

async function revalidateEventPages(artistId: string) {
    revalidatePath("/admin/events")
    const artist = await prisma.artist.findUnique({ where: { id: artistId }, select: { slug: true } })
    if (artist?.slug) {
        revalidatePath(`/e/${artist.slug}`)
    }
}

export async function createEvent(formData: FormData) {
    await checkAdmin()

    const validated = EventSchema.parse(eventRawData(formData))
    const flyerUrl = await resolveFlyerUrl(formData, validated.flyerUrl)

    await prisma.event.create({
        data: {
            artistId: validated.artistId,
            title: validated.title,
            date: new Date(`${validated.date}T00:00:00Z`),
            venue: validated.venue,
            city: validated.city,
            state: validated.state,
            ticketUrl: validated.ticketUrl,
            flyerUrl,
            isPublished: validated.isPublished,
            isSoldOut: validated.isSoldOut,
        },
    })

    await revalidateEventPages(validated.artistId)
}

export async function updateEvent(formData: FormData) {
    await checkAdmin()

    const validated = UpdateEventSchema.parse({ ...eventRawData(formData), id: formData.get("id") })
    const flyerUrl = await resolveFlyerUrl(formData, validated.flyerUrl)

    await prisma.event.update({
        where: { id: validated.id },
        data: {
            artistId: validated.artistId,
            title: validated.title,
            date: new Date(`${validated.date}T00:00:00Z`),
            venue: validated.venue,
            city: validated.city,
            state: validated.state,
            ticketUrl: validated.ticketUrl,
            flyerUrl,
            isPublished: validated.isPublished,
            isSoldOut: validated.isSoldOut,
        },
    })

    await revalidateEventPages(validated.artistId)
}

export async function deleteEvent(eventId: string) {
    await checkAdmin()

    const deleted = await prisma.event.delete({
        where: { id: eventId },
        select: { artistId: true },
    })

    await revalidateEventPages(deleted.artistId)
}

export async function updateArtistOrder(items: { id: string; order: number }[]) {
    await checkAdmin()

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.artist.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        )
    } catch (error) {
        console.error("Failed to update artist order:", error)
        throw new Error("Failed to update order")
    }

    revalidatePath("/admin/artists")
    revalidatePath("/")
}
