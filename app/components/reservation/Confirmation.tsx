'use client'

import type { ReactNode } from 'react'
import type { Booking } from './types'

const WHATSAPP_NUMBER = '13233879330'

const TIME_LABELS: Record<string, string> = {
  dia: 'Día (11 am – 3 pm)',
  tarde: 'Tarde (4 – 7 pm)',
  noche: 'Noche (8 – 11 pm)',
  madrugada: 'Madrugada',
}
const DURATION_LABELS: Record<number, string> = {
  60: '1 hora',
  120: '2 horas',
  180: '3 horas',
  240: '4 horas',
  300: '5+ horas',
}
const COUNTRY_LABELS: Record<string, string> = {
  MX: 'México',
  US: 'Estados Unidos',
  OTHER: 'Otro país',
}

type Props = {
  booking: Booking
  onClose: () => void
}

export default function Confirmation({ booking, onClose }: Props) {
  const { artist, date, time, duration, country, state, city, eventType, requests, name, contact } = booking
  const dateStr = date
    ? date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  const timeStr = TIME_LABELS[time] || time
  const durStr = DURATION_LABELS[duration] || `${duration} min`
  const countryLabel = COUNTRY_LABELS[country] || country
  const locationStr = [city, state, countryLabel].filter(Boolean).join(', ')
  const eventTypeLabel = eventType === 'negocio' ? 'Evento de negocio' : 'Evento personal'

  const lines = [
    `Hola, soy ${name}. Confirmando mi reserva en Las Privadas:`,
    ``,
    `Artista: ${artist.name}`,
    `Fecha: ${dateStr} · ${timeStr}`,
    `Duración: ${durStr}`,
    `Ubicación: ${locationStr}`,
    `Tipo: ${eventTypeLabel}`,
  ]
  if (requests && requests.trim()) lines.push(`Peticiones: ${requests.trim()}`)
  lines.push(`WhatsApp: ${contact}`)
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
      background: 'radial-gradient(ellipse at 50% 40%, rgba(10,5,3,0.65) 0%, rgba(10,5,3,0.92) 70%)',
      backdropFilter: 'blur(10px) saturate(120%)',
      WebkitBackdropFilter: 'blur(10px) saturate(120%)',
      zIndex: 50,
    }}>
      <div style={{
        position: 'relative',
        width: 520,
        maxWidth: '100%',
        background: 'linear-gradient(155deg, #2a1a10 0%, #1a0e08 55%, #0d0805 100%)',
        boxShadow: [
          'inset 0 0 0 1px rgba(232,199,122,0.55)',
          'inset 0 0 80px rgba(0,0,0,0.55)',
          '0 40px 100px rgba(0,0,0,0.75)',
          '0 0 60px rgba(232,199,122,0.18)',
        ].join(', '),
        color: '#fcf6ba',
        padding: '52px 52px 40px',
        overflow: 'hidden',
        animation: 'priv-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
          opacity: 0.10, mixBlendMode: 'overlay', pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative',
          width: 88, height: 88, margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #f5e7b8 0%, #d4af55 40%, #8F6A1F 80%, #4A3210 100%)',
          boxShadow: '0 8px 22px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Rye, serif',
          fontSize: 14, color: '#2a1505',
          letterSpacing: '0.10em',
          textShadow: '0 1px 0 rgba(255,235,180,0.45)',
          animation: 'priv-pulse-glow 2.4s ease-in-out infinite',
        }}>LP</div>

        <div style={{
          textAlign: 'center',
          fontFamily: 'Sancreek, cursive',
          fontSize: 11, letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.65)',
          marginBottom: 8,
        }}>· Reserva enviada ·</div>

        <h2 style={{
          margin: 0, textAlign: 'center',
          fontFamily: 'Rye, serif',
          fontSize: 34,
          letterSpacing: '0.04em',
          background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 50%, #c89d3e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
        }}>Tu noche está apartada</h2>

        <p style={{
          margin: '14px auto 26px', textAlign: 'center', maxWidth: 360,
          fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
          fontSize: 14, lineHeight: 1.5,
          color: 'rgba(252,246,186,0.70)',
        }}>
          Te contactamos por WhatsApp en menos de 2 horas para cerrar detalles y
          asegurar la fecha con un anticipo del 30%.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, margin: '0 0 22px',
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,199,122,0.45))' }} />
          <span style={{ color: 'rgba(232,199,122,0.85)', fontSize: 7 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(232,199,122,0.45))' }} />
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 20, rowGap: 10,
          fontSize: 13,
          marginBottom: 28,
        }}>
          <ReceiptRow label="Artista" value={artist.name} />
          <ReceiptRow label="Fecha" value={dateStr ? `${dateStr} · ${timeStr}` : '—'} />
          <ReceiptRow label="Duración" value={durStr} />
          <ReceiptRow label="Ubicación" value={locationStr} />
          <ReceiptRow label="Tipo" value={eventTypeLabel} />
          {requests && requests.trim() && (
            <ReceiptRow label="Peticiones" value={requests.trim()} />
          )}
          <ReceiptRow label="Contacto" value={`${name} · ${contact}`} />
        </div>

        <a
          href={wa} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            width: '100%', padding: '16px 22px',
            background: 'linear-gradient(180deg, #1f7d3b 0%, #145a29 100%)',
            border: '1px solid rgba(252,246,186,0.45)',
            color: '#fcf6ba',
            textDecoration: 'none',
            fontFamily: 'Rye, serif',
            fontSize: 15,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 5px 14px rgba(0,0,0,0.50)',
            textShadow: '0 1px 0 rgba(0,0,0,0.45)',
          }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          Confirmar por WhatsApp
        </a>

        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'block', margin: '14px auto 0',
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'rgba(252,246,186,0.55)',
            fontFamily: 'Sancreek, cursive',
            fontSize: 10, letterSpacing: '0.32em',
            textTransform: 'uppercase',
            borderBottom: '1px dotted rgba(232,199,122,0.30)',
            paddingBottom: 1,
          }}
        >Volver a la página del artista</button>
      </div>
    </div>
  )
}

function ReceiptRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <>
      <div style={{
        fontFamily: 'Sancreek, cursive',
        fontSize: 10, letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.55)',
        paddingTop: 2,
      }}>{label}</div>
      <div style={{
        fontFamily: 'Playfair Display, serif',
        color: '#fcf6ba',
        fontSize: 13, lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
      }}>{value}</div>
    </>
  )
}
