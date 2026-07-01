import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the data layer + notification transport so we test handler logic only.
vi.mock('@/lib/prisma', () => ({
    prisma: {
        artist: { findUnique: vi.fn() },
        booking: { create: vi.fn() },
    },
}))
const invoke = vi.fn().mockResolvedValue({ error: null })
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({ functions: { invoke } })),
}))

import { POST } from './route'
import { prisma } from '@/lib/prisma'

const VALID = {
    artistId: 'artist-1',
    date: '2026-08-01',
    hours: '3',
    city: 'Monterrey',
    state: 'NL',
    clientName: 'Cliente',
    cellphone: '8110000000',
}

function post(body: unknown) {
    return POST(
        new Request('http://localhost/api/bookings', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
        }),
    )
}

beforeEach(() => {
    vi.clearAllMocks()
})
afterEach(() => {
    vi.unstubAllEnvs()
})

describe('POST /api/bookings', () => {
    it('returns 400 when a required field is missing', async () => {
        const res = await post({ ...VALID, artistId: undefined })
        expect(res.status).toBe(400)
        expect(await res.json()).toMatchObject({ error: 'Missing required fields' })
        expect(prisma.booking.create).not.toHaveBeenCalled()
    })

    it('returns 404 when the artist does not exist', async () => {
        vi.mocked(prisma.artist.findUnique).mockResolvedValue(null as never)
        const res = await post(VALID)
        expect(res.status).toBe(404)
        expect(prisma.booking.create).not.toHaveBeenCalled()
    })

    it('creates a PENDING booking and returns 200 on the happy path', async () => {
        vi.mocked(prisma.artist.findUnique).mockResolvedValue({ id: 'artist-1', name: 'El As' } as never)
        vi.mocked(prisma.booking.create).mockResolvedValue({ id: 'bk-1' } as never)

        const res = await post(VALID)

        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ success: true, booking: { id: 'bk-1' } })
        expect(vi.mocked(prisma.booking.create).mock.calls[0][0].data).toMatchObject({
            artistId: 'artist-1',
            hours: 3, // coerced to int
            status: 'PENDING',
        })
    })

    it('still returns 200 when the notification edge function fails (does not block the booking)', async () => {
        vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://x.supabase.co')
        vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key')
        vi.mocked(prisma.artist.findUnique).mockResolvedValue({ id: 'artist-1', name: 'El As' } as never)
        vi.mocked(prisma.booking.create).mockResolvedValue({ id: 'bk-2' } as never)
        invoke.mockResolvedValueOnce({ error: { message: 'edge fn down' } })

        const res = await post(VALID)

        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ success: true })
    })
})
