import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

// Counts a "Boletos" tap and forwards the fan to the ticket vendor.
// Link-preview crawlers (IG/FB/WhatsApp) follow this URL when the page is
// shared, so they are excluded from the count.
const CRAWLER_UA = /bot|crawler|spider|facebookexternalhit|preview|whatsapp/i

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params
    const isCrawler = CRAWLER_UA.test(req.headers.get("user-agent") ?? "")

    const event = isCrawler
        ? await prisma.event.findUnique({ where: { id: eventId }, select: { ticketUrl: true } })
        : await prisma.event
              .update({
                  where: { id: eventId },
                  data: { clickCount: { increment: 1 } },
                  select: { ticketUrl: true },
              })
              .catch(() => null) // P2025: event deleted

    if (!event) {
        redirect("/")
    }

    let url: URL
    try {
        url = new URL(event.ticketUrl)
    } catch {
        redirect("/")
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        redirect("/")
    }

    // 302 so browsers don't cache the redirect and skip the counter next tap.
    return NextResponse.redirect(url, 302)
}
