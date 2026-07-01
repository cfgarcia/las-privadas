import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
    prisma: { metaInquiry: { findUnique: vi.fn(), update: vi.fn() } },
}))
vi.mock('@/lib/meta-webhook/graph-api', () => ({
    sendReply: vi.fn(),
    isWithinReplyWindow: vi.fn(),
}))

import { POST } from './route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendReply, isWithinReplyWindow } from '@/lib/meta-webhook/graph-api'

const asAdmin = () => vi.mocked(auth).mockResolvedValue({ user: { role: 'ADMIN' } } as never)

function post(body: unknown, id = 'inq-1') {
    const req = new NextRequest(`http://localhost/api/inquiries/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify(body),
    })
    return POST(req, { params: Promise.resolve({ id }) })
}

beforeEach(() => vi.clearAllMocks())

describe('POST /api/inquiries/[id]/reply', () => {
    it('returns 401 for a non-admin session', async () => {
        vi.mocked(auth).mockResolvedValue(null as never)
        expect((await post({ text: 'hola' })).status).toBe(401)
    })

    it('returns 400 when text is empty', async () => {
        asAdmin()
        expect((await post({ text: '   ' })).status).toBe(400)
    })

    it('returns 404 when the inquiry does not exist', async () => {
        asAdmin()
        vi.mocked(prisma.metaInquiry.findUnique).mockResolvedValue(null as never)
        expect((await post({ text: 'hola' })).status).toBe(404)
    })

    it('records a manual reply without calling the Graph API', async () => {
        asAdmin()
        vi.mocked(prisma.metaInquiry.findUnique).mockResolvedValue({
            id: 'inq-1', receivedAt: new Date(), artist: { metaPageToken: 'tok' },
        } as never)
        vi.mocked(prisma.metaInquiry.update).mockResolvedValue({ id: 'inq-1', status: 'replied_manual' } as never)

        const res = await post({ text: 'hola', mode: 'manual' })

        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ ok: true, action: 'replied_manual' })
        expect(sendReply).not.toHaveBeenCalled()
    })

    it('sends via the Graph API in auto mode when within the reply window', async () => {
        asAdmin()
        vi.mocked(prisma.metaInquiry.findUnique).mockResolvedValue({
            id: 'inq-1', receivedAt: new Date(), senderPsid: 'psid', artist: { metaPageToken: 'tok' },
        } as never)
        vi.mocked(isWithinReplyWindow).mockReturnValue(true)
        vi.mocked(sendReply).mockResolvedValue({ ok: true, messageId: 'm1' } as never)
        vi.mocked(prisma.metaInquiry.update).mockResolvedValue({ id: 'inq-1', status: 'replied_api' } as never)

        const res = await post({ text: 'hola', mode: 'auto' })

        expect(res.status).toBe(200)
        expect(await res.json()).toMatchObject({ ok: true, action: 'replied_api' })
        expect(sendReply).toHaveBeenCalledOnce()
    })
})
