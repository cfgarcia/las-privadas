import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

type Filter = "pending" | "replied" | "skipped" | "all"
type IntentFilter = "all" | "booking_general" | "booking_corrido" | "saludo" | "other"

interface SearchParams {
    filter?: string
    intent?: string
}

function intentLabel(intent: string): string {
    switch (intent) {
        case "booking_general": return "Booking"
        case "booking_corrido": return "Corrido"
        case "saludo": return "Saludo"
        default: return "Otro"
    }
}

function intentColor(intent: string): string {
    switch (intent) {
        case "booking_general": return "bg-emerald-100 text-emerald-800"
        case "booking_corrido": return "bg-amber-100 text-amber-800"
        case "saludo": return "bg-sky-100 text-sky-800"
        default: return "bg-gray-100 text-gray-700"
    }
}

function statusBadge(status: string): { label: string; className: string } {
    switch (status) {
        case "pending": return { label: "Pendiente", className: "bg-yellow-100 text-yellow-900" }
        case "replied_api": return { label: "Enviado (API)", className: "bg-green-100 text-green-900" }
        case "replied_manual": return { label: "Enviado (manual)", className: "bg-green-50 text-green-800" }
        case "skipped": return { label: "Saltado", className: "bg-gray-200 text-gray-700" }
        default: return { label: status, className: "bg-gray-100 text-gray-700" }
    }
}

function relativeTime(d: Date): string {
    const hours = (Date.now() - d.getTime()) / 3_600_000
    if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`
    if (hours < 24) return `${Math.round(hours)}h`
    const days = Math.round(hours / 24)
    if (days < 60) return `${days}d`
    return `${Math.round(days / 30)}mo`
}

export default async function InboxPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const sp = await searchParams
    const filter: Filter = ["pending", "replied", "skipped", "all"].includes(sp.filter ?? "")
        ? (sp.filter as Filter)
        : "pending"
    const intent: IntentFilter = ["all", "booking_general", "booking_corrido", "saludo", "other"].includes(sp.intent ?? "")
        ? (sp.intent as IntentFilter)
        : "all"

    const where: Record<string, unknown> = {}
    if (filter === "pending") where.status = "pending"
    else if (filter === "replied") where.status = { in: ["replied_api", "replied_manual"] }
    else if (filter === "skipped") where.status = "skipped"
    if (intent !== "all") where.intent = intent

    const [inquiries, counts] = await Promise.all([
        prisma.metaInquiry.findMany({
            where,
            orderBy: { receivedAt: "desc" },
            include: { artist: { select: { name: true } } },
            take: 200,
        }),
        prisma.metaInquiry.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),
    ])
    const countByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count._all]))

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-semibold">Inbox de DMs</h2>
                <div className="text-sm text-gray-600">
                    {countByStatus.pending ?? 0} pendientes ·{" "}
                    {(countByStatus.replied_api ?? 0) + (countByStatus.replied_manual ?? 0)} respondidas ·{" "}
                    {countByStatus.skipped ?? 0} saltadas
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 text-sm">
                {(["pending", "replied", "skipped", "all"] as const).map((f) => (
                    <Link
                        key={f}
                        href={{ pathname: "/admin/inbox", query: { filter: f, intent } }}
                        className={`px-3 py-1 rounded-full border ${filter === f ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                        {f === "pending" ? "Pendientes" : f === "replied" ? "Respondidas" : f === "skipped" ? "Saltadas" : "Todas"}
                    </Link>
                ))}
                <span className="mx-2 text-gray-300">|</span>
                {(["all", "booking_general", "booking_corrido", "saludo", "other"] as const).map((i) => (
                    <Link
                        key={i}
                        href={{ pathname: "/admin/inbox", query: { filter, intent: i } }}
                        className={`px-3 py-1 rounded-full border ${intent === i ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                        {i === "all" ? "Todos" : intentLabel(i)}
                    </Link>
                ))}
            </div>

            {/* List */}
            {inquiries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                    No hay inquiries que coincidan con los filtros.
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                    {inquiries.map((iq) => {
                        const sb = statusBadge(iq.status)
                        const platformTag = iq.platform === "instagram" ? "IG" : "FB"
                        const sender = iq.senderUsername || iq.senderName || iq.senderPsid
                        return (
                            <li key={iq.id}>
                                <Link
                                    href={`/admin/inbox/${iq.id}`}
                                    className="flex items-start gap-3 p-4 hover:bg-gray-50"
                                >
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                                        {platformTag}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium truncate">{sender}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${intentColor(iq.intent)}`}>
                                                {intentLabel(iq.intent)}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${sb.className}`}>
                                                {sb.label}
                                            </span>
                                            <span className="ml-auto text-xs text-gray-500">
                                                {relativeTime(iq.receivedAt)} · {iq.artist?.name ?? "?"}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                                            {iq.messageText}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
