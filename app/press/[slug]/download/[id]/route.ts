import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

// Counts a press-asset / press-photo download and forwards to the GCS file.
// Link-preview crawlers are excluded from the count (same pattern as /go).
const CRAWLER_UA = /bot|crawler|spider|facebookexternalhit|preview|whatsapp/i

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string; id: string }> },
) {
    const { id } = await params
    const isCrawler = CRAWLER_UA.test(req.headers.get("user-agent") ?? "")

    // The id may belong to a PressAsset (PDF/logo/data doc) or a PressPhoto.
    let target: string | null = null

    const asset = isCrawler
        ? await prisma.pressAsset.findUnique({ where: { id }, select: { url: true } })
        : await prisma.pressAsset
              .update({
                  where: { id },
                  data: { downloadCount: { increment: 1 } },
                  select: { url: true },
              })
              .catch(() => null)
    if (asset) target = asset.url

    if (!target) {
        const photo = isCrawler
            ? await prisma.pressPhoto.findUnique({ where: { id }, select: { url: true } })
            : await prisma.pressPhoto
                  .update({
                      where: { id },
                      data: { downloadCount: { increment: 1 } },
                      select: { url: true },
                  })
                  .catch(() => null)
        if (photo) target = photo.url
    }

    if (!target) {
        redirect("/press")
    }

    let url: URL
    try {
        url = new URL(target)
    } catch {
        redirect("/press")
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        redirect("/press")
    }

    return NextResponse.redirect(url, 302)
}
