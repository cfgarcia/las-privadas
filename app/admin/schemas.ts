import { z } from "zod"

// Admin validation schemas. Extracted from actions.ts (a "use server" module,
// which may only export async functions) so they can be imported by unit tests.

export const CreateArtistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug: solo minúsculas, números y guiones")
        .nullable(),
    tagline: z.string().optional().nullable(),
    description: z.string().min(1, "Description is required"),
    albumCount: z.coerce.number().int().nonnegative().optional().nullable(),
    careerYears: z.coerce.number().int().nonnegative().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    bookingImageUrl: z.string().optional().nullable(),
    hoverVideoUrl: z.string().optional().nullable(),
})

export const UpdateArtistSchema = CreateArtistSchema.extend({
    id: z.string().min(1, "ID is required"),
})

const SongMetaSchema = z.object({
    localId: z.string(),
    dbId: z.string().nullable().optional(),
    title: z.string(),
    mp3Url: z.string(),
    order: z.number().int(),
    removed: z.boolean(),
    hasNewFile: z.boolean(),
})
export const SongsMetaSchema = z.array(SongMetaSchema)

export const EventSchema = z.object({
    artistId: z.string().min(1, "Artista requerido"),
    title: z.string().optional().nullable(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
    venue: z.string().min(1, "Lugar requerido"),
    city: z.string().min(1, "Ciudad requerida"),
    state: z.string().optional().nullable(),
    ticketUrl: z
        .url("URL de boletos inválida")
        .refine((u) => /^https?:\/\//.test(u), "La URL debe empezar con http(s)"),
    flyerUrl: z.string().optional().nullable(),
    isPublished: z.coerce.boolean(),
    isSoldOut: z.coerce.boolean(),
})

export const UpdateEventSchema = EventSchema.extend({
    id: z.string().min(1, "ID is required"),
})
