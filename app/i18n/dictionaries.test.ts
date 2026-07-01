import { describe, it, expect } from 'vitest'
import { dictionary } from './dictionaries'

// Collect every leaf key path (e.g. "home.hero.title") of a nested dictionary.
function leafPaths(obj: unknown, prefix = ''): string[] {
    if (obj === null || typeof obj !== 'object') return [prefix]
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        leafPaths(v, prefix ? `${prefix}.${k}` : k),
    )
}

function leafValues(obj: unknown): unknown[] {
    if (obj === null || typeof obj !== 'object') return [obj]
    return Object.values(obj as Record<string, unknown>).flatMap(leafValues)
}

describe('i18n dictionary parity', () => {
    it('has identical key trees for es and en', () => {
        const es = leafPaths(dictionary.es).sort()
        const en = leafPaths(dictionary.en).sort()
        // Surface exactly which keys differ, in either direction.
        expect(es.filter((k) => !en.includes(k))).toEqual([])
        expect(en.filter((k) => !es.includes(k))).toEqual([])
    })

    it('has only non-empty string (or number) leaves — no empty or TODO placeholders', () => {
        for (const locale of ['es', 'en'] as const) {
            for (const value of leafValues(dictionary[locale])) {
                expect(typeof value === 'string' || typeof value === 'number').toBe(true)
                if (typeof value === 'string') {
                    expect(value.trim().length).toBeGreaterThan(0)
                    // Uppercase placeholder markers only (avoid matching the
                    // Spanish word "Todo" in e.g. "Descargar Todo").
                    expect(value).not.toMatch(/\b(TODO|FIXME|MISSING|TBD)\b/)
                }
            }
        }
    })
})
