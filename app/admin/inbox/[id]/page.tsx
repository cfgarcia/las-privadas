import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { detectGender } from "@/lib/meta-webhook/gender"
import { renderResponse, variantForIntent } from "@/lib/meta-webhook/templates"
import type { Intent } from "@/lib/meta-webhook/classify"
import { isWithinReplyWindow } from "@/lib/meta-webhook/graph-api"
import ReplyActions from "./_components/reply-actions"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ id: string }>
}

function buildThreadUrl(
    platform: string,
    pageId: string,
    conversationId: string | null,
    senderUsername: string | null,
): string {
    if (platform === "messenger") {
        if (!conversationId) {
            return `https://business.facebook.com/latest/inbox/all/?asset_id=${pageId}`
        }
        return `https://business.facebook.com/latest/inbox/all/?asset_id=${pageId}&item_id=${conversationId}`
    }
    if (platform === "instagram") {
        const handle = senderUsername?.trim()
        if (handle && /^[A-Za-z0-9._]+$/.test(handle)) {
            return `https://www.instagram.com/${handle}/`
        }
        return "https://www.instagram.com/direct/inbox/"
    }
    return ""
}

export default async function InquiryPage({ params }: PageProps) {
    const { id } = await params
    const inquiry = await prisma.metaInquiry.findUnique({
        where: { id },
        include: { artist: true },
    })
    if (!inquiry) notFound()

    const sender = inquiry.senderUsername || inquiry.senderName || inquiry.senderPsid
    const gender = detectGender(inquiry.senderUsername || inquiry.senderName)
    const draft = renderResponse(gender, variantForIntent(inquiry.intent as Intent))
    const within24h = isWithinReplyWindow(inquiry.receivedAt)
    const canApiSend = inquiry.platform === "messenger" && within24h && !!inquiry.artist?.metaPageToken
    const threadUrl = buildThreadUrl(
        inquiry.platform,
        inquiry.pageId,
        inquiry.conversationId,
        inquiry.senderUsername,
    )

    return (
        <div className="space-y-6">
            <div>
                <Link href="/admin/inbox" className="text-sm text-gray-600 hover:text-gray-900">
                    ← Volver al inbox
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-xl font-semibold">{sender}</h2>
                    <span className="text-sm text-gray-500">
                        {inquiry.platform === "instagram" ? "Instagram" : "Facebook Messenger"} ·{" "}
                        {inquiry.artist?.name ?? "?"} · {inquiry.receivedAt.toISOString().slice(0, 16).replace("T", " ")} UTC
                    </span>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Mensaje original</div>
                    <p className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-900">
                        {inquiry.messageText}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-500">Detectado:</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        intent: {inquiry.intent}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        gender: {gender}
                    </span>
                    {canApiSend ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Within 24h — API send disponible
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                            Outside 24h — copy + open thread
                        </span>
                    )}
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        status: {inquiry.status}
                    </span>
                </div>

                <ReplyActions
                    inquiryId={inquiry.id}
                    initialDraft={draft}
                    canApiSend={canApiSend}
                    threadUrl={threadUrl}
                    initialStatus={inquiry.status}
                    initialReplyText={inquiry.replyText}
                />
            </div>
        </div>
    )
}
