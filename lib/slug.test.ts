import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/slug'

describe('slugify', () => {
    it('lowercases and hyphenates a name', () => {
        expect(slugify('El As de la Sierra')).toBe('el-as-de-la-sierra')
    })

    it('strips accents and the tilde from ñ', () => {
        expect(slugify('Ñoño Ríos')).toBe('nono-rios')
    })

    it('collapses runs of non-alphanumerics and trims edge hyphens', () => {
        expect(slugify('  Hello   World!! ')).toBe('hello-world')
    })

    it('preserves numbers', () => {
        expect(slugify('Grupo 5')).toBe('grupo-5')
    })

    it('is idempotent on an existing slug', () => {
        expect(slugify('el-as')).toBe('el-as')
    })
})
