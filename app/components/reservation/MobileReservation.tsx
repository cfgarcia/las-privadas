'use client'

import Link from 'next/link'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import PrivCalendar from './PrivCalendar'
import { CornerBracket } from './BookingPlaque'
import type { Booking, ReservationArtist } from './types'

const WHATSAPP_NUMBER = '13233879330'

const MOBILE_DURATIONS = [
  { v: 60, label: '1 hora' },
  { v: 120, label: '2 horas' },
  { v: 180, label: '3 horas' },
  { v: 240, label: '4 horas' },
  { v: 300, label: '5+ horas' },
]
const MOBILE_EVENT_TYPES: Array<{ v: 'personal' | 'negocio'; label: string; hint: string }> = [
  { v: 'personal', label: 'Personal', hint: 'cumpleaños, boda, XV, reunión privada' },
  { v: 'negocio', label: 'Negocio', hint: 'nightclubs, promotores, festivales' },
]
const MOBILE_TIME_OF_DAY = [
  { v: 'dia', label: 'Día', hint: '11 am – 3 pm' },
  { v: 'tarde', label: 'Tarde', hint: '4 – 7 pm' },
  { v: 'noche', label: 'Noche', hint: '8 – 11 pm' },
  { v: 'madrugada', label: 'Madrugada', hint: 'después de medianoche' },
]
const MOBILE_COUNTRIES = [
  { v: 'MX', label: 'México' },
  { v: 'US', label: 'Estados Unidos' },
  { v: 'OTHER', label: 'Otro país' },
]
const MX_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
]
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

type Step = 'fecha' | 'hora' | 'duracion' | 'ubicacion' | 'tipo' | 'peticiones' | 'nombre' | 'contacto'
const STEPS: Step[] = ['fecha', 'hora', 'duracion', 'ubicacion', 'tipo', 'peticiones', 'nombre', 'contacto']
const STEP_TITLES: Record<Step, { eyebrow: string; q: string }> = {
  fecha: { eyebrow: 'Paso 1 de 8', q: '¿Qué fecha tienes en mente?' },
  hora: { eyebrow: 'Paso 2 de 8', q: '¿A qué hora?' },
  duracion: { eyebrow: 'Paso 3 de 8', q: '¿Cuánto tiempo tocan?' },
  ubicacion: { eyebrow: 'Paso 4 de 8', q: '¿De qué ciudad?' },
  tipo: { eyebrow: 'Paso 5 de 8', q: '¿Qué tipo de evento es?' },
  peticiones: { eyebrow: 'Paso 6 de 8', q: '¿Alguna petición especial?' },
  nombre: { eyebrow: 'Paso 7 de 8', q: '¿Cuál es tu nombre?' },
  contacto: { eyebrow: 'Paso 8 de 8', q: '¿A qué WhatsApp te contactamos?' },
}

type Props = {
  artist: ReservationArtist
  onSubmitBooking?: (b: Booking) => Promise<{ ok: boolean }> | { ok: boolean }
}

export default function MobileReservation({ artist, onSubmitBooking }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmation, setConfirmation] = useState<Booking | null>(null)

  const handleSubmit = async (b: Booking) => {
    const res = (await onSubmitBooking?.(b)) ?? { ok: true }
    if (res.ok) {
      setConfirmation(b)
      setSheetOpen(false)
    } else {
      alert('No pudimos enviar tu reserva. Inténtalo de nuevo.')
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100dvh',
      background: '#0a0503',
      overflow: 'hidden',
    }}>
      <MobileHero
        artist={artist}
        onOpenSheet={() => setSheetOpen(true)}
        onWhatsApp={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
      />
      <MobileSheet
        open={sheetOpen}
        artist={artist}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
      />
      {confirmation && (
        <MobileConfirmation booking={confirmation} onClose={() => setConfirmation(null)} />
      )}
    </div>
  )
}

