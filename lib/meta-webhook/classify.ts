/**
 * Spanish DM intent classifier — TS port of meta-ads-mcp/pages/el-as-de-la-sierra/saludos_finder.py.
 *
 * Three concerns:
 *   1. SALUDO requests ("mandeme un saludo") — fans asking for a personalized greeting video.
 *   2. BOOKING inquiries (event/show contracting) — "cuanto la hora", "para una fiesta", etc.
 *   3. CORRIDO commissions (compose/sing a custom song) — a sub-type of booking with different reply.
 *
 * Patterns are matched against lowercased + accent-stripped text.
 */

export type Intent = "saludo" | "booking_general" | "booking_corrido" | "other"
export type Strength = "strong" | "weak"

export interface Classification {
    intent: Intent
    strength: Strength | null
}

export function normalize(text: string): string {
    if (!text) return ""
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
}

// ── Saludo ──────────────────────────────────────────────────────────────────────
const SALUDO_STRONG_PATTERNS = [
    String.raw`\b(mande|manda|mandame|mandeme|mandanme|mandenme|mandan|manden)\s+un\s+salud(?:it)?o`,
    String.raw`\b(tira|tirame|tireme|tiren|tirenme)\s+un\s+salud(?:it)?o`,
    String.raw`\b(regala|regalame|regaleme|regalan|regalen|regalanme|regalenme)\s+un\s+salud(?:it)?o`,
    String.raw`\b(echa|echame|eche|echeme|echen|echenme)\s+un\s+salud(?:it)?o`,
    String.raw`\b(da|dame|den|denme)\s+un\s+salud(?:it)?o`,
    String.raw`\bme\s+(puedes?|pueden)\s+(mandar|tirar|regalar|echar|dar)\s+un\s+salud(?:it)?o`,
    String.raw`\bme\s+(mandas|mandan|tiras|tiran|regalas|regalan|echas|echan|das|dan)\s+un\s+salud(?:it)?o`,
    String.raw`\bpor\s+(fa|favor|favorcito|fis|piedad)[^.!?]{0,20}\s+un\s+salud(?:it)?o`,
    String.raw`\bun\s+salud(?:it)?o\s+(porfa|porfis|porfavor|por\s+favor)`,
    String.raw`\bsaludeme|saludenme|saludame|saludaname`,
    String.raw`\bquier(o|emos|en)\s+un\s+salud(?:it)?o`,
    String.raw`\bnecesit(o|amos)\s+un\s+salud(?:it)?o`,
    String.raw`\bsalud(?:it)?o\s+para\b`,
    String.raw`\bun\s+salud(?:it)?o\s+a\b`,
]
const SALUDO_WEAK_PATTERN = String.raw`\bsalud(?:it)?os?\b`

const SALUDO_STRONG_RE = new RegExp(SALUDO_STRONG_PATTERNS.join("|"), "i")
const SALUDO_WEAK_RE = new RegExp(SALUDO_WEAK_PATTERN, "i")

