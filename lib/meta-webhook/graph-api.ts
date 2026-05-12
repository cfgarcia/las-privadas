/**
 * Thin Graph API helpers for sending DM replies and fetching sender profiles.
 * Used by /api/inquiries/[id]/reply.
 */

const GRAPH_VERSION = "v23.0"
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`

export interface SendResult {
    ok: boolean
    messageId?: string
    error?: string
    code?: number
    isOutsideWindow?: boolean
}

/** Send a Messenger or Instagram reply. recipientId = PSID (FB) or IGSID (IG). */
export async function sendReply(
    pageToken: string,
    recipientId: string,
    text: string,
): Promise<SendResult> {
    if (!pageToken || !recipientId || !text) {
        return { ok: false, error: "missing pageToken, recipientId, or text" }
    }
    try {
        const resp = await fetch(`${GRAPH_BASE}/me/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text },
                messaging_type: "RESPONSE",
                access_token: pageToken,
            }),
        })
        const data = await resp.json()
        if (data.error) {
            const code = data.error.code as number
            const subcode = data.error.error_subcode as number | undefined
            // 24h window violations: code 10 / subcode 2018278, or code 100 / subcode 2018108
            const isOutsideWindow =
                (code === 10 && subcode === 2018278) ||
                (code === 100 && subcode === 2018108) ||
                /outside.*allowed.*window/i.test(data.error.message || "")
            return {
                ok: false,
                error: data.error.message || "Graph API error",
                code,
                isOutsideWindow,
            }
        }
        return { ok: true, messageId: data.message_id }
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
}

/** Best-effort fetch of a sender's profile (FB only — IG profile lookup needs extra perms). */
export async function getSenderProfile(
    pageToken: string,
    psid: string,
): Promise<{ name?: string; username?: string }> {
    try {
        const url = new URL(`${GRAPH_BASE}/${psid}`)
        url.searchParams.set("fields", "name,username")
        url.searchParams.set("access_token", pageToken)
        const resp = await fetch(url.toString())
        const data = await resp.json()
        if (data.error) return {}
        return { name: data.name, username: data.username }
    } catch {
        return {}
    }
}

/** Hours since an ISO timestamp. Used to gate API send (Meta's 24h window). */
export function hoursSince(iso: string | Date): number {
    const dt = typeof iso === "string" ? new Date(iso) : iso
    return (Date.now() - dt.getTime()) / 3_600_000
}

export function isWithinReplyWindow(receivedAt: string | Date): boolean {
    return hoursSince(receivedAt) <= 24
}
