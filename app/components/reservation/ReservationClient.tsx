'use client'

import { useEffect, useState } from 'react'
import DesktopReservation from './DesktopReservation'
import MobileReservation from './MobileReservation'
import type { Booking, ReservationArtist } from './types'

type Props = {
  artist: ReservationArtist
  similar: ReservationArtist[]
  user?: { name?: string | null; email?: string | null }
}

const MOBILE_BREAKPOINT = 880

export default function ReservationClient({ artist, similar, user }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const submit = async (b: Booking) => {
    const countryLabel = b.country === 'MX' ? 'México' : b.country === 'US' ? 'United States' : 'Other'
    const payload = {
      artistId: artist.id,
      date: b.date.toISOString(),
      hours: Math.max(1, Math.ceil(b.duration / 60)),
      city: b.city,
      state: b.state,
      country: countryLabel,
      clientName: b.name,
      clientEmail: user?.email || null,
      cellphone: b.contact,
      hasWhatsapp: true,
      bookingType: b.eventType === 'negocio' ? 'business' : 'personal',
      venue: null,
      requests: b.requests || null,
    }
    return postBooking(payload)
  }

  if (isMobile === null) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0a0503' }} aria-hidden />
    )
  }

  if (isMobile) {
    return <MobileReservation artist={artist} onSubmitBooking={submit} />
  }
  return (
    <DesktopReservation
      artist={artist}
      similar={similar}
      onSubmitBooking={submit}
    />
  )
}

async function postBooking(payload: Record<string, unknown>): Promise<{ ok: boolean }> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return { ok: res.ok }
  } catch (err) {
    console.error('Booking submit failed', err)
    return { ok: false }
  }
}
