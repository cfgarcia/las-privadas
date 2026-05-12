import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

interface RouteParams {
    params: Promise<{ id: string }>
}

/** POST /api/inquiries/[id]/skip — mark as skipped (won't show in pending list). */
export async function POST(_request: NextRequest, { params }: RouteParams) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const updated = await prisma.metaInquiry
        .update({
            where: { id },
            data: { status: "skipped" },
        })
        .catch(() => null)
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 })
    return NextResponse.json({ ok: true, inquiry: updated })
}

/** POST /api/inquiries/[id]/unskip — reopen (used by the [b]ack equivalent). */
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const updated = await prisma.metaInquiry
        .update({
            where: { id },
            data: { status: "pending", repliedAt: null, replyText: null },
        })
        .catch(() => null)
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 })
    return NextResponse.json({ ok: true, inquiry: updated })
}