// ── Booking (general event/show contracting) ───────────────────────────────────
const BOOKING_STRONG_PATTERNS = [
    String.raw`\bcontratarl[oe]\b`,
    String.raw`\bquiero\s+contratar`,
    String.raw`\bnecesit[oa]\s+contratar`,
    String.raw`\bme\s+gustaria\s+contratar`,
    String.raw`\b(como|de\s+que\s+forma)\s+(le\s+hago|hago|hacemos)\s+para\s+contratar`,
    String.raw`\bpara\s+contratar(l[oe])?\b`,
    String.raw`\bpodemos\s+contratar`,
    String.raw`\bpodria\s+contratar`,
    String.raw`\bse\s+puede\s+contratar`,
    String.raw`\bcontrataciones\b`,
    String.raw`\bcontrat[ao]\s+(directo|para|del|de\s+un|en|con)`,
    String.raw`\bcuant[oa]\s+(cobr|cuesta|vale|sale|por|la\s+hora|el\s+show|el\s+toque|toc[aá]r|pid)`,
    String.raw`\bque\s+precio`,
    String.raw`\bcual\s+es\s+(el|su)\s+(precio|costo|tarif|cobr)`,
    String.raw`\bprecio\s+(de|para|por)\s+(contrat|toc(?:ar|ad)|fies|present|hora|show|noche|venir|ir)`,
    String.raw`\btarifa(s)?\b`,
    String.raw`\bcosto\s+(de|para|por)\s+(contrat|toc(?:ar|ad)|fies|present|venir|ir|el\s+show|la\s+present)`,
    String.raw`\bpara\s+(una|mi|el|los)\s+(fiesta|boda|tocada|posada|reuni[oó]n|kerm[eé]s|present|gradua|cumplea|aniversari)`,
    String.raw`\bpara\s+(unos|mis|los)\s+(xv|quincea|15\s+a)`,
    String.raw`\btocada\s+(privada|en|para|exclusiv)`,
    String.raw`\bse\s+puede\s+tocar\s+(en|para)`,
    String.raw`\b(viene|puede\s+venir|vendria)\s+(a|para)\s+(tocar|cantar|presentarse)`,
    String.raw`\bdisponibilidad\s+(para|en|el|la|este|esta)`,
    String.raw`\bestaria\s+disponible`,
    String.raw`\bestan?\s+disponibles?\s+(para|el|la|en|este|esta)`,
    String.raw`\bagendar(l[oe])?\b`,
    String.raw`\bagenda\s+(disponible|para)`,
    String.raw`\b(reservar|reservacion)\s+(para|de|para\s+el)`,
    String.raw`\bpresupuesto(s)?\b`,
    String.raw`\bcotiza(r|ci[oó]n)\b`,
    String.raw`\bcotizame|cotizame`,
    String.raw`\b(contacto|numero|telefono|whats|whatsapp)\s+(de|para|del)\s+(contrat|present|booking|manage|repres|infor.*contrat)`,
    String.raw`\b(info|informacion|informes)\s+(de|para|sobre|acerca\s+de)\s+(contrat|present|toc(?:ar|ad)|fies|booking|costo|precio)`,
    String.raw`\bbooking\b`,
    String.raw`\bmanager\s+(de|del|para)`,
    String.raw`\b(anda|esta)\s+(en|por|disponible)\s+(mexico|estados\s+unidos|usa|california|texas|tijuana|guadalajara)`,
]
const BOOKING_WEAK_PATTERN = String.raw`\b(contrat|cobr|cuesta|tarifa|presupuesto|cotiza|booking|disponibilidad|precio)`

const BOOKING_STRONG_RE = new RegExp(BOOKING_STRONG_PATTERNS.join("|"), "i")
const BOOKING_WEAK_RE = new RegExp(BOOKING_WEAK_PATTERN, "i")

// ── Corrido (broad mention — for intent tagging) ───────────────────────────────
const CORRIDO_PATTERNS = [
    String.raw`\bcorrid[oa]s?\b`,
    String.raw`\b(hacer|escribir|crear|componer)\s+(un|una|el|la|unos|unas|otro|otra|los|las|mi|me|nos)\s*(corrid|canci[oó]n|tema)`,
    String.raw`\b(cantar|cantarlo|cantarmela|cantarmelo)\s+(un|una|el|la|unos|unas)\s+(corrid|canci[oó]n|tema)`,
    String.raw`\b(por|para|sobre)\s+(hacer|componer|cantar|escribir)\s+(un|una|el|la)\s+(corrid|canci[oó]n|tema)`,
    String.raw`\bcomponerlo\b`,
    String.raw`\bcantarlo\b`,
    String.raw`\bcomponer\s+y\s+cantar`,
    String.raw`\bcanci[oó]n\s+(personalizad|para\s+mi|para\s+un|nueva)`,
    String.raw`\b(cuant[oa]|por)\s+(cobr|cuesta|sale|vale|por)\s+(.{0,15}?)\b(corrid|canci[oó]n|tema|letra)`,
    String.raw`\bme\s+(componen|hagan|escriban|hace|haga)\b`,
    String.raw`\b(letra|rola|tema)\s+(personalizad|para\s+mi|nueva|original)`,
]
const CORRIDO_RE = new RegExp(CORRIDO_PATTERNS.join("|"), "i")

