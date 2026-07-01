/**
 * Artist search helpers. Extracted from ArtistCarousel so the accent-insensitive
 * matching is unit-testable. Pure.
 */

/** Lowercase + strip combining diacritics (so "José" matches "jose"). */
export function normalize(s: string | null | undefined): string {
    return (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
}

/** Filter artists by an accent/case-insensitive substring of name or description. */
export function filterArtists<T extends { name: string; description: string }>(
    artists: T[],
    query: string,
): T[] {
    const q = normalize(query.trim())
    if (!q) return artists
    return artists.filter(
        (a) => normalize(a.name).includes(q) || normalize(a.description).includes(q),
    )
}
