import { prisma } from "@/lib/prisma"
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

        // Map to a structured format
        // Status priority: UNAVAILABLE (explicit or >1 booking) > CONFIRMED (1 booking) > PENDING (1 booking) > AVAILABLE (0 bookings)
        const availabilityMap = new Map<string, { count: number; status: string }>()

        // Initialize with explicit unavailable slots
        unavailableSlots.forEach(slot => {
            const dateStr = slot.date.toISOString().split('T')[0]
            availabilityMap.set(dateStr, { count: 0, status: 'UNAVAILABLE' })
        })

        // Process bookings
        bookings.forEach(booking => {
            const dateStr = booking.date.toISOString().split('T')[0]
            const current = availabilityMap.get(dateStr) || { count: 0, status: 'AVAILABLE' }

            // If already unavailable (explicitly), keep it
            if (current.status === 'UNAVAILABLE') return

            const newCount = current.count + 1
            let newStatus = current.status

            if (newCount >= 2) {
                newStatus = 'UNAVAILABLE'
            } else {
                // Count is 1
                if (booking.status === 'CONFIRMED') {
                    newStatus = 'CONFIRMED'
                } else if (booking.status === 'PENDING') {
                    // Update only if not already confirmed (though with count 1 it shouldn't be)
                    if (newStatus !== 'CONFIRMED') {
                        newStatus = 'PENDING'
                    }
                }
            }

            availabilityMap.set(dateStr, { count: newCount, status: newStatus })
        })

        // Filter out 'AVAILABLE' since frontend assumes missing dates are available (or we can send them if we want to be explicit, but map only has interesting dates)
        // Actually, let's just send everything in the map.
        const dates = Array.from(availabilityMap.entries()).map(([date, { status }]) => ({ date, status }))

        return NextResponse.json({ dates })
    } catch (error) {
        console.error("Error fetching availability:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