// ── Corrido ASK (specific commission requests — admit to booking pool) ─────────
const CORRIDO_ASK_PATTERNS = [
    String.raw`\b(quiero|queremos|necesito|necesitamos|me\s+gustaria|nos\s+gustaria|busco|buscamos)\s+(un|una|otro|otra|que|que\s+me|que\s+nos)?\s*(le|les)?\s*(hagan|haga|compongan|componer|escriban|crear|cantar|haga[nm]|escribir)?\s*(un|una|el|la|otro|otra|me|nos)?\s*(corrid|canci[oó]n|tema|rola|letra)`,
    String.raw`\bme\s+(componen|compone|hagan|haga|escriban|escriba|hace|crean|crea|hicieran|escribieran|escribieras)\b`,
    String.raw`\b(hacer|componer|escribir|crear|cantar)\s+(un|una|otro|otra|el|la|mi|me|nos|otra)\s+(corrid|canci[oó]n|tema|rola|letra)\b`,
    String.raw`\b(canci[oó]n|rola|letra|tema|corrido)\s+(personalizad|para\s+mi|nueva\s+y\s+original|propia|original|nuestra)`,
    String.raw`\bcomponerlo\b`,
    String.raw`\bcantarlo\b`,
    String.raw`\bcomponer\s+y\s+cantar`,
    String.raw`\bsi\s+(me|nos)\s+(componen|escriben|hacen|cantan)\s+`,
    String.raw`\b(suban|sube)\s+un?\s+(corrid|canci[oó]n|tema)\s+(que|para|mio|mia)`,
]
const CORRIDO_ASK_RE = new RegExp(CORRIDO_ASK_PATTERNS.join("|"), "i")

/** Saludo classifier: 'strong' = verb-cued request, 'weak' = mention only, null = no match. */
export function classifySaludo(text: string): Strength | null {
    if (!text) return null
    const norm = normalize(text)
    if (SALUDO_STRONG_RE.test(norm)) return "strong"
    if (SALUDO_WEAK_RE.test(norm)) return "weak"
    return null
}

/** Booking classifier (includes corrido commission asks). */
export function classifyBooking(text: string): Strength | null {
    if (!text) return null
    const norm = normalize(text)
    if (BOOKING_STRONG_RE.test(norm)) return "strong"
    if (CORRIDO_ASK_RE.test(norm)) return "strong"
    if (BOOKING_WEAK_RE.test(norm)) return "weak"
    return null
}

/** Within a booking match, decide if it's a corrido commission or general booking. */
export function classifyBookingIntent(text: string): "corrido" | "general" {
    return text && CORRIDO_RE.test(normalize(text)) ? "corrido" : "general"
}

/**
 * Top-level intent: prefers booking over saludo when both match (e.g. "cuanto cobra
 * por hacer un corrido y mandame un saludo" goes to booking_corrido). The user
 * always cares more about booking inquiries — those are revenue.
 */
export function classify(text: string): Classification {
    const booking = classifyBooking(text)
    if (booking) {
        const sub = classifyBookingIntent(text)
        return {
            intent: sub === "corrido" ? "booking_corrido" : "booking_general",
            strength: booking,
        }
    }
    const saludo = classifySaludo(text)
    if (saludo) {
        return { intent: "saludo", strength: saludo }
    }
    return { intent: "other", strength: null }
}
