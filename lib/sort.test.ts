import { describe, it, expect } from 'vitest'
import { centerOutOrder } from '@/lib/sort'

describe('centerOutOrder', () => {
    it('places the top-ranked item at the center for an odd count', () => {
        // Arrange
        const items = ['a', 'b', 'c', 'd', 'e'] // 'a' is rank #1

        // Act
        const { ordered, centerIndex } = centerOutOrder(items)

        // Assert
        expect(ordered).toEqual(['e', 'c', 'a', 'b', 'd'])
        expect(centerIndex).toBe(2)
        expect(ordered[centerIndex]).toBe('a')
    })

    it('places the top-ranked item at the center for an even count', () => {
        const items = ['a', 'b', 'c', 'd']

        const { ordered, centerIndex } = centerOutOrder(items)

        expect(ordered).toEqual(['c', 'a', 'b', 'd'])
        expect(centerIndex).toBe(1)
        expect(ordered[centerIndex]).toBe('a')
    })

    it('handles a single item', () => {
        expect(centerOutOrder(['only'])).toEqual({ ordered: ['only'], centerIndex: 0 })
    })

    it('handles an empty list (preserving the original centerIndex formula)', () => {
        expect(centerOutOrder([])).toEqual({ ordered: [], centerIndex: -1 })
    })

    it('keeps the top-ranked item centered for any size', () => {
        for (let n = 1; n <= 12; n++) {
            const items = Array.from({ length: n }, (_, i) => i) // 0 is rank #1
            const { ordered, centerIndex } = centerOutOrder(items)
            expect(ordered[centerIndex]).toBe(0)
            expect(ordered).toHaveLength(n)
            // no items lost or duplicated
            expect([...ordered].sort((a, b) => a - b)).toEqual(items)
        }
    })

    it('does not mutate the input array', () => {
        const items = ['a', 'b', 'c']
        const copy = [...items]
        centerOutOrder(items)
        expect(items).toEqual(copy)
    })
})
