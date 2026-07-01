/**
 * Center-out ("pyramid") ordering: given a rank-ordered list (index 0 = rank
 * #1), return a new list where the top-ranked item sits at the visual center of
 * the carousel and subsequent ranks fan out to the sides.
 *
 * Extracted verbatim from the home page so it can be unit-tested. Pure and
 * non-mutating.
 */
export function centerOutOrder<T>(items: readonly T[]): { ordered: T[]; centerIndex: number } {
    const ordered = new Array<T>(items.length)
    let left = Math.floor((items.length - 1) / 2)
    let right = left + 1

    items.forEach((item, i) => {
        if (i % 2 === 0) {
            ordered[left] = item
            left--
        } else {
            ordered[right] = item
            right++
        }
    })

    const centerIndex = Math.floor((items.length - 1) / 2)
    return { ordered, centerIndex }
}
