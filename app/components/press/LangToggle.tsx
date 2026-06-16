"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * EN / ES switch for the public press pages. Swaps the `lang` search param
 * while preserving the current path and any other params. SSR-friendly:
 * the server component reads `?lang=` and renders the right copy.
 */
export default function LangToggle({ lang }: { lang: "en" | "es" }) {
    const pathname = usePathname()
    const params = useSearchParams()

    function hrefFor(next: "en" | "es") {
        const sp = new URLSearchParams(params.toString())
        sp.set("lang", next)
        return `${pathname}?${sp.toString()}`
    }

    const base =
        "px-2.5 py-1 text-xs font-semibold tracking-widest uppercase transition-colors"

    return (
        <div className="inline-flex items-center rounded-full border border-gold/40 overflow-hidden">
            <Link
                href={hrefFor("en")}
                aria-current={lang === "en"}
                className={`${base} ${lang === "en" ? "bg-gold text-[#0a0503]" : "text-cream/70 hover:text-gold"}`}
            >
                EN
            </Link>
            <Link
                href={hrefFor("es")}
                aria-current={lang === "es"}
                className={`${base} ${lang === "es" ? "bg-gold text-[#0a0503]" : "text-cream/70 hover:text-gold"}`}
            >
                ES
            </Link>
        </div>
    )
}
