import type { Gender } from "./gender"
import type { Intent } from "./classify"

export const PHONE = "+13238551112"

export const GREETING_MALE = "Que tal mi compa"
export const GREETING_FEMALE = "Que tal oiga"

// General booking (event/show contracting) — mentions "fechas"
const TEMPLATE_GENERAL =
    "{greeting} le dejamos el número para dudas y contrataciones, es {phone} " +
    "es directamente con la persona que se encarga de las fechas. " +
    "Un bonito saludo muchas gracias por el apoyo y quedamos al pendiente"

// Corrido commission (compose/sing a song) — drops "fechas", says "peticiones y corridos"
const TEMPLATE_CORRIDO =
    "{greeting} le dejamos el número para peticiones y corridos, es {phone} " +
    "es directamente con la persona que se encarga. " +
    "Un bonito saludo muchas gracias por el apoyo y quedamos al pendiente"

export type ReplyVariant = "general" | "corrido"

/** Choose the right template for an inquiry's intent. */
export function variantForIntent(intent: Intent): ReplyVariant {
    return intent === "booking_corrido" ? "corrido" : "general"
}

export function renderResponse(gender: Gender, variant: ReplyVariant): string {
    const greeting = gender === "male" ? GREETING_MALE : GREETING_FEMALE
    const template = variant === "corrido" ? TEMPLATE_CORRIDO : TEMPLATE_GENERAL
    return template.replace("{greeting}", greeting).replace("{phone}", PHONE)
}