function MobileHero({ artist, onOpenSheet, onWhatsApp }: {
  artist: ReservationArtist
  onOpenSheet: () => void
  onWhatsApp: () => void
}) {
  const photo = artist.bookingImageUrl || artist.imageUrl || ''
  const cityShort = artist.city ? artist.city.split(',')[0] : null
  const eyebrowParts = [artist.genre, cityShort].filter(Boolean) as string[]
  const eyebrow = eyebrowParts.length ? `· ${eyebrowParts.join(' · ')} ·` : '· Las Privadas ·'

  return (
    <div style={{
      position: 'relative',
      width: '100%', minHeight: '100dvh',
      background: '#0a0503',
      overflow: 'hidden',
      color: '#fcf6ba',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: photo ? `url(${photo})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        filter: 'sepia(25%) saturate(105%) brightness(0.72)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 50% 35%, transparent 0%, rgba(10,5,3,0.45) 65%, rgba(10,5,3,0.95) 100%)',
          'linear-gradient(180deg, rgba(10,5,3,0.55) 0%, transparent 28%, transparent 50%, rgba(10,5,3,0.95) 88%, #0a0503 100%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
        opacity: 0.18, mixBlendMode: 'overlay',
      }} />

      <div style={{
        position: 'absolute', top: 'env(safe-area-inset-top, 24px)', left: 0, right: 0,
        padding: '24px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 5,
      }}>
        <Link href="/" style={{
          background: 'rgba(10,5,3,0.45)',
          border: '1px solid rgba(232,199,122,0.30)',
          borderRadius: 999,
          width: 38, height: 38,
          color: '#fcf6ba',
          fontSize: 18, lineHeight: 1, cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>‹</Link>
        <div style={{
          fontFamily: 'Rye, serif',
          fontSize: 13, letterSpacing: '0.18em',
          color: '#E8C77A',
        }}>LAS PRIVADAS</div>
        <div style={{ width: 38, height: 38 }} />
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 32,
        padding: '0 24px',
        zIndex: 4,
      }}>
        <div style={{
          fontFamily: 'Sancreek, cursive',
          fontSize: 10, letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.75)',
          marginBottom: 12,
        }}>{eyebrow}</div>

        <h1 style={{
          margin: 0,
          fontFamily: 'Rye, serif',
          fontSize: 44,
          letterSpacing: '0.02em',
          lineHeight: 0.95,
          background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 35%, #c89d3e 70%, #6b4912 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 18px rgba(0,0,0,0.65)',
        }}>{artist.name}</h1>

        <p style={{
          margin: '14px 0 24px',
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: 15, lineHeight: 1.5,
          color: 'rgba(252,246,186,0.80)',
        }}>{artist.description}</p>

        <button
          type="button"
          onClick={onOpenSheet}
          style={{
            width: '100%',
            padding: '20px 24px',
            background: 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 35%, #b38728 65%, #5c4018 100%)',
            border: '1px solid rgba(252,246,186,0.55)',
            borderRadius: 4,
            color: '#2a1505',
            fontFamily: 'Rye, serif',
            fontSize: 17,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 18px rgba(0,0,0,0.55)',
            textShadow: '0 1px 0 rgba(255,235,180,0.45)',
          }}
        >
          Reservar el evento
        </button>

        <button
          type="button"
          onClick={onWhatsApp}
          style={{
            width: '100%', marginTop: 12,
            padding: '14px 24px',
            background: 'transparent',
            border: '1px solid rgba(232,199,122,0.30)',
            borderRadius: 4,
            color: '#fcf6ba',
            fontFamily: 'Sancreek, cursive',
            fontSize: 11,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          ¿Dudas? Pregúntanos por WhatsApp
        </button>
      </div>
    </div>
  )
}

function MobileSheet({ open, onClose, onSubmit, artist }: {
  open: boolean
  onClose: () => void
  onSubmit: (b: Booking) => void | Promise<void>
  artist: ReservationArtist
}) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    date: null as Date | null,
    time: 'noche',
    duration: 120,
    country: 'MX',
    state: '',
    city: '',
    eventType: 'personal' as 'personal' | 'negocio',
    requests: '',
    name: '',
    contact: '',
  })

  useEffect(() => { if (open) setStep(0) }, [open])

  const update = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }))
  const stepKey = STEPS[step]
  const title = STEP_TITLES[stepKey]
  const isLast = step === STEPS.length - 1

  const canAdvance = () => {
    switch (stepKey) {
      case 'fecha': return !!data.date
      case 'hora': return !!data.time
      case 'duracion': return !!data.duration
      case 'ubicacion': return !!data.country && data.state.trim().length > 1 && data.city.trim().length > 1
      case 'tipo': return !!data.eventType
      case 'peticiones': return true // optional
      case 'nombre': return data.name.trim().length > 1
      case 'contacto': return data.contact.trim().length > 7
      default: return false
    }
  }

  const advance = () => {
    if (!canAdvance()) return
    if (isLast) {
      if (!data.date) return
      onSubmit({ ...data, date: data.date, artist })
    } else {
      setStep((s) => s + 1)
    }
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 20,
          background: open ? 'rgba(10,5,3,0.55)' : 'transparent',
          backdropFilter: open ? 'blur(6px)' : 'none',
          transition: 'background 320ms, backdrop-filter 320ms',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        height: open ? '100dvh' : 0,
        background: 'linear-gradient(165deg, #2a1a10 0%, #1a0e08 55%, #0d0805 100%)',
        boxShadow: [
          'inset 0 0 0 1px rgba(232,199,122,0.45)',
          'inset 0 0 60px rgba(0,0,0,0.55)',
          '0 -20px 60px rgba(0,0,0,0.65)',
        ].join(', '),
        borderRadius: '22px 22px 0 0',
        zIndex: 30,
        overflow: 'hidden',
        transition: 'height 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
          opacity: 0.10, mixBlendMode: 'overlay', pointerEvents: 'none',
        }} />
        <CornerBracket pos="tl" />
        <CornerBracket pos="tr" />

        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 44, height: 4, borderRadius: 2,
          background: 'rgba(232,199,122,0.35)',
        }} />

        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: 2, width: `${((step + 1) / STEPS.length) * 100}%`,
          background: 'linear-gradient(to right, transparent, #E8C77A)',
          transition: 'width 380ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 0 10px rgba(232,199,122,0.55)',
        }} />

        <div style={{
          position: 'relative',
          padding: '32px 24px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              style={pill()}
            >‹</button>
          ) : <div style={{ width: 36 }} />}
          <div style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: 9, letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(232,199,122,0.65)',
          }}>{title.eyebrow}</div>
          <button
            type="button"
            onClick={onClose}
            style={{ ...pill(), color: '#fcf6ba', fontSize: 14 }}
          >✕</button>
        </div>

        <div className="priv-scroll" style={{
          flex: 1, overflowY: 'auto',
          padding: '8px 24px 24px',
          position: 'relative',
        }}>
          <h2 style={{
            margin: '0 0 24px',
            fontFamily: 'Rye, serif',
            fontSize: 26,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 50%, #c89d3e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{title.q}</h2>

          <StepBody stepKey={stepKey} data={data} update={update} />
        </div>

        <div style={{
          position: 'relative',
          padding: '14px 24px 28px',
          background: 'linear-gradient(0deg, rgba(10,5,3,0.85) 0%, transparent 100%)',
          borderTop: '1px solid rgba(232,199,122,0.15)',
        }}>
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance()}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: canAdvance()
                ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 35%, #b38728 65%, #5c4018 100%)'
                : 'linear-gradient(180deg, #5c4827 0%, #3d2f18 100%)',
              border: '1px solid ' + (canAdvance() ? 'rgba(252,246,186,0.55)' : 'rgba(232,199,122,0.18)'),
              borderRadius: 4,
              color: canAdvance() ? '#2a1505' : 'rgba(252,246,186,0.40)',
              fontFamily: 'Rye, serif',
              fontSize: 15,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: canAdvance() ? 'pointer' : 'not-allowed',
              boxShadow: canAdvance()
                ? 'inset 0 1px 0 rgba(255,255,255,0.45), 0 5px 14px rgba(0,0,0,0.50)'
                : 'none',
              textShadow: canAdvance() ? '0 1px 0 rgba(255,235,180,0.45)' : 'none',
              transition: 'all 200ms',
            }}
          >
            {isLast ? 'Enviar reserva' : 'Siguiente'} {!isLast && '›'}
          </button>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                color: 'rgba(252,246,186,0.55)',
                fontFamily: 'Sancreek, cursive',
                fontSize: 10, letterSpacing: '0.30em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderBottom: '1px dotted rgba(232,199,122,0.30)',
                paddingBottom: 1,
              }}
            >
              ¿Prefieres platicar? Escríbenos
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

function pill(): CSSProperties {
  return {
    background: 'transparent',
    border: '1px solid rgba(232,199,122,0.30)',
    borderRadius: 999,
    width: 36, height: 36,
    color: '#E8C77A',
    fontSize: 16, cursor: 'pointer',
  }
}

type Mutator = <K extends keyof MobileSheetData>(k: K, v: MobileSheetData[K]) => void
type MobileSheetData = {
  date: Date | null
  time: string
  duration: number
  country: string
  state: string
  city: string
  eventType: 'personal' | 'negocio'
  requests: string
  name: string
  contact: string
}

function StepBody({ stepKey, data, update }: {
  stepKey: Step
  data: MobileSheetData
  update: Mutator
}) {
  switch (stepKey) {
    case 'fecha':
      return <PrivCalendar value={data.date} onChange={(d) => update('date', d)} />
    case 'hora':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOBILE_TIME_OF_DAY.map((t) => (
            <BigTapRow
              key={t.v}
              active={data.time === t.v}
              onClick={() => update('time', t.v)}
              title={t.label}
              hint={t.hint}
            />
          ))}
        </div>
      )
    case 'duracion':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOBILE_DURATIONS.map((d) => (
            <BigTapRow
              key={d.v}
              active={data.duration === d.v}
              onClick={() => update('duration', d.v)}
              title={d.label}
              hint={d.v === 60 ? 'una sesión corta' : d.v === 120 ? 'lo más común' : 'un evento largo'}
            />
          ))}
        </div>
      )
    case 'ubicacion':
      return <LocationPicker data={data} update={update} />
    case 'tipo':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOBILE_EVENT_TYPES.map((t) => (
            <BigTapRow
              key={t.v}
              active={data.eventType === t.v}
              onClick={() => update('eventType', t.v)}
              title={t.label}
              hint={t.hint}
            />
          ))}
        </div>
      )
    case 'peticiones':
      return (
        <div>
          <textarea
            className="priv-input"
            rows={4}
            placeholder={`Canción favorita, dedicatoria, "El Rey" para mi papá…`}
            value={data.requests}
            onChange={(e) => update('requests', e.target.value)}
            style={{ fontSize: 17, padding: '16px 16px', resize: 'vertical', minHeight: 120 }}
          />
          <p style={{
            margin: '12px 4px 0',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 13,
            color: 'rgba(252,246,186,0.55)',
            lineHeight: 1.45,
          }}>Opcional — déjalo en blanco si no tienes peticiones por ahora.</p>
        </div>
      )
    case 'nombre':
      return (
        <BigInput
          placeholder="María Treviño"
          value={data.name}
          onChange={(v) => update('name', v)}
          hint="Así sabemos cómo saludarte."
          autoFocus
        />
      )
    case 'contacto':
      return (
        <PhoneInput
          country={data.country}
          value={data.contact}
          onChange={(v) => update('contact', v)}
          hint="Te respondemos por WhatsApp en menos de 2 horas con tu cotización."
        />
      )
  }
}

function LocationPicker({ data, update }: { data: MobileSheetData; update: Mutator }) {
  const stateList = data.country === 'MX' ? MX_STATES : data.country === 'US' ? US_STATES : null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <FieldHint label="País" />
        <select
          className="priv-input"
          style={{ fontSize: 17, padding: '16px 16px', height: 56 }}
          value={data.country}
          onChange={(e) => { update('country', e.target.value); update('state', '') }}
        >
          {MOBILE_COUNTRIES.map((c) => (
            <option key={c.v} value={c.v} style={{ background: '#1a0e08', color: '#fcf6ba' }}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <FieldHint label="Estado" />
        {stateList ? (
          <select
            className="priv-input"
            style={{ fontSize: 17, padding: '16px 16px', height: 56 }}
            value={data.state}
            onChange={(e) => update('state', e.target.value)}
          >
            <option value="" style={{ background: '#1a0e08', color: 'rgba(252,246,186,0.5)' }}>Selecciona estado…</option>
            {stateList.map((s) => (
              <option key={s} value={s} style={{ background: '#1a0e08', color: '#fcf6ba' }}>{s}</option>
            ))}
          </select>
        ) : (
          <input
            className="priv-input"
            style={{ fontSize: 17, padding: '16px 16px' }}
            placeholder="Estado o región"
            value={data.state}
            onChange={(e) => update('state', e.target.value)}
          />
        )}
      </div>

      <div>
        <FieldHint label="Ciudad" />
        <input
          className="priv-input"
          style={{ fontSize: 17, padding: '16px 16px' }}
          placeholder="Monterrey, Guadalajara…"
          value={data.city}
          onChange={(e) => update('city', e.target.value)}
        />
      </div>

      <p style={{
        margin: '4px 4px 0',
        fontFamily: 'Playfair Display, serif',
        fontStyle: 'italic',
        fontSize: 13,
        color: 'rgba(252,246,186,0.55)',
        lineHeight: 1.45,
      }}>La dirección exacta la pedimos después por WhatsApp.</p>
    </div>
  )
}

function FieldHint({ label }: { label: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Sancreek, cursive',
      fontSize: 9, letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: 'rgba(232,199,122,0.65)',
      marginBottom: 8,
    }}>{label}</div>
  )
}

function BigTapRow({ active, onClick, title, hint }: {
  active: boolean
  onClick: () => void
  title: string
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', textAlign: 'left',
        padding: '18px 20px',
        background: active
          ? 'linear-gradient(180deg, rgba(232,199,122,0.18) 0%, rgba(232,199,122,0.08) 100%)'
          : 'rgba(10,5,3,0.40)',
        border: '1px solid ' + (active ? 'rgba(232,199,122,0.65)' : 'rgba(232,199,122,0.22)'),
        borderRadius: 4,
        color: '#fcf6ba',
        cursor: 'pointer',
        transition: 'all 220ms',
        boxShadow: active
          ? 'inset 0 0 0 1px rgba(232,199,122,0.30), 0 0 18px rgba(232,199,122,0.15)'
          : 'none',
      }}
    >
      <div>
        <div style={{
          fontFamily: 'Rye, serif',
          fontSize: 18, letterSpacing: '0.04em',
          color: active ? '#fff8d6' : '#fcf6ba',
        }}>{title}</div>
        {hint && (
          <div style={{
            marginTop: 2,
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 12,
            color: 'rgba(252,246,186,0.55)',
          }}>{hint}</div>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: '1px solid ' + (active ? '#E8C77A' : 'rgba(232,199,122,0.35)'),
        background: active ? 'radial-gradient(circle, #f5e7b8 0%, #d4af55 100%)' : 'transparent',
        boxShadow: active ? '0 0 12px rgba(232,199,122,0.55)' : 'none',
        transition: 'all 220ms',
      }} />
    </button>
  )
}

function BigInput({ placeholder, value, onChange, hint, autoFocus }: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  hint?: string
  autoFocus?: boolean
}) {
  return (
    <div>
      <input
        autoFocus={autoFocus}
        className="priv-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: 18, padding: '18px 18px' }}
      />
      {hint && (
        <p style={{
          margin: '12px 4px 0',
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(252,246,186,0.55)',
          lineHeight: 1.45,
        }}>{hint}</p>
      )}
    </div>
  )
}

const COUNTRY_PHONE_PREFIX: Record<string, string> = { MX: '+52', US: '+1' }
const COUNTRY_PHONE_PLACEHOLDER: Record<string, string> = {
  MX: '81 1234 5678',
  US: '212 555 0199',
  OTHER: '+xx xxx xxx xxxx',
}

function PhoneInput({ country, value, onChange, hint }: {
  country: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  const prefix = COUNTRY_PHONE_PREFIX[country] || ''
  const placeholder = COUNTRY_PHONE_PLACEHOLDER[country] || COUNTRY_PHONE_PLACEHOLDER.OTHER
  const hasPrefix = !!prefix
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'stretch',
        background: 'rgba(10,5,3,0.55)',
        border: '1px solid rgba(232,199,122,0.22)',
        borderRadius: 2,
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {hasPrefix && (
          <div style={{
            flex: '0 0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 14px',
            background: 'linear-gradient(180deg, rgba(232,199,122,0.15) 0%, rgba(232,199,122,0.05) 100%)',
            borderRight: '1px solid rgba(232,199,122,0.22)',
            fontFamily: 'Rye, serif',
            fontSize: 17,
            letterSpacing: '0.04em',
            color: '#E8C77A',
            textShadow: '0 1px 0 rgba(0,0,0,0.55)',
            whiteSpace: 'nowrap',
          }}>{prefix}</div>
        )}
        <input
          autoFocus
          className="priv-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="tel"
          style={{
            flex: 1, minWidth: 0,
            border: 0,
            background: 'transparent',
            fontSize: 18,
            padding: '18px 18px',
          }}
        />
      </div>
      {hint && (
        <p style={{
          margin: '12px 4px 0',
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(252,246,186,0.55)',
          lineHeight: 1.45,
        }}>{hint}</p>
      )}
    </div>
  )
}

function MobileConfirmation({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { artist, date, time, duration, country, state, city, eventType, requests, name, contact } = booking
  const dateStr = date ? date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const timeStr = time === 'dia' ? 'Día (11 am–3 pm)' : time === 'tarde' ? 'Tarde (4–7 pm)' : time === 'noche' ? 'Noche (8–11 pm)' : 'Madrugada'
  const durMap: Record<number, string> = { 60: '1 hora', 120: '2 horas', 180: '3 horas', 240: '4 horas', 300: '5+ horas' }
  const durStr = durMap[duration] || `${duration} min`
  const countryLabel = MOBILE_COUNTRIES.find((c) => c.v === country)?.label || country
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
    <div className="priv-scroll" style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'linear-gradient(180deg, #1a0e08 0%, #0a0503 100%)',
      color: '#fcf6ba',
      overflow: 'auto',
      padding: '64px 24px 32px',
      animation: 'priv-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    }}>
      <div style={{
        width: 88, height: 88, margin: '0 auto 24px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #f5e7b8 0%, #d4af55 40%, #8F6A1F 80%, #4A3210 100%)',
        boxShadow: '0 8px 22px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.45), 0 0 30px rgba(232,199,122,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Rye, serif',
        fontSize: 16, color: '#2a1505',
        letterSpacing: '0.10em',
        textShadow: '0 1px 0 rgba(255,235,180,0.45)',
      }}>LP</div>

      <div style={{
        textAlign: 'center',
        fontFamily: 'Sancreek, cursive',
        fontSize: 10, letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.65)',
        marginBottom: 8,
      }}>· Reserva enviada ·</div>

      <h2 style={{
        margin: 0, textAlign: 'center',
        fontFamily: 'Rye, serif',
        fontSize: 32,
        letterSpacing: '0.04em',
        background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 50%, #c89d3e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1.1,
      }}>Tu noche está apartada</h2>

      <p style={{
        margin: '14px auto 26px', textAlign: 'center', maxWidth: 320,
        fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
        fontSize: 14, lineHeight: 1.55,
        color: 'rgba(252,246,186,0.70)',
      }}>
        Te enviamos cotización por WhatsApp en menos de 2 horas. Sin cargo
        hasta confirmar.
      </p>

      <div style={{
        margin: '0 0 24px',
        padding: '20px 18px',
        background: 'rgba(232,199,122,0.05)',
        border: '1px solid rgba(232,199,122,0.22)',
        borderRadius: 4,
      }}>
        <Row label="Artista" value={artist.name} />
        <Row label="Fecha" value={dateStr ? `${dateStr} · ${timeStr}` : '—'} />
        <Row label="Duración" value={durStr} />
        <Row label="Ubicación" value={locationStr} />
        <Row label="Tipo" value={eventTypeLabel} />
        {requests && requests.trim() && (
          <Row label="Peticiones" value={requests.trim()} />
        )}
        <Row label="Contacto" value={`${name} · ${contact}`} last />
      </div>

      <a
        href={wa} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          width: '100%', padding: '18px 22px',
          background: 'linear-gradient(180deg, #1f7d3b 0%, #145a29 100%)',
          border: '1px solid rgba(252,246,186,0.45)',
          borderRadius: 4,
          color: '#fcf6ba',
          textDecoration: 'none',
          fontFamily: 'Rye, serif',
          fontSize: 14,
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
          display: 'block', margin: '20px auto 0',
          background: 'transparent', border: 0, cursor: 'pointer',
          color: 'rgba(252,246,186,0.55)',
          fontFamily: 'Sancreek, cursive',
          fontSize: 10, letterSpacing: '0.30em',
          textTransform: 'uppercase',
          borderBottom: '1px dotted rgba(232,199,122,0.30)',
          paddingBottom: 1,
        }}
      >Volver al artista</button>
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 16, padding: '8px 0',
      borderBottom: last ? 'none' : '1px solid rgba(232,199,122,0.15)',
    }}>
      <div style={{
        fontFamily: 'Sancreek, cursive',
        fontSize: 9, letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.55)',
        paddingTop: 3,
        flexShrink: 0,
      }}>{label}</div>
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 13, lineHeight: 1.4,
        color: '#fcf6ba',
        textAlign: 'right',
      }}>{value}</div>
    </div>
  )
}
