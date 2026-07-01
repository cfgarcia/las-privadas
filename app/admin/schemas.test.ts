import { describe, it, expect } from 'vitest'
import { CreateArtistSchema, EventSchema } from './schemas'

describe('CreateArtistSchema', () => {
    const valid = { name: 'El As', slug: 'el-as', description: 'corridos' }

    it('accepts a minimal valid artist', () => {
        expect(CreateArtistSchema.safeParse(valid).success).toBe(true)
    })

    it('rejects a missing name', () => {
        expect(CreateArtistSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
    })

    it('rejects a slug with uppercase or spaces', () => {
        expect(CreateArtistSchema.safeParse({ ...valid, slug: 'El As' }).success).toBe(false)
    })

    it('rejects a negative albumCount', () => {
        expect(CreateArtistSchema.safeParse({ ...valid, albumCount: -1 }).success).toBe(false)
    })

    it('coerces a numeric-string albumCount', () => {
        const parsed = CreateArtistSchema.parse({ ...valid, albumCount: '3' })
        expect(parsed.albumCount).toBe(3)
    })
})

describe('EventSchema', () => {
    const valid = {
        artistId: 'a1',
        date: '2026-08-01',
        venue: 'Arena',
        city: 'Monterrey',
        ticketUrl: 'https://tickets.example.com/x',
        isPublished: true,
        isSoldOut: false,
    }

    it('accepts a valid event', () => {
        expect(EventSchema.safeParse(valid).success).toBe(true)
    })

    it('rejects a malformed date', () => {
        expect(EventSchema.safeParse({ ...valid, date: '2026-8-1' }).success).toBe(false)
    })

    it('rejects a missing venue', () => {
        expect(EventSchema.safeParse({ ...valid, venue: '' }).success).toBe(false)
    })

    it('rejects a non-http(s) ticket URL', () => {
        expect(EventSchema.safeParse({ ...valid, ticketUrl: 'ftp://host/x' }).success).toBe(false)
    })
})
