import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials")
        // Don't fail hard on missing creds if it's just email that fails, but logging is vital
    }
    const supabase = (supabaseUrl && supabaseKey)
        ? createClient(supabaseUrl, supabaseKey)
        : null

    try {
        const body = await request.json()
        console.log("[API] Booking Request Body:", body)

        const { artistId, date, hours, city, state, clientName, clientEmail, cellphone, hasWhatsapp, bookingType, venue } = body
        // Simple validation
        if (!artistId || !date || !hours || !city || !state || !clientName || !cellphone) {
            console.error("[API] Missing fields:", { artistId, date, hours, city, state, clientName, cellphone })
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Fetch artist details for the email
        const artist = await prisma.artist.findUnique({
            where: { id: artistId },
        })

        if (!artist) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 })
        }

        console.log("[API] Creating booking in DB...")
        const booking = await prisma.booking.create({
            data: {
                artistId,
                date: new Date(date),
                hours: parseInt(hours),
                city,
                state,
                clientName,
                clientEmail,
                cellphone,
                hasWhatsapp,
                bookingType: bookingType || "personal", // Default if missing
                venue: venue || null,
                status: "PENDING",
            },
        })
        console.log("[API] Booking created:", booking.id)

        // Call Supabase Edge Function (Telegram)
        if (supabase) {
            const { error: funcError } = await supabase.functions.invoke('send-booking-telegram', {
                body: {
                    artistName: artist.name,
                    date: date, // Keep original string for easy parsing or use ISO
                    hours,
                    city,
                    state,
                    clientName,
                    clientEmail,
                    cellphone,
                    hasWhatsapp,
                    bookingType: bookingType || "personal",
                    venue: venue || null,
                    bookingId: booking.id
                }
            })
            if (funcError) {
                console.error("Failed to invoke Edge Function:", funcError)
            } else {
                console.log(`[NOTIFICATION] Edge Function invoked for booking ${booking.id}`)
            }
        } else {
            console.warn("[NOTIFICATION] Supabase client not initialized, skipping email.")
        }

        return NextResponse.json({ success: true, booking })
    } catch (error) {
        console.error("Booking error:", error)
        return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 })
    }
}
