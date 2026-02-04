import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
const chatId = Deno.env.get('TELEGRAM_CHAT_ID')

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

        if (!botToken || !chatId) {
            throw new Error("Missing Telegram Configuration")
        }

        const message = `
<b>New Booking Request!</b> 🎵

<b>Artist:</b> ${artistName}
<b>Date:</b> ${new Date(date).toLocaleDateString()}
<b>Hours:</b> ${hours}

<b>Client Details:</b>
<b>Name:</b> ${clientName}
<b>Location:</b> ${city}, ${state}
<b>Phone:</b> ${cellphone} ${hasWhatsapp ? '(WhatsApp)' : ''}

<pre>Booking ID: ${bookingId}</pre>
    `

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

        const response = await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        })

        const data = await response.json()

        if (!data.ok) {
            console.error("Telegram error:", data)
            return new Response(JSON.stringify({ error: data.description }), {
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
