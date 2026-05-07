'use client'

import { useState, type UIEvent } from 'react'
import ArtistHero from './ArtistHero'
import BookingPlaque from './BookingPlaque'
import Confirmation from './Confirmation'
import {
  AudioSection,
  BioSection,
  SetlistSection,
  SimilarSection,
} from './ContentSections'
import type { Booking, ReservationArtist } from './types'

type Props = {
  artist: ReservationArtist
  similar: ReservationArtist[]
  onSubmitBooking?: (b: Booking) => Promise<{ ok: boolean }> | { ok: boolean }
}

export default function DesktopReservation({ artist, similar, onSubmitBooking }: Props) {
  const [scrollY, setScrollY] = useState(0)
  const [confirmation, setConfirmation] = useState<Booking | null>(null)

  const handleReserve = async (b: Booking) => {
    const res = (await onSubmitBooking?.(b)) ?? { ok: true }
    if (res.ok) setConfirmation(b)
    else alert('No pudimos enviar tu reserva. Inténtalo de nuevo.')
  }

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollY((e.target as HTMLDivElement).scrollTop)
  }

  return (
    <div
      onScroll={onScroll}
      className="priv-stage"
      style={{
        position: 'relative',
        width: '100%', height: '100dvh',
        overflowY: 'auto',
        background: '#0a0503',
        color: '#fcf6ba',
      }}
    >
      <ArtistHero artist={artist} scrollY={scrollY} />

      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 480px',
        gap: 64,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '80px 64px 120px',
      }}>
        <div style={{ minWidth: 0 }}>
          <BioSection artist={artist} />
          <SetlistSection songs={artist.songs} />
          <AudioSection songs={artist.songs} />
          <SimilarSection others={similar} />
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'sticky', top: 32 }}>
            <BookingPlaque artist={artist} onReserve={handleReserve} />
          </div>
        </div>
      </div>

      <footer style={{
        background: '#0a0503',
        borderTop: '1px solid rgba(232,199,122,0.15)',
        padding: '40px 64px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Rye, serif',
          fontSize: 22,
          letterSpacing: '0.18em',
          background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 50%, #c89d3e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>LAS PRIVADAS</div>
        <div style={{
          marginTop: 6,
          fontFamily: 'Sancreek, cursive',
          fontSize: 9, letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.55)',
        }}>Reservas íntimas · MTY</div>
        <div style={{
          marginTop: 18, fontSize: 11,
          color: 'rgba(252,246,186,0.35)', fontStyle: 'italic',
        }}>© {new Date().getFullYear()} Las Privadas — Hecho a mano</div>
      </footer>

      {confirmation && (
        <Confirmation booking={confirmation} onClose={() => setConfirmation(null)} />
      )}
    </div>
  )
}
