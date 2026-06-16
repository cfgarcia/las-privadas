"use client"

import { useRef, useState } from "react"

export type GalleryPhoto = {
    id: string
    displayUrl: string // web-res for the carousel + lightbox
    downloadHref: string // counted download route → hi-res
    caption?: string | null
    credit?: string | null
    orientation?: string | null
}

/**
 * Press photo carousel: horizontal scroll-snap (native swipe on mobile) with
 * prev/next arrows. Click a slide → lightbox with a counted download button.
 */
export default function PressGallery({
    photos,
    downloadLabel,
}: {
    photos: GalleryPhoto[]
    downloadLabel: string
}) {
    const [open, setOpen] = useState<GalleryPhoto | null>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    function scrollByDir(dir: 1 | -1) {
        const el = trackRef.current
        if (!el) return
        el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" })
    }

    return (
        <>
            <div className="relative">
                <div
                    ref={trackRef}
                    className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {photos.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setOpen(p)}
                            className="group relative snap-center shrink-0 w-[78%] sm:w-[46%] aspect-[4/5] overflow-hidden rounded-xl border border-gold/20 bg-leather-dark/40"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={p.displayUrl}
                                alt={p.caption || "Press photo"}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                    ))}
                </div>

                {/* arrows (hidden on small screens — swipe instead) */}
                <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => scrollByDir(-1)}
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 items-center justify-center rounded-full bg-[#0a0503]/90 border border-gold/40 text-gold hover:bg-gold hover:text-[#0a0503] transition-colors"
                >
                    ‹
                </button>
                <button
                    type="button"
                    aria-label="Next"
                    onClick={() => scrollByDir(1)}
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-9 w-9 items-center justify-center rounded-full bg-[#0a0503]/90 border border-gold/40 text-gold hover:bg-gold hover:text-[#0a0503] transition-colors"
                >
                    ›
                </button>
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
                    onClick={() => setOpen(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative max-h-[80vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={open.displayUrl}
                            alt={open.caption || "Press photo"}
                            className="max-h-[80vh] w-auto rounded-lg object-contain"
                        />
                        {(open.caption || open.credit) && (
                            <p className="mt-2 text-center font-body text-xs text-cream/60">
                                {open.caption}
                                {open.credit ? ` · © ${open.credit}` : ""}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex gap-3">
                        <a
                            href={open.downloadHref}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-[#0a0503] transition-colors hover:bg-gold-dark"
                        >
                            {downloadLabel}
                        </a>
                        <button
                            type="button"
                            onClick={() => setOpen(null)}
                            className="rounded-lg border border-cream/30 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-cream/80 transition-colors hover:border-cream/60"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
