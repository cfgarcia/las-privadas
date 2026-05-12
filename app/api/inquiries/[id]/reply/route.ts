import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendReply, isWithinReplyWindow } from "@/lib/meta-webhook/graph-api"

export const runtime = "nodejs"

interface RouteParams {
    params: Promise<{ id: string }>
}

/**
 * POST /api/inquiries/[id]/reply
 * Body: { text: string, mode?: "auto" | "manual" }
 *
 * - "auto" (default): try Graph API send if within 24h window, else fall back to manual.
 * - "manual": just record the reply text without sending (user pasted in app).
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json().catch(() => null)
    const text: string | undefined = body?.text
    const mode: "auto" | "manual" = body?.mode === "manual" ? "manual" : "auto"
    if (!text || !text.trim()) {
        return NextResponse.json({ error: "text required" }, { status: 400 })
    }

    const inquiry = await prisma.metaInquiry.findUnique({
        where: { id },
        include: { artist: true },
    })
    if (!inquiry) {
        return NextResponse.json({ error: "not found" }, { status: 404 })
    }

    const pageToken = inquiry.artist?.metaPageToken
    const canApiSend =
        mode === "auto" &&
        !!pageToken &&
        isWithinReplyWindow(inquiry.receivedAt)

    let action: "replied_api" | "replied_manual" = "replied_manual"
    let apiResult: Awaited<ReturnType<typeof sendReply>> | null = null

    if (canApiSend) {
        apiResult = await sendReply(pageToken!, inquiry.senderPsid, text)
        if (apiResult.ok) {
            action = "replied_api"
        } else if (apiResult.isOutsideWindow) {
            // Meta refused due to 24h gate (rare timing edge); record as manual so user pastes
            action = "replied_manual"
        } else {
            // Hard error — surface to UI so user can retry / fall back
            return NextResponse.json(
                { error: apiResult.error ?? "Graph API failed", code: apiResult.code },
                { status: 502 },
            )
        }
    }

    const updated = await prisma.metaInquiry.update({
        where: { id },
        data: {
            status: action,
            repliedAt: new Date(),
            replyText: text,
        },
    })

    return NextResponse.json({
        ok: true,
        inquiry: updated,
        action,
        apiMessageId: apiResult?.messageId,
    })
}
