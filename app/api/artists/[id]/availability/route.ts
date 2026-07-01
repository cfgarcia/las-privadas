import { prisma } from "@/lib/prisma"
import { computeAvailability } from "@/lib/availability"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // 1. Get dates explicitly marked as unavailable
        const unavailableSlots = await prisma.availability.findMany({
            where: {
                artistId: id,
                isAvailable: false,
            },
            select: { date: true },
        })

        // 2. Get dates with pending or confirmed bookings
        const bookings = await prisma.booking.findMany({
            where: {
                artistId: id,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
            select: { date: true, status: true },
        })

        // Merge explicit unavailability + booking counts into per-date statuses.
        const dates = computeAvailability(unavailableSlots, bookings)

        return NextResponse.json({ dates })
    } catch (error) {
        console.error("Error fetching availability:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
