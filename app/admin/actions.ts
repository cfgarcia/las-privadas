"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { uploadToGCS } from "@/lib/storage"
import { z } from "zod"

// Validation Schemas
const CreateArtistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().optional().nullable(),
    bookingImageUrl: z.string().optional().nullable(),
    hoverVideoUrl: z.string().optional().nullable(),
})

const UpdateArtistSchema = CreateArtistSchema.extend({
    id: z.string().min(1, "ID is required"),
})

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
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        bookingImageUrl: formData.get("bookingImageUrl"),
        hoverVideoUrl: formData.get("hoverVideoUrl"),
    }

    // Validate string fields
    const validatedData = CreateArtistSchema.parse(rawData)

    let { name, description, imageUrl, bookingImageUrl, hoverVideoUrl } = validatedData
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

    await prisma.artist.create({
        data: {
            name,
            description,
            imageUrl: imageUrl || null,
            bookingImageUrl: bookingImageUrl || null,
            hoverVideoUrl: hoverVideoUrl || null
        },
    })

    revalidatePath("/admin/artists") // Revalidate list
    revalidatePath("/") // Revalidate home
}

export async function updateArtist(formData: FormData) {
    await checkAdmin()

    const rawData = {
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        bookingImageUrl: formData.get("bookingImageUrl"),
        hoverVideoUrl: formData.get("hoverVideoUrl"),
    }

    const validatedData = UpdateArtistSchema.parse(rawData)

    // eslint-disable-next-line prefer-const
    let { id, name, description, imageUrl, bookingImageUrl, hoverVideoUrl } = validatedData
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

        await prisma.artist.update({
            where: { id },
            data: {
                name,
                description,
                imageUrl: imageUrl || null,
                bookingImageUrl: bookingImageUrl || null,
                hoverVideoUrl: hoverVideoUrl || null
            },
        })
    } catch (error) {
        console.error("Server Action Error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to update artist"
        throw new Error(errorMessage)
    }

    revalidatePath("/admin/artists")
    revalidatePath("/")
    revalidatePath(`/artist/${id}`)
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
