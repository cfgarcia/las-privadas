import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { dictionary } from "@/app/i18n/dictionaries"
import LangToggle from "@/app/components/press/LangToggle"

export const revalidate = 300

type Lang = "en" | "es"
type PageProps = { searchParams: Promise<{ lang?: string }> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { lang } = await searchParams
    const t = dictionary[lang === "es" ? "es" : "en"].press
    const title = `Las Privadas — ${t.roster_title}`
    return { title, description: t.roster_intro, openGraph: { title, description: t.roster_intro } }
}

export default async function PressRosterPage({ searchParams }: PageProps) {
    const { lang: langParam } = await searchParams
    const lang: Lang = langParam === "es" ? "es" : "en"
    const t = dictionary[lang].press
    const q = lang === "es" ? "?lang=es" : ""

    const artists = await prisma.artist.findMany({
        where: { isPressPublished: true, slug: { not: null } },
        orderBy: { order: "asc" },
        select: {
            id: true, name: true, slug: true, genre: true, imageUrl: true, bookingImageUrl: true,
            pressPhotos: { orderBy: { order: "asc" }, take: 1, select: { webUrl: true, url: true } },
        },
    })

    return (
        <main className="min-h-screen bg-[#0a0503] text-cream">
            <div className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
                <div className="flex items-center justify-between mb-10">
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-cream/50">Las Privadas</p>
                    <LangToggle lang={lang} />
                </div>

                <header className="text-center mb-12">
                    <h1 className="font-western text-4xl sm:text-5xl text-gold tracking-wide">{t.roster_title}</h1>
                    <p className="font-body italic text-cream/60 mt-2 text-sm uppercase tracking-widest">{t.roster_subtitle}</p>
                    <div className="w-16 h-px bg-gold/60 mx-auto mt-5" aria-hidden />
                    <p className="font-body text-sm text-cream/70 mt-6 max-w-md mx-auto leading-relaxed">{t.roster_intro}</p>
                </header>

                {artists.length === 0 ? (
                    <p className="font-body italic text-center text-cream/50 py-12">—</p>
                ) : (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {artists.map((a) => (
                            <li key={a.id}>
                                <Link href={`/press/${a.slug}${q}`} className="group block">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gold/25 bg-leather-dark/40">
                                        {(a.pressPhotos[0]?.webUrl || a.pressPhotos[0]?.url || a.imageUrl || a.bookingImageUrl) ? (
                                            <Image
                                                src={(a.pressPhotos[0]?.webUrl || a.pressPhotos[0]?.url || a.imageUrl || a.bookingImageUrl)!}
                                                alt={a.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, 200px"
                                                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-leather-dark to-[#0a0503]">
                                                <span className="font-western text-gold/70 text-center px-2">{a.name}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                                            <p className="font-western text-sm text-cream leading-tight">{a.name}</p>
                                            {a.genre && <p className="font-body text-[10px] uppercase tracking-widest text-gold/80 mt-0.5">{a.genre}</p>}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-center font-body text-[10px] uppercase tracking-widest text-cream/50 group-hover:text-gold transition-colors">{t.view_epk} →</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <footer className="text-center mt-16">
                    <p className="font-body italic text-cream/40 text-xs">Las Privadas · Booking · lasprivadas.com</p>
                </footer>
            </div>
        </main>
    )
}
