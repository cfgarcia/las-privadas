"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
    inquiryId: string
    initialDraft: string
    canApiSend: boolean
    threadUrl: string
    initialStatus: string
    initialReplyText: string | null
}

type Outcome = { kind: "idle" } | { kind: "ok"; message: string } | { kind: "error"; message: string }

export default function ReplyActions({
    inquiryId,
    initialDraft,
    canApiSend,
    threadUrl,
    initialStatus,
    initialReplyText,
}: Props) {
    const router = useRouter()
    const [draft, setDraft] = useState(initialReplyText ?? initialDraft)
    const [busy, setBusy] = useState(false)
    const [outcome, setOutcome] = useState<Outcome>({ kind: "idle" })
    const [status, setStatus] = useState(initialStatus)

    async function send(mode: "auto" | "manual") {
        setBusy(true)
        setOutcome({ kind: "idle" })
        try {
            const resp = await fetch(`/api/inquiries/${inquiryId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: draft, mode }),
            })
            const data = await resp.json()
            if (!resp.ok) {
                setOutcome({ kind: "error", message: data.error ?? "Error" })
                return
            }
            setStatus(data.action)
            setOutcome({
                kind: "ok",
                message: data.action === "replied_api"
                    ? `Enviado via API (msg id ${data.apiMessageId ?? "?"})`
                    : "Marcado como enviado manualmente",
            })
            router.refresh()
        } catch (err) {
            setOutcome({ kind: "error", message: err instanceof Error ? err.message : String(err) })
        } finally {
            setBusy(false)
        }
    }

    async function copyAndOpen() {
        try {
            await navigator.clipboard.writeText(draft)
            setOutcome({ kind: "ok", message: "Copiado al portapapeles" })
        } catch {
            setOutcome({ kind: "error", message: "No se pudo copiar (usa Cmd+C manualmente)" })
        }
        if (threadUrl) window.open(threadUrl, "_blank")
    }

    async function skip() {
        if (!confirm("¿Saltar este DM? Lo puedes reabrir luego.")) return
        setBusy(true)
        try {
            const resp = await fetch(`/api/inquiries/${inquiryId}/skip`, { method: "POST" })
            if (resp.ok) {
                setStatus("skipped")
                setOutcome({ kind: "ok", message: "Saltado" })
                router.refresh()
            } else {
                setOutcome({ kind: "error", message: "Error al saltar" })
            }
        } finally {
            setBusy(false)
        }
    }

    async function reopen() {
        setBusy(true)
        try {
            const resp = await fetch(`/api/inquiries/${inquiryId}/skip`, { method: "PATCH" })
            if (resp.ok) {
                setStatus("pending")
                setOutcome({ kind: "ok", message: "Reabierto como pendiente" })
                router.refresh()
            } else {
                setOutcome({ kind: "error", message: "Error al reabrir" })
            }
        } finally {
            setBusy(false)
        }
    }

    function reset() {
        setDraft(initialDraft)
        setOutcome({ kind: "idle" })
    }

    const isResolved = status === "replied_api" || status === "replied_manual" || status === "skipped"

    return (
        <div className="space-y-3">
            <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 mb-1 block">
                    Respuesta {draft !== initialDraft && <span className="text-amber-700">(editado)</span>}
                </label>
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={5}
                    disabled={busy}
                    className="w-full rounded-md border border-gray-300 p-3 text-sm font-mono leading-relaxed disabled:bg-gray-50"
                />
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                    <span>{draft.length} chars</span>
                    {draft !== initialDraft && (
                        <button onClick={reset} disabled={busy} className="text-gray-600 hover:text-black underline">
                            Restaurar draft original
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {!isResolved && canApiSend && (
                    <button
                        onClick={() => send("auto")}
                        disabled={busy || !draft.trim()}
                        className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Enviar via API
                    </button>
                )}
                {!isResolved && (
                    <button
                        onClick={copyAndOpen}
                        disabled={busy}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        Copiar + abrir thread
                    </button>
                )}
                {!isResolved && (
                    <button
                        onClick={() => send("manual")}
                        disabled={busy || !draft.trim()}
                        className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                        title="Marca como respondida manualmente sin enviar via API (úsalo después de pegar en el app)"
                    >
                        Marcar como respondida (manual)
                    </button>
                )}
                {!isResolved && (
                    <button
                        onClick={skip}
                        disabled={busy}
                        className="px-4 py-2 rounded-md bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Saltar
                    </button>
                )}
                {isResolved && (
                    <button
                        onClick={reopen}
                        disabled={busy}
                        className="px-4 py-2 rounded-md bg-yellow-100 text-yellow-900 text-sm font-medium border border-yellow-300 hover:bg-yellow-200 disabled:opacity-50"
                    >
                        Reabrir como pendiente
                    </button>
                )}
            </div>

            {outcome.kind === "ok" && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900">
                    ✓ {outcome.message}
                </div>
            )}
            {outcome.kind === "error" && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-900">
                    ✗ {outcome.message}
                </div>
            )}
        </div>
    )
}
