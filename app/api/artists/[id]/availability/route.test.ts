import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
    prisma: {
        availability: { findMany: vi.fn() },
        booking: { findMany: vi.fn() },
    },
}))

import { GET } from './route'
import { prisma } from '@/lib/prisma'

function get(id = 'artist-1') {
    return GET(new Request(`http://localhost/api/artists/${id}/availability`), {
        params: Promise.resolve({ id }),
    })
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/artists/[id]/availability', () => {
    it('returns an empty list when there is no data', async () => {
        vi.mocked(prisma.availability.findMany).mockResolvedValue([] as never)
        vi.mocked(prisma.booking.findMany).mockResolvedValue([] as never)

        const res = await get()

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ dates: [] })
    })

    it('maps a pending booking to a PENDING date', async () => {
        vi.mocked(prisma.availability.findMany).mockResolvedValue([] as never)
        vi.mocked(prisma.booking.findMany).mockResolvedValue([
            { date: new Date('2026-08-01T00:00:00Z'), status: 'PENDING' },
        ] as never)

        const { dates } = await (await get()).json()

        expect(dates).toContainEqual({ date: '2026-08-01', status: 'PENDING' })
    })

    it('returns 500 when the query throws', async () => {
        vi.mocked(prisma.availability.findMany).mockRejectedValue(new Error('db down'))

        const res = await get()

        expect(res.status).toBe(500)
    })
})
