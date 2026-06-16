import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { laTodayStart, formatEventDate } from "@/lib/events"
import { dictionary } from "@/app/i18n/dictionaries"
import LangToggle from "@/app/components/press/LangToggle"
import VideoEmbed from "@/app/components/press/VideoEmbed"
import PressGallery, { type GalleryPhoto } from "@/app/components/press/PressGallery"

export const revalidate = 300

type Lang = "en" | "es"
type PageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ lang?: string }>
}

function resolveLang(v?: string): Lang {
    return v === "es" ? "es" : "en"
}

function compact(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`
    return `${n}`
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const { lang: langParam } = await searchParams
    const lang = resolveLang(langParam)
    const artist = await prisma.artist.findUnique({
        where: { slug },
        select: { name: true, imageUrl: true, isPressPublished: true, pressTaglineEn: true, pressTaglineEs: true, tagline: true },
    })
    if (!artist || !artist.isPressPublished) notFound()
    const tagline =
        (lang === "es" ? artist.pressTaglineEs : artist.pressTaglineEn) || artist.tagline || ""
    const title = `${artist.name} — Press Kit | Las Privadas`
    return {
        title,
        description: tagline,
        openGraph: {
            title,
            description: tagline,
            type: "profile",
            images: artist.imageUrl ? [artist.imageUrl] : [],
        },
        twitter: { card: "summary_large_image", title, description: tagline, images: artist.imageUrl ? [artist.imageUrl] : [] },
    }
}

export default async function PressKitPage({ params, searchParams }: PageProps) {
    const { slug } = await params
    const { lang: langParam } = await searchParams
    const lang = resolveLang(langParam)
    const t = dictionary[lang].press

    const artist = await prisma.artist.findUnique({
        where: { slug },
        include: {
            pressPhotos: { orderBy: { order: "asc" } },
            pressAssets: { orderBy: { order: "asc" } },
            events: { where: { isPublished: true, date: { gte: laTodayStart() } }, orderBy: { date: "asc" } },
        },
    })
    if (!artist || !artist.isPressPublished) notFound()

    const q = lang === "es" ? "?lang=es" : ""
    const tagline = (lang === "es" ? artist.pressTaglineEs : artist.pressTaglineEn) || artist.tagline || ""
    const bioShort = (lang === "es" ? artist.bioShortEs : artist.bioShortEn) || artist.description
    const bioLong = lang === "es" ? artist.bioLongEs : artist.bioLongEn

    const stats = (artist.pressStats ?? null) as null | {
        monthlyListeners?: number
        topTrack?: string
        topTrackStreams?: number
        followers?: Record<string, number>
        asOf?: string
    }
    const quotes = (artist.pressQuotes ?? []) as { text: string; source?: string; lang?: string }[]
    const contacts = (artist.pressContacts ?? []) as { name: string; role?: string; phone?: string; email?: string }[]

    const galleryPhotos: GalleryPhoto[] = artist.pressPhotos.map((p) => ({
        id: p.id,
        displayUrl: p.webUrl || p.url,
        downloadHref: `/press/${slug}/download/${p.id}`,
        caption: p.caption,
        credit: p.credit,
        orientation: p.orientation,
    }))

    const listenLinks = [
        { label: "Spotify", url: artist.spotifyUrl },
        { label: "YouTube", url: artist.youtubeUrl },
        { label: "Apple Music", url: artist.appleMusicUrl },
        { label: "Instagram", url: artist.instagramUrl },
        { label: "TikTok", url: artist.tiktokUrl },
        { label: "Facebook", url: artist.facebookUrl },
    ].filter((l) => !!l.url)

    const primaryAssets = artist.pressAssets.filter((a) => ["epk_pdf", "onesheet_pdf"].includes(a.kind))
    const otherAssets = artist.pressAssets.filter((a) => !["epk_pdf", "onesheet_pdf", "data_doc"].includes(a.kind))

    const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
        <section id={id} className="mt-12">
            <h2 className="font-western text-xs tracking-[0.3em] uppercase text-gold mb-4">{label}</h2>
            {children}
        </section>
    )

    return (
        <main className="min-h-screen bg-[#0a0503] text-cream">
            <div className="max-w-md mx-auto px-5 py-8 sm:py-12">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <Link href={`/press${q}`} className="font-body text-xs uppercase tracking-widest text-cream/50 hover:text-gold transition-colors">
                        ← {t.back_to_roster}
                    </Link>
                    <LangToggle lang={lang} />
                </div>

                {/* Hero */}
                <header className="flex flex-col items-center text-center">
                    {(() => {
                        // Prefer the curated press cover (first press photo) over the
                        // artist's general imageUrl, which the booking pages use.
                        const heroImg = artist.pressPhotos[0]?.webUrl || artist.pressPhotos[0]?.url || artist.imageUrl
                        return heroImg ? (
                            <div className="relative w-48 aspect-[4/5] mb-6 rounded-2xl overflow-hidden ring-2 ring-gold ring-offset-4 ring-offset-[#0a0503]">
                                <Image src={heroImg} alt={artist.name} fill sizes="192px" priority className="object-cover object-top" />
                            </div>
                        ) : null
                    })()}
                    {artist.genre && (
                        <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold/80 mb-2">{artist.genre}</p>
                    )}
                    <h1 className="font-western text-4xl sm:text-5xl text-gold tracking-wide leading-none">{artist.name}</h1>
                    {tagline && <p className="font-body italic text-cream/70 mt-3 text-sm leading-relaxed max-w-xs">{tagline}</p>}
                    <div className="flex gap-3 mt-6">
                        <a href={`/artist/${artist.id}?type=negocio`} className="rounded-lg bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0a0503] hover:bg-gold-dark transition-colors">{t.book_now}</a>
                        <a href="#downloads" className="rounded-lg border border-gold/50 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gold hover:border-gold transition-colors">{t.download_kit}</a>
                    </div>
                </header>

                {/* Watch */}
                {artist.liveVideoUrl && (
                    <Section id="watch" label={t.watch}>
                        <VideoEmbed url={artist.liveVideoUrl} title={`${artist.name} — live`} />
                    </Section>
                )}

                {/* Stats */}
                {stats && (
                    <Section id="stats" label={t.stats}>
                        <div className="grid grid-cols-2 gap-2.5">
                            {typeof stats.monthlyListeners === "number" && (
                                <div className="rounded-xl border border-gold/25 bg-leather-dark/40 p-4">
                                    <p className="font-western text-2xl text-gold">{compact(stats.monthlyListeners)}</p>
                                    <p className="font-body text-[10px] uppercase tracking-widest text-cream/60 mt-1">{t.monthly_listeners}</p>
                                </div>
                            )}
                            {typeof stats.topTrackStreams === "number" && (
                                <div className="rounded-xl border border-gold/25 bg-leather-dark/40 p-4">
                                    <p className="font-western text-2xl text-gold">{compact(stats.topTrackStreams)}</p>
                                    <p className="font-body text-[10px] uppercase tracking-widest text-cream/60 mt-1">{t.streams_top}</p>
                                </div>
                            )}
                            {typeof artist.careerYears === "number" && (
                                <div className="rounded-xl border border-gold/25 bg-leather-dark/40 p-4">
                                    <p className="font-western text-2xl text-gold">{artist.careerYears}</p>
                                    <p className="font-body text-[10px] uppercase tracking-widest text-cream/60 mt-1">{t.years_career}</p>
                                </div>
                            )}
                            {stats.followers && (
                                <div className="rounded-xl border border-gold/25 bg-leather-dark/40 p-4">
                                    <p className="font-western text-2xl text-gold">
                                        {compact(Object.values(stats.followers).reduce((a, b) => a + (b || 0), 0))}
                                    </p>
                                    <p className="font-body text-[10px] uppercase tracking-widest text-cream/60 mt-1">{t.followers}</p>
                                </div>
                            )}
                        </div>
                        {stats.asOf && <p className="font-body text-[10px] text-cream/40 mt-2">{t.as_of} {stats.asOf}</p>}
                    </Section>
                )}

                {/* Listen */}
                {listenLinks.length > 0 && (
                    <Section id="listen" label={t.listen}>
                        <div className="flex flex-wrap gap-2">
                            {listenLinks.map((l) => (
                                <a key={l.label} href={l.url!} target="_blank" rel="noopener noreferrer"
                                   className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream/80 hover:text-gold hover:border-gold transition-colors">
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Bio */}
                <Section id="bio" label={t.bio}>
                    <p className="font-body text-sm leading-relaxed text-cream/85">{bioShort}</p>
                    {bioLong && (
                        <details className="group mt-3">
                            <summary className="cursor-pointer list-none font-body text-xs uppercase tracking-widest text-gold hover:text-gold-light">
                                <span className="group-open:hidden">+ {t.read_more}</span>
                                <span className="hidden group-open:inline">− {t.read_less}</span>
                            </summary>
                            <div className="mt-3 space-y-3">
                                {bioLong.split("\n\n").map((para, i) => (
                                    <p key={i} className="font-body text-sm leading-relaxed text-cream/75">{para}</p>
                                ))}
                            </div>
                        </details>
                    )}
                </Section>

                {/* Photos */}
                {galleryPhotos.length > 0 && (
                    <Section id="photos" label={t.photos}>
                        <p className="font-body text-xs text-cream/50 mb-3">{t.photos_note}</p>
                        <PressGallery photos={galleryPhotos} downloadLabel={`${t.download} · ${t.hi_res}`} />
                    </Section>
                )}

                {/* Quotes */}
                {quotes.length > 0 && (
                    <Section id="press" label={t.press_quotes}>
                        <div className="space-y-4">
                            {quotes.map((quote, i) => (
                                <blockquote key={i} className="border-l-2 border-gold/50 pl-4">
                                    <p className="font-body italic text-cream/85 text-sm leading-relaxed">“{quote.text}”</p>
                                    {quote.source && <cite className="font-body not-italic text-[11px] uppercase tracking-widest text-gold/70 mt-1 block">— {quote.source}</cite>}
                                </blockquote>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Shows */}
                {artist.events.length > 0 && (
                    <Section id="shows" label={t.shows}>
                        <ul className="space-y-3">
                            {artist.events.map((event) => {
                                const label = formatEventDate(event.date, { weekday: "short", day: "numeric", month: "short" })
                                return (
                                    <li key={event.id} className="flex items-baseline justify-between gap-3 border-b border-cream/10 pb-2">
                                        <div>
                                            <p className="font-body text-sm text-cream">{event.title || event.venue}</p>
                                            <p className="font-body text-xs text-cream/60">{event.venue} · {event.city}{event.state ? `, ${event.state}` : ""}</p>
                                        </div>
                                        <span className="font-body text-xs text-gold whitespace-nowrap">{label}{event.isSoldOut ? " · SOLD OUT" : ""}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </Section>
                )}

                {/* For venues */}
                <Section id="venues" label={t.for_venues}>
                    <p className="font-body text-sm text-cream/70">{t.for_venues_note}</p>
                </Section>

                {/* Booking */}
                {contacts.length > 0 && (
                    <Section id="booking" label={t.booking}>
                        <div className="space-y-3">
                            {contacts.map((c, i) => (
                                <div key={i} className="rounded-xl border border-gold/25 bg-leather-dark/40 p-4">
                                    <p className="font-western text-lg text-cream">{c.name}</p>
                                    {c.role && <p className="font-body text-[10px] uppercase tracking-widest text-gold/80 mb-1.5">{c.role}</p>}
                                    {c.phone && <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="block font-body text-sm text-cream/85 hover:text-gold">{c.phone}</a>}
                                    {c.email && <a href={`mailto:${c.email}`} className="block font-body text-sm text-cream/85 hover:text-gold">{c.email}</a>}
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Downloads */}
                {artist.pressAssets.length > 0 && (
                    <Section id="downloads" label={t.downloads}>
                        <div className="space-y-2">
                            {[...primaryAssets, ...otherAssets].map((a) => (
                                <a key={a.id} href={`/press/${slug}/download/${a.id}`}
                                   className="flex items-center justify-between rounded-lg border border-gold/30 bg-leather-dark/40 px-4 py-3 hover:border-gold transition-colors">
                                    <span className="font-body text-sm text-cream">{lang === "es" ? a.labelEs || a.label : a.label}</span>
                                    <span className="font-body text-[10px] uppercase tracking-widest text-gold">↓ {t.download}</span>
                                </a>
                            ))}
                        </div>
                        {/* Buyer data docs are sent 1:1 by the booker → route to the booking inquiry. */}
                        <a href={`/artist/${artist.id}?type=negocio`} className="mt-5 flex items-center justify-between rounded-lg border border-dashed border-gold/40 px-4 py-3 hover:border-gold transition-colors">
                            <span className="font-body text-sm text-cream/75">{t.data_on_request}</span>
                            <span className="font-body text-[10px] uppercase tracking-widest text-gold whitespace-nowrap">{t.book} →</span>
                        </a>
                    </Section>
                )}

                <footer className="text-center mt-16">
                    <p className="font-body italic text-cream/40 text-xs">Las Privadas · Booking</p>
                </footer>
            </div>
        </main>
    )
}
