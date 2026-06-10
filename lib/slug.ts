// Build a URL-safe slug from a display name: strips accents (Ñ → n),
// lowercases, and collapses anything non-alphanumeric into single hyphens.
export function slugify(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}
