import { describe, it, expect } from 'vitest'
import { laTodayStart, formatEventDate } from '@/lib/events'

describe('laTodayStart', () => {
    it('returns a valid date pinned to UTC midnight', () => {
        const d = laTodayStart()
        expect(d.getTime()).not.toBeNaN()
        expect(d.getUTCHours()).toBe(0)
        expect(d.getUTCMinutes()).toBe(0)
        expect(d.getUTCSeconds()).toBe(0)
    })
})

describe('formatEventDate', () => {
    it('formats in es-MX', () => {
        const date = new Date('2026-08-01T00:00:00Z')
        expect(formatEventDate(date, { day: 'numeric', month: 'long' })).toMatch(/1 de agosto/)
    })

    it('uses UTC components so a midnight-UTC date does not drift to the previous day', () => {
        const date = new Date('2026-08-01T00:00:00Z')
        // In a negative-offset local zone, a naive format could show July 31.
        expect(formatEventDate(date, { day: 'numeric' })).toBe('1')
    })
})
