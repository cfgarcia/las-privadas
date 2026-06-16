"use client"

import { useState } from "react"

/** Parse a YouTube video id or playlist id from common URL shapes. */
function parseYouTube(url: string): { videoId?: string; listId?: string } {
    try {
        const u = new URL(url)
        const listId = u.searchParams.get("list") || undefined
        let videoId = u.searchParams.get("v") || undefined
        if (!videoId) {
            if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1) || undefined
            else if (u.pathname.startsWith("/shorts/")) videoId = u.pathname.split("/")[2]
            else if (u.pathname.startsWith("/embed/")) videoId = u.pathname.split("/")[2]
        }
        return { videoId, listId }
    } catch {
        return {}
    }
}

/**
 * Lite YouTube embed: shows a poster + play button, loads the iframe only on
 * click (keeps the press page fast). Supports single videos and playlists.
 */
export default function VideoEmbed({ url, title }: { url: string; title: string }) {
    const [active, setActive] = useState(false)
    const { videoId, listId } = parseYouTube(url)
    if (!videoId && !listId) return null

    const poster = videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : undefined

    const src = listId
        ? `https://www.youtube-nocookie.com/embed/${videoId ?? "videoseries"}?list=${listId}&autoplay=1&rel=0`
        : `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`

    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-gold/30 bg-black">
            {active ? (
                <iframe
                    src={src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setActive(true)}
                    aria-label={title}
                    className="group absolute inset-0 h-full w-full"
                >
                    {poster && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={poster}
                            alt={title}
                            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                        />
                    )}
                    <span className="absolute inset-0 bg-black/30" />
                    <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-[#0a0503] shadow-2xl transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                </button>
            )}
        </div>
    )
}
