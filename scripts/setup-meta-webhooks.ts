/**
 * One-time setup for Meta webhooks.
 *
 * Prerequisites (do these in developers.facebook.com first):
 *   1. App → Webhooks → Page product → Subscribe to fields:
 *        callback URL: https://<your-vercel-domain>/api/webhooks/meta
 *        verify token: <META_WEBHOOK_VERIFY_TOKEN>
 *        fields: messages
 *   2. App → Webhooks → Instagram product → same callback + verify token, fields: messages
 *
 * Then run this script (npx ts-node scripts/setup-meta-webhooks.ts) to:
 *   - Subscribe the FB Page to its app via Graph API
 *   - Subscribe the linked IG Business account
 *   - Seed/update the Artist row for El As with Meta IDs + page token
 *
 * Required env: META_APP_ID, EL_AS_PAGE_ID, EL_AS_IG_ID, EL_AS_PAGE_TOKEN.
 */

import { PrismaClient } from "@prisma/client"

const GRAPH = "https://graph.facebook.com/v23.0"

async function subscribePage(pageId: string, pageToken: string): Promise<void> {
    const url = `${GRAPH}/${pageId}/subscribed_apps`
    const params = new URLSearchParams({
        subscribed_fields: "messages,messaging_postbacks",
        access_token: pageToken,
    })
    const resp = await fetch(`${url}?${params.toString()}`, { method: "POST" })
    const data = await resp.json()
    if (data.error) throw new Error(`subscribe page failed: ${data.error.message}`)
    console.log(`[ok] Page ${pageId} subscribed:`, data)
}

async function subscribeInstagram(igId: string, pageToken: string): Promise<void> {
    const url = `${GRAPH}/${igId}/subscribed_apps`
    const params = new URLSearchParams({
        subscribed_fields: "messages",
        access_token: pageToken,
    })
    const resp = await fetch(`${url}?${params.toString()}`, { method: "POST" })
    const data = await resp.json()
    if (data.error) throw new Error(`subscribe IG failed: ${data.error.message}`)
    console.log(`[ok] IG ${igId} subscribed:`, data)
}

async function seedElAsArtist(
    prisma: PrismaClient,
    pageId: string,
    igId: string,
    pageToken: string,
): Promise<void> {
    const existing = await prisma.artist.findFirst({
        where: { OR: [{ metaPageId: pageId }, { metaIgId: igId }, { name: { contains: "El As" } }] },
    })
    if (existing) {
        const updated = await prisma.artist.update({
            where: { id: existing.id },
            data: { metaPageId: pageId, metaIgId: igId, metaPageToken: pageToken },
        })
        console.log(`[ok] Artist updated: ${updated.id} (${updated.name})`)
    } else {
        const created = await prisma.artist.create({
            data: {
                name: "El As de la Sierra",
                description: "Regional Mexican artist",
                metaPageId: pageId,
                metaIgId: igId,
                metaPageToken: pageToken,
            },
        })
        console.log(`[ok] Artist created: ${created.id} (${created.name})`)
    }
}

async function main(): Promise<void> {
    const pageId = process.env.EL_AS_PAGE_ID
    const igId = process.env.EL_AS_IG_ID
    const pageToken = process.env.EL_AS_PAGE_TOKEN
    if (!pageId || !igId || !pageToken) {
        console.error("Missing env: EL_AS_PAGE_ID, EL_AS_IG_ID, EL_AS_PAGE_TOKEN")
        process.exit(1)
    }
    const prisma = new PrismaClient()
    try {
        await seedElAsArtist(prisma, pageId, igId, pageToken)
        await subscribePage(pageId, pageToken)
        await subscribeInstagram(igId, pageToken)
        console.log("\nDone. Webhook is live; new DMs will land in MetaInquiry.")
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
