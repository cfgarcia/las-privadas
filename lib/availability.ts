/**
 * Availability status merge. Extracted from the availability route so the
 * priority logic is unit-testable. Pure — takes plain rows, returns plain rows.
 *
 * Status priority per date: UNAVAILABLE (explicit, or >= 2 bookings) >
 * CONFIRMED (1 booking) > PENDING (1 booking) > AVAILABLE (0, omitted).
 */
export type AvailabilityStatus = 'UNAVAILABLE' | 'CONFIRMED' | 'PENDING' | 'AVAILABLE'

export interface AvailabilityRow {
    date: string // YYYY-MM-DD (UTC calendar day)
    status: string
}

const dayKey = (date: Date) => date.toISOString().split('T')[0]

export function computeAvailability(
    unavailableSlots: ReadonlyArray<{ date: Date }>,
    bookings: ReadonlyArray<{ date: Date; status: string }>,
): AvailabilityRow[] {
    const map = new Map<string, { count: number; status: string }>()

    for (const slot of unavailableSlots) {
        map.set(dayKey(slot.date), { count: 0, status: 'UNAVAILABLE' })
    }

    for (const booking of bookings) {
        const key = dayKey(booking.date)
        const current = map.get(key) || { count: 0, status: 'AVAILABLE' }
        if (current.status === 'UNAVAILABLE') continue // explicit unavailable wins

        const newCount = current.count + 1
        let newStatus = current.status
        if (newCount >= 2) {
            newStatus = 'UNAVAILABLE'
        } else if (booking.status === 'CONFIRMED') {
            newStatus = 'CONFIRMED'
        } else if (booking.status === 'PENDING' && newStatus !== 'CONFIRMED') {
            newStatus = 'PENDING'
        }

        map.set(key, { count: newCount, status: newStatus })
    }

    return Array.from(map.entries()).map(([date, { status }]) => ({ date, status }))
}
