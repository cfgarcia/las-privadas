import { describe, it, expect } from 'vitest'
import { computeAvailability } from '@/lib/availability'

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`)
const statusOf = (rows: { date: string; status: string }[], date: string) =>
    rows.find((r) => r.date === date)?.status

describe('computeAvailability', () => {
    it('returns no rows when there are no bookings or unavailable slots', () => {
        expect(computeAvailability([], [])).toEqual([])
    })

    it('marks a single PENDING booking as PENDING', () => {
        const rows = computeAvailability([], [{ date: d('2026-08-01'), status: 'PENDING' }])
        expect(statusOf(rows, '2026-08-01')).toBe('PENDING')
    })

    it('marks a single CONFIRMED booking as CONFIRMED', () => {
        const rows = computeAvailability([], [{ date: d('2026-08-01'), status: 'CONFIRMED' }])
        expect(statusOf(rows, '2026-08-01')).toBe('CONFIRMED')
    })

    it('marks two or more bookings on the same date as UNAVAILABLE regardless of status', () => {
        const rows = computeAvailability([], [
            { date: d('2026-08-01'), status: 'PENDING' },
            { date: d('2026-08-01'), status: 'CONFIRMED' },
        ])
        expect(statusOf(rows, '2026-08-01')).toBe('UNAVAILABLE')
    })

    it('treats an explicit unavailable slot as UNAVAILABLE and it wins over bookings', () => {
        const rows = computeAvailability(
            [{ date: d('2026-08-02') }],
            [{ date: d('2026-08-02'), status: 'CONFIRMED' }],
        )
        expect(statusOf(rows, '2026-08-02')).toBe('UNAVAILABLE')
    })

    it('keys dates by UTC calendar day (YYYY-MM-DD)', () => {
        const rows = computeAvailability([], [{ date: d('2026-12-31'), status: 'PENDING' }])
        expect(rows.map((r) => r.date)).toContain('2026-12-31')
    })
})
