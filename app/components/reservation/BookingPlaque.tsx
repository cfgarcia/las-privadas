'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import PrivCalendar from './PrivCalendar'
import type { Booking, ReservationArtist } from './types'

const TIMES = [
  { v: 'dia', label: 'Día', hint: '11 am – 3 pm' },
  { v: 'tarde', label: 'Tarde', hint: '4 – 7 pm' },
  { v: 'noche', label: 'Noche', hint: '8 – 11 pm' },
  { v: 'madrugada', label: 'Madrugada', hint: 'después de medianoche' },
] as const

const DURATIONS = [
  { v: 60, label: '1 h' },
  { v: 120, label: '2 h' },
  { v: 180, label: '3 h' },
  { v: 240, label: '4 h' },
  { v: 300, label: '5+ h' },
] as const

const EVENT_TYPES: Array<{ v: 'personal' | 'negocio'; label: string }> = [
  { v: 'personal', label: 'Personal' },
  { v: 'negocio', label: 'Negocio' },
]

const COUNTRIES = [
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

const COUNTRY_PHONE_PREFIX: Record<string, string> = { MX: '+52', US: '+1' }
const COUNTRY_PHONE_PLACEHOLDER: Record<string, string> = {
  MX: '81 1234 5678',
  US: '212 555 0199',
  OTHER: '+xx xxx xxx xxxx',
}

type Props = {
  artist: ReservationArtist
  onReserve?: (b: Booking) => void
  compact?: boolean
}

export default function BookingPlaque({ artist, onReserve, compact = false }: Props) {
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string>('noche')
  const [duration, setDuration] = useState(120)
  const [country, setCountry] = useState('MX')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [eventType, setEventType] = useState<'personal' | 'negocio'>('personal')
  const [requests, setRequests] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const ready =
    !!date &&
    !!time &&
    !!duration &&
    !!country &&
    state.trim().length > 1 &&
    city.trim().length > 1 &&
    !!eventType &&
    name.trim().length > 1 &&
    contact.trim().length > 7

  const stateList = country === 'MX' ? MX_STATES : country === 'US' ? US_STATES : null

  return (
    <div style={{
      position: 'relative',
      width: compact ? 380 : 440,
      background: 'linear-gradient(155deg, #2a1a10 0%, #1a0e08 55%, #0d0805 100%)',
      boxShadow: [
        'inset 0 0 0 1px rgba(232,199,122,0.45)',
        'inset 0 0 80px rgba(0,0,0,0.55)',
        '0 30px 80px rgba(0,0,0,0.65)',
        '0 0 0 1px rgba(0,0,0,0.4)',
      ].join(', '),
      color: '#fcf6ba',
      fontFamily: 'Playfair Display, serif',
      isolation: 'isolate',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.10,
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />

      <CornerBracket pos="tl" />
      <CornerBracket pos="tr" />
      <CornerBracket pos="bl" />
      <CornerBracket pos="br" />

      <div style={{ position: 'relative', padding: '36px 32px 32px' }}>
        <div style={{
          fontFamily: 'Sancreek, cursive',
          fontSize: 10,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.55)',
          textAlign: 'center',
          marginBottom: 6,
        }}>· Reserva privada ·</div>
        <h2 style={{
          margin: 0,
          fontFamily: 'Rye, serif',
          fontSize: 28,
          letterSpacing: '0.04em',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 40%, #c89d3e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
        }}>Aparta tu noche</h2>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, margin: '14px 0 22px',
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,199,122,0.45))' }} />
          <span style={{ color: 'rgba(232,199,122,0.85)', fontSize: 8 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(232,199,122,0.45))' }} />
        </div>

        <FieldLabel>Fecha</FieldLabel>
        <PrivCalendar value={date} onChange={setDate} />

        <div style={{ marginTop: 18 }}>
          <FieldLabel>Hora</FieldLabel>
          <Segmented
            options={TIMES.map((t) => ({ value: t.v, label: t.label }))}
            value={time}
            onChange={setTime}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <FieldLabel>Duración</FieldLabel>
          <Segmented
            options={DURATIONS.map((d) => ({ value: String(d.v), label: d.label }))}
            value={String(duration)}
            onChange={(v) => setDuration(Number(v))}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <FieldLabel>País</FieldLabel>
          <select
            className="priv-input"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setState('') }}
            style={selectChevron()}
          >
            {COUNTRIES.map((c) => (
              <option key={c.v} value={c.v} style={{ background: '#1a0e08', color: '#fcf6ba' }}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div>
            <FieldLabel>Estado</FieldLabel>
            {stateList ? (
              <select
                className="priv-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={selectChevron()}
              >
                <option value="" style={{ background: '#1a0e08', color: 'rgba(252,246,186,0.5)' }}>Selecciona…</option>
                {stateList.map((s) => (
                  <option key={s} value={s} style={{ background: '#1a0e08', color: '#fcf6ba' }}>{s}</option>
                ))}
              </select>
            ) : (
              <input
                className="priv-input"
                placeholder="Estado o región"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            )}
          </div>
          <div>
            <FieldLabel>Ciudad</FieldLabel>
            <input
              className="priv-input"
              placeholder="Monterrey"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <FieldLabel>Tipo de evento</FieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {EVENT_TYPES.map((t) => (
              <ChipBtn
                key={t.v}
                active={eventType === t.v}
                onClick={() => setEventType(t.v)}
                grow
              >{t.label}</ChipBtn>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>
            Peticiones especiales{' '}
            <span style={{ opacity: 0.4, textTransform: 'none', letterSpacing: 0 }}>· opcional</span>
          </FieldLabel>
          <textarea
            className="priv-input"
            rows={3}
            placeholder={`Canción favorita, dedicatoria, "El Rey" para mi papá…`}
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            style={{ resize: 'vertical', minHeight: 64 }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>Nombre</FieldLabel>
          <input
            className="priv-input"
            placeholder="María Treviño"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel>WhatsApp · contacto</FieldLabel>
          <PhoneField
            country={country}
            value={contact}
            onChange={setContact}
          />
        </div>

        <div style={{ marginTop: 24 }} />

        <BrassReservarButton
          disabled={!ready}
          onClick={() => {
            if (!ready || !date) return
            onReserve?.({
              artist,
              date,
              time,
              duration,
              country,
              state,
              city,
              eventType,
              requests,
              name,
              contact,
            })
          }}
        />

        <p style={{
          margin: '14px 0 0',
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(252,246,186,0.40)',
          fontStyle: 'italic',
        }}>
          Sin cargo hasta confirmar — te respondemos por WhatsApp en menos de 2 h.
        </p>
      </div>
    </div>
  )
}

function selectChevron(): CSSProperties {
  return {
    appearance: 'none',
    background: `rgba(10,5,3,0.55) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path fill='%23E8C77A' d='M0 0l6 8 6-8z'/></svg>") no-repeat right 12px center / 10px 7px`,
    paddingRight: 32,
  }
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Sancreek, cursive',
      fontSize: 10,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: 'rgba(232,199,122,0.65)',
      marginBottom: 8,
    }}>{children}</div>
  )
}

export function CornerBracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const sty: CSSProperties = { position: 'absolute', width: 22, height: 22, pointerEvents: 'none' }
  if (pos === 'tl') Object.assign(sty, { top: 10, left: 10, borderTop: '1px solid #E8C77A', borderLeft: '1px solid #E8C77A' })
  if (pos === 'tr') Object.assign(sty, { top: 10, right: 10, borderTop: '1px solid #E8C77A', borderRight: '1px solid #E8C77A' })
  if (pos === 'bl') Object.assign(sty, { bottom: 10, left: 10, borderBottom: '1px solid #E8C77A', borderLeft: '1px solid #E8C77A' })
  if (pos === 'br') Object.assign(sty, { bottom: 10, right: 10, borderBottom: '1px solid #E8C77A', borderRight: '1px solid #E8C77A' })
  return <div style={sty} />
}

function Segmented({ options, value, onChange }: {
  options: ReadonlyArray<{ value: string; label: string }>
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      background: 'rgba(10,5,3,0.55)',
      border: '1px solid rgba(232,199,122,0.22)',
      borderRadius: 2,
      overflow: 'hidden',
      height: 42,
    }}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              background: active
                ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 50%, #8F6A1F 100%)'
                : 'transparent',
              border: 0,
              color: active ? '#2a1505' : 'rgba(252,246,186,0.85)',
              fontFamily: 'Rye, serif',
              fontSize: 12,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 180ms',
              boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.45), 0 0 14px rgba(232,199,122,0.35)' : 'none',
              textShadow: active ? '0 1px 0 rgba(255,235,180,0.45)' : 'none',
              fontWeight: active ? 700 : 400,
              padding: '0 4px',
            }}
          >{o.label}</button>
        )
      })}
    </div>
  )
}

