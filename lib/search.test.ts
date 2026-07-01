import { describe, it, expect } from 'vitest'
import { normalize, filterArtists } from '@/lib/search'

describe('normalize', () => {
    it('lowercases and strips diacritics', () => {
        expect(normalize('José María')).toBe('jose maria')
    })

    it('strips the tilde from ñ', () => {
        expect(normalize('Ñoño')).toBe('nono')
    })

    it('returns an empty string for null/undefined/empty', () => {
        expect(normalize(null)).toBe('')
        expect(normalize(undefined)).toBe('')
        expect(normalize('')).toBe('')
    })
})

describe('filterArtists', () => {
    const artists = [
        { name: 'El As de la Sierra', description: 'corridos' },
        { name: 'Leonel El Ranchero', description: 'banda sinaloense' },
    ]

    it('returns all artists when the query is empty or whitespace', () => {
        expect(filterArtists(artists, '')).toEqual(artists)
        expect(filterArtists(artists, '   ')).toEqual(artists)
    })

    it('matches by name, accent- and case-insensitively', () => {
        expect(filterArtists(artists, 'as de la sierra')).toEqual([artists[0]])
        expect(filterArtists(artists, 'LEONEL')).toEqual([artists[1]])
    })

    it('matches by description', () => {
        expect(filterArtists(artists, 'sinaloense')).toEqual([artists[1]])
    })

    it('returns an empty array when nothing matches', () => {
        expect(filterArtists(artists, 'reggaeton')).toEqual([])
    })
})
