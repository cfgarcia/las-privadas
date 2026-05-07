'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function startOffset(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7
}

function sameDate(a: Date | null | undefined, b: Date | null | undefined) {
  return !!a && !!b
    && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

type Props = {
  value: Date | null
  onChange: (d: Date) => void
}

export default function PrivCalendar({ value, onChange }: Props) {
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState(() => {
    const v = value || today
    return { y: v.getFullYear(), m: v.getMonth() }
  })

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const offset = startOffset(view.y, view.m)
  const cells: Array<number | null> = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const isPast = (d: number) => {
    const date = new Date(view.y, view.m, d)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < t
  }

  const goPrev = () => {
    const nm = view.m === 0 ? 11 : view.m - 1
    const ny = view.m === 0 ? view.y - 1 : view.y
    setView({ y: ny, m: nm })
  }
  const goNext = () => {
    const nm = view.m === 11 ? 0 : view.m + 1
    const ny = view.m === 11 ? view.y + 1 : view.y
    setView({ y: ny, m: nm })
  }

  return (
    <div style={{
      background: 'rgba(10,5,3,0.55)',
      border: '1px solid rgba(232,199,122,0.20)',
      borderRadius: 2,
      padding: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <NavBtn onClick={goPrev}>‹</NavBtn>
        <div style={{
          fontFamily: 'Rye, serif',
          fontSize: 14,
          color: '#E8C77A',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>{MONTHS[view.m]} {view.y}</div>
        <NavBtn onClick={goNext}>›</NavBtn>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2, marginBottom: 4,
      }}>
        {WEEK.map((w, i) => (
          <div key={i} style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: 9,
            letterSpacing: '0.18em',
            textAlign: 'center',
            color: 'rgba(232,199,122,0.45)',
            padding: '4px 0',
          }}>{w}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const date = new Date(view.y, view.m, d)
          const past = isPast(d)
          const selected = sameDate(date, value)
          const isToday = sameDate(date, today)
          return (
            <DayBtn
              key={i}
              day={d}
              past={past}
              selected={selected}
              isToday={isToday}
              onClick={() => !past && onChange(date)}
            />
          )
        })}
      </div>
    </div>
  )
}

function NavBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        background: hover ? 'rgba(232,199,122,0.15)' : 'transparent',
        border: '1px solid rgba(232,199,122,0.25)',
        borderRadius: 2,
        color: hover ? '#fcf6ba' : '#E8C77A',
        fontSize: 18, lineHeight: 1, cursor: 'pointer',
        transition: 'all 200ms',
      }}
    >{children}</button>
  )
}

function DayBtn({ day, past, selected, isToday, onClick }: {
  day: number
  past: boolean
  selected: boolean
  isToday: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const style: CSSProperties = {
    position: 'relative',
    aspectRatio: '1',
    background: selected
      ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 50%, #b38728 100%)'
      : (hover && !past ? 'rgba(232,199,122,0.10)' : 'transparent'),
    border: selected
      ? '1px solid rgba(252,246,186,0.65)'
      : (isToday ? '1px solid rgba(232,199,122,0.45)' : '1px solid transparent'),
    borderRadius: 2,
    color: selected ? '#2a1505' : (past ? 'rgba(252,246,186,0.18)' : '#fcf6ba'),
    fontFamily: 'Playfair Display, serif',
    fontSize: 12,
    fontWeight: selected ? 700 : 400,
    cursor: past ? 'not-allowed' : 'pointer',
    transition: 'all 150ms',
    boxShadow: selected
      ? 'inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 10px rgba(0,0,0,0.45), 0 0 14px rgba(232,199,122,0.40)'
      : 'none',
    textShadow: selected ? '0 1px 0 rgba(255,235,180,0.45)' : 'none',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={past}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
    >
      {day}
      {isToday && !selected && (
        <span style={{
          position: 'absolute', bottom: 2, left: '50%',
          transform: 'translateX(-50%)',
          width: 3, height: 3, borderRadius: '50%',
          background: '#E8C77A',
        }} />
      )}
    </button>
  )
}