function ChipBtn({ children, active, onClick, grow }: { children: ReactNode; active: boolean; onClick: () => void; grow?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: grow ? 1 : undefined,
        background: active
          ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 50%, #8F6A1F 100%)'
          : (hover ? 'rgba(232,199,122,0.10)' : 'transparent'),
        border: active
          ? '1px solid rgba(252,246,186,0.65)'
          : '1px solid rgba(232,199,122,0.30)',
        borderRadius: 2,
        color: active ? '#2a1505' : '#fcf6ba',
        fontFamily: 'Playfair Display, serif',
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        padding: '10px 14px',
        cursor: 'pointer',
        transition: 'all 180ms',
        textShadow: active ? '0 1px 0 rgba(255,235,180,0.45)' : 'none',
        letterSpacing: '0.04em',
      }}
    >{children}</button>
  )
}

function PhoneField({ country, value, onChange }: { country: string; value: string; onChange: (v: string) => void }) {
  const prefix = COUNTRY_PHONE_PREFIX[country] || ''
  const placeholder = COUNTRY_PHONE_PLACEHOLDER[country] || COUNTRY_PHONE_PLACEHOLDER.OTHER
  const hasPrefix = !!prefix
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: 'rgba(10,5,3,0.55)',
      border: '1px solid rgba(232,199,122,0.22)',
      borderRadius: 2,
      overflow: 'hidden',
      width: '100%',
    }}>
      {hasPrefix && (
        <div style={{
          flex: '0 0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 12px',
          background: 'linear-gradient(180deg, rgba(232,199,122,0.15) 0%, rgba(232,199,122,0.05) 100%)',
          borderRight: '1px solid rgba(232,199,122,0.22)',
          fontFamily: 'Rye, serif',
          fontSize: 14,
          letterSpacing: '0.04em',
          color: '#E8C77A',
          textShadow: '0 1px 0 rgba(0,0,0,0.55)',
          whiteSpace: 'nowrap',
        }}>{prefix}</div>
      )}
      <input
        className="priv-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="tel"
        style={{
          flex: 1, minWidth: 0,
          border: 0,
          background: 'transparent',
        }}
      />
    </div>
  )
}

function BrassReservarButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false) }}
      onMouseDown={() => !disabled && setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        position: 'relative',
        width: '100%',
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        background: disabled
          ? 'linear-gradient(180deg, #5c4827 0%, #3d2f18 100%)'
          : (hover
              ? 'linear-gradient(180deg, #ffeec6 0%, #e8c77a 40%, #c89d3e 70%, #6b4912 100%)'
              : 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 35%, #b38728 65%, #5c4018 100%)'),
        border: '1px solid rgba(252,246,186,0.55)',
        borderRadius: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: press
          ? 'inset 0 2px 4px rgba(0,0,0,0.45), 0 1px 0 rgba(252,246,186,0.20)'
          : (hover
              ? 'inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.55), 0 0 26px rgba(232,199,122,0.45)'
              : 'inset 0 1px 0 rgba(255,255,255,0.45), 0 5px 14px rgba(0,0,0,0.50)'),
        color: disabled ? 'rgba(252,246,186,0.40)' : '#2a1505',
        fontFamily: 'Rye, serif',
        fontSize: 16,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        transform: press ? 'translateY(1px)' : 'translateY(0)',
        textShadow: disabled ? 'none' : '0 1px 0 rgba(255,235,180,0.45)',
        overflow: 'hidden',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {!disabled && (
        <span style={{
          position: 'absolute', top: 0, bottom: 0,
          left: hover ? '110%' : '-30%',
          width: '40%',
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
          transition: 'left 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ position: 'relative' }}>Reservar el evento</span>
      <span style={{ position: 'relative', fontSize: 14, opacity: 0.75 }}>›</span>
    </button>
  )
}
