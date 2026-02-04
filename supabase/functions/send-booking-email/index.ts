import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'delivered@resend.dev'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { artistName, date, hours, city, state, clientName, cellphone, hasWhatsapp, bookingId } = await req.json()

        const { data, error } = await resend.emails.send({
            from: 'Artist Booking <onboarding@resend.dev>',
            to: adminEmail,
            subject: `New Booking Request: ${artistName}`,
            html: `
        <h1>New Booking Request</h1>
        <p><strong>Artist:</strong> ${artistName}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Hours:</strong> ${hours}</p>
        
        <h2>Client Details</h2>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Location:</strong> ${city}, ${state}</p>
        <p><strong>Phone:</strong> ${cellphone} ${hasWhatsapp ? '(WhatsApp)' : ''}</p>
        <p><small>Booking ID: ${bookingId}</small></p>
      `,
        })

        if (error) {
            console.error("Resend error:", error)
            return new Response(JSON.stringify({ error }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error("Function error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
