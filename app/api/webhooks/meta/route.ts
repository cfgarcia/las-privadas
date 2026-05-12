import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isValidSignature } from "@/lib/meta-webhook/verify"
import { classify } from "@/lib/meta-webhook/classify"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs" // Need crypto + Prisma; Edge isn't suitable
export const dynamic = "force-dynamic"

/**
 * GET — Meta webhook verification handshake.
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const mode = params.get("hub.mode")
    const token = params.get("hub.verify_token")
    const challenge = params.get("hub.challenge")
    const expected = process.env.META_WEBHOOK_VERIFY_TOKEN

    if (mode === "subscribe" && token && expected && token === expected) {
        return new NextResponse(challenge, {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        })
    }
    return new NextResponse("Forbidden", { status: 403 })
}

interface MessagingEvent {
    sender?: { id?: string; username?: string }
    recipient?: { id?: string }
    timestamp?: number
    message?: {
        mid?: string
        text?: string
        is_echo?: boolean
    }
}

interface WebhookEntry {
    id?: string // page_id (FB) or ig_user_id (IG)
    time?: number
    messaging?: MessagingEvent[]
    changes?: Array<{ field?: string; value?: MessagingEvent }>
}

interface WebhookBody {
    object?: string // "page" | "instagram"
    entry?: WebhookEntry[]
}

/**
 * POST — Meta webhook event delivery.
 * Verifies HMAC signature, parses messaging events, persists MetaInquiry rows,
 * and fires Telegram notifications.
 */
export async function POST(request: NextRequest) {
    const rawBody = await request.text()
    const signature = request.headers.get("x-hub-signature-256")
    const appSecret = process.env.META_APP_SECRET

    if (!appSecret) {
        console.error("[meta-webhook] META_APP_SECRET not configured")
        return NextResponse.json({ error: "server misconfigured" }, { status: 500 })
    }
    if (!isValidSignature(rawBody, signature, appSecret)) {
        console.warn("[meta-webhook] invalid signature")
        return NextResponse.json({ error: "invalid signature" }, { status: 401 })
    }

    let body: WebhookBody
    try {
        body = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: "invalid json" }, { status: 400 })
    }

    const objectType = body.object
    const platform = objectType === "instagram" ? "instagram" : "messenger"

    let processed = 0
    let skipped = 0

    for (const entry of body.entry ?? []) {
        const pageOrIgId = entry.id ?? ""
        // Messenger uses entry.messaging[]; IG sometimes uses entry.changes[].value
        const events: MessagingEvent[] = []
        if (entry.messaging) events.push(...entry.messaging)
        if (entry.changes) {
            for (const ch of entry.changes) {
                if (ch.field === "messages" && ch.value) events.push(ch.value)
            }
        }

        for (const ev of events) {
            const result = await processMessagingEvent(platform, pageOrIgId, ev)
            if (result === "stored") processed++
            else skipped++
        }
    }

    return NextResponse.json({ ok: true, processed, skipped })
}

async function processMessagingEvent(
    platform: "messenger" | "instagram",
    pageOrIgId: string,
    ev: MessagingEvent,
): Promise<"stored" | "skipped"> {
    if (!ev.message?.text) return "skipped"
    if (ev.message.is_echo) return "skipped" // outbound message we sent
    const messageId = ev.message.mid
    if (!messageId) return "skipped"
    const senderId = ev.sender?.id
    if (!senderId) return "skipped"

    // Look up Artist by metaPageId (FB) or metaIgId (IG)
    const artist = await prisma.artist.findFirst({
        where:
            platform === "messenger"
                ? { metaPageId: pageOrIgId }
                : { metaIgId: pageOrIgId },
        select: { id: true, name: true },
    })

    const text = ev.message.text
    const { intent, strength } = classify(text)
    const receivedAt = ev.timestamp ? new Date(ev.timestamp) : new Date()

    try {
        const created = await prisma.metaInquiry.create({
            data: {
                platform,
                artistId: artist?.id ?? null,
                pageId: pageOrIgId,
                senderPsid: senderId,
                senderUsername: ev.sender?.username ?? null,
                senderName: null, // resolved later, best-effort
                messageId,
                messageText: text,
                receivedAt,
                intent,
                intentStrength: strength ?? "weak",
                status: "pending",
            },
        })
        // Fire Telegram notification (best-effort; never fail the webhook on this)
        await notifyTelegram(created.id, artist?.name ?? "(unknown artist)", platform, intent, ev.sender?.username ?? senderId, text)
        return "stored"
    } catch (err: unknown) {
        // Idempotency: duplicate messageId means Meta retried delivery
        const code = (err as { code?: string })?.code
        if (code === "P2002") {
            return "skipped"
        }
        console.error("[meta-webhook] persist error", err)
        return "skipped"
    }
}

async function notifyTelegram(
    inquiryId: string,
    artistName: string,
    platform: "messenger" | "instagram",
    intent: string,
    senderLabel: string,
    text: string,
) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return
    try {
        const supabase = createClient(url, key)
        const baseUrl = process.env.NEXTAUTH_URL ?? ""
        const link = baseUrl ? `${baseUrl}/admin/inbox/${inquiryId}` : `/admin/inbox/${inquiryId}`
        const platformLabel = platform === "instagram" ? "IG" : "FB"
        const intentLabel = intent === "booking_corrido" ? "corrido"
            : intent === "booking_general" ? "booking"
            : intent === "saludo" ? "saludo"
            : "DM"
        const preview = text.replace(/\n/g, " ").slice(0, 120)
        const message = `🎵 Nuevo ${intentLabel} de ${senderLabel} (${platformLabel}) para ${artistName}\n"${preview}"\n→ ${link}`
        // Reuse the existing Edge Function. It accepts arbitrary fields; we only pass the message + a flag so it knows this isn't a structured booking.
        await supabase.functions.invoke("send-booking-telegram", {
            body: { plainMessage: message, inquiryId, source: "meta_webhook" },
        })
    } catch (err) {
        console.error("[meta-webhook] telegram notify failed", err)
    }
}
