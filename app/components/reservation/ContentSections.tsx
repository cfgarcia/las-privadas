'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReservationArtist, ReservationSong } from './types'

const FALLBACK_SETLIST: ReservationSong[] = [
  'El Rey', 'La Media Vuelta', 'Sabor a Mí', 'Bésame Mucho',
  'Un Mundo Raro', 'Ella', 'Si Nos Dejan', 'Solamente Una Vez',
  'Cien Años', 'La Diferencia', 'Por Tu Maldito Amor', 'Que Te Vaya Bonito',
].map((t, i) => ({ id: `fallback-${i}`, title: t, mp3Url: null }))

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: 'Sancreek, cursive',
        fontSize: 11,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.55)',
        marginBottom: 10,
      }}>· {eyebrow} ·</div>
      <h2 style={{
        margin: 0,
        fontFamily: 'Rye, serif',
        fontSize: 36,
        letterSpacing: '0.04em',
        lineHeight: 1.1,
        background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 50%, #c89d3e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>{title}</h2>
      <div style={{
        marginTop: 16, height: 1,
        background: 'linear-gradient(to right, rgba(232,199,122,0.55), transparent)',
        maxWidth: 240,
      }} />
    </div>
  )
}

export function BioSection({ artist }: { artist: ReservationArtist }) {
  return (
    <section style={{ paddingBottom: 80 }}>
      <SectionHeading eyebrow="Quiénes son" title="La historia" />
      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 19,
        lineHeight: 1.7,
        color: 'rgba(252,246,186,0.85)',
        maxWidth: 640,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {artist.description}
      </p>
      <div style={{
        display: 'flex', gap: 32, marginTop: 32,
        borderTop: '1px solid rgba(232,199,122,0.15)',
        paddingTop: 24,
      }}>
        {artist.albumCount != null && (
          <Stat n={String(artist.albumCount)} label="Discos" />
        )}
        {artist.careerYears != null && (
          <Stat n={`${artist.careerYears} años`} label="De carrera" />
        )}
        <Stat n="Estados Unidos" label="Sede" />
      </div>
    </section>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Rye, serif',
        fontSize: 26, color: '#E8C77A',
        letterSpacing: '0.04em',
        lineHeight: 1,
      }}>{n}</div>
      <div style={{
        marginTop: 6,
        fontFamily: 'Sancreek, cursive',
        fontSize: 9, letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.55)',
      }}>{label}</div>
    </div>
  )
}

export function SetlistSection({ songs }: { songs?: ReservationSong[] }) {
  const list = songs && songs.length > 0 ? songs : FALLBACK_SETLIST
  const [picked, setPicked] = useState<Set<string>>(() => new Set())
  const toggle = (id: string) => {
    const n = new Set(picked)
    if (n.has(id)) n.delete(id); else n.add(id)
    setPicked(n)
  }
  return (
    <section style={{ paddingBottom: 80 }}>
      <SectionHeading eyebrow="Repertorio" title="Pide tus canciones" />
      <p style={{
        margin: '0 0 28px', fontStyle: 'italic',
        color: 'rgba(252,246,186,0.65)', fontSize: 15,
      }}>Toca cualquier canción para añadirla a tu lista — la guardamos en tu reserva.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 640 }}>
        {list.map((s) => {
          const on = picked.has(s.id)
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                background: on
                  ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 50%, #8F6A1F 100%)'
                  : 'transparent',
                border: '1px solid ' + (on ? 'rgba(252,246,186,0.65)' : 'rgba(232,199,122,0.30)'),
                borderRadius: 999,
                color: on ? '#2a1505' : '#fcf6ba',
                fontFamily: 'Playfair Display, serif',
                fontSize: 13,
                fontStyle: 'italic',
                padding: '10px 18px',
                cursor: 'pointer',
                transition: 'all 200ms',
                fontWeight: on ? 700 : 400,
                textShadow: on ? '0 1px 0 rgba(255,235,180,0.45)' : 'none',
                boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,0.45), 0 0 14px rgba(232,199,122,0.35)' : 'none',
              }}
            >
              {on ? '✓ ' : ''}{s.title}
            </button>
          )
        })}
      </div>

      {picked.size > 0 && (
        <div style={{
          marginTop: 22, fontSize: 12,
          fontFamily: 'Sancreek, cursive',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.65)',
        }}>{picked.size} canciones en tu lista</div>
      )}
    </section>
  )
}

export function AudioSection({ songs }: { songs?: ReservationSong[] }) {
  const playable = useMemo(
    () => (songs ?? []).filter((s) => !!s.mp3Url),
    [songs],
  )
  const hasReal = playable.length > 0

  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1 for real audio, integer for mock
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const current = hasReal ? playable[Math.min(trackIdx, playable.length - 1)] : null

  // When the user changes track, reset state
  useEffect(() => {
    if (!hasReal) return
    setProgress(0)
    setPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [trackIdx, hasReal])

  const togglePlay = () => {
    if (!hasReal) {
      setPlaying((p) => !p)
      return
    }
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch((err) => {
        console.warn('Audio play failed', err)
      })
    } else {
      el.pause()
    }
  }

  return (
    <section style={{ paddingBottom: 80 }}>
      <SectionHeading eyebrow="Demo" title="Cómo suenan" />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        padding: '24px 28px',
        background: 'linear-gradient(155deg, rgba(42,26,16,0.7) 0%, rgba(13,8,5,0.7) 100%)',
        border: '1px solid rgba(232,199,122,0.22)',
        maxWidth: 640,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', flexShrink: 0, width: 80, height: 80 }}>
          {!playing && (
            <span
              aria-hidden
              style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: '2px solid rgba(232,199,122,0.55)',
                animation: 'priv-vinyl-pulse 1.8s ease-out infinite',
                pointerEvents: 'none',
              }}
            />
          )}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar' : 'Reproducir'}
            style={{
              position: 'relative',
              width: 80, height: 80, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #1a0e08 0%, #0a0503 70%)',
              border: '2px solid rgba(232,199,122,0.55)',
              cursor: 'pointer',
              boxShadow: '0 0 22px rgba(232,199,122,0.30), inset 0 0 12px rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E8C77A', padding: 0,
              animation: playing ? 'priv-vinyl-spin 6s linear infinite' : 'none',
            }}
          >
            <span
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: playing ? 'priv-vinyl-spin 6s linear infinite reverse' : 'none',
              }}
            >
              {playing ? <EqBars /> : <PlayIcon />}
            </span>
          </button>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: 10, letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(232,199,122,0.55)',
            marginBottom: 4,
          }}>
            {hasReal
              ? `Track ${String(trackIdx + 1).padStart(2, '0')} de ${playable.length}`
              : 'Track 01 · Bolero'}
          </div>
          <div style={{
            fontFamily: 'Rye, serif',
            fontSize: 18, color: '#fcf6ba',
            letterSpacing: '0.04em',
            marginBottom: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {current ? current.title : 'Sabor a Mí — vivo en Saltillo'}
          </div>
          {hasReal
            ? <RealWaveform progress={progress} />
            : <MockWaveform playing={playing} />
          }
          {hasReal && playable.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {playable.map((s, i) => {
                const active = i === trackIdx
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setTrackIdx(i)}
                    style={{
                      background: active
                        ? 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 50%, #8F6A1F 100%)'
                        : 'transparent',
                      border: '1px solid ' + (active ? 'rgba(252,246,186,0.65)' : 'rgba(232,199,122,0.30)'),
                      borderRadius: 999,
                      color: active ? '#2a1505' : '#fcf6ba',
                      fontFamily: 'Playfair Display, serif',
                      fontStyle: 'italic',
                      fontSize: 11,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: active ? 700 : 400,
                    }}
                  >{s.title}</button>
                )
              })}
            </div>
          )}
        </div>

        {hasReal && current?.mp3Url && (
          <audio
            ref={audioRef}
            src={current.mp3Url}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setProgress(0) }}
            onTimeUpdate={(e) => {
              const el = e.currentTarget
              setProgress(el.duration ? el.currentTime / el.duration : 0)
            }}
            style={{ display: 'none' }}
          />
        )}
      </div>
    </section>
  )
}

const WAVE_BARS = [3, 5, 7, 4, 6, 9, 7, 5, 8, 12, 10, 7, 5, 4, 6, 8, 11, 9, 7, 5, 3, 6, 8, 5, 4, 7, 10, 12, 9, 6, 4, 3, 5, 7, 9, 11, 8, 6, 4, 5]

function RealWaveform({ progress }: { progress: number }) {
  const cutoff = Math.round(progress * WAVE_BARS.length)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
      {WAVE_BARS.map((h, i) => (
        <div key={i} style={{
          width: 3,
          height: h * 2,
          background: i < cutoff ? '#E8C77A' : 'rgba(232,199,122,0.30)',
          transition: 'background 200ms',
        }} />
      ))}
    </div>
  )
}

function MockWaveform({ playing }: { playing: boolean }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress((p) => (p + 1) % (WAVE_BARS.length + 1)), 220)
    return () => clearInterval(id)
  }, [playing])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
      {WAVE_BARS.map((h, i) => (
        <div key={i} style={{
          width: 3,
          height: h * 2,
          background: i < progress ? '#E8C77A' : 'rgba(232,199,122,0.30)',
          transition: 'background 200ms',
        }} />
      ))}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden style={{ filter: 'drop-shadow(0 0 8px rgba(232,199,122,0.45))' }}>
      <defs>
        <linearGradient id="priv-play-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e7b8" />
          <stop offset="50%" stopColor="#d4af55" />
          <stop offset="100%" stopColor="#8F6A1F" />
        </linearGradient>
      </defs>
      <path
        d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5Z"
        fill="url(#priv-play-grad)"
      />
    </svg>
  )
}

function EqBars() {
  const bars = [0, 0.18, 0.36]
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 4,
      height: 24, width: 26,
    }}>
      {bars.map((delay, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: 5,
            height: 6,
            background: 'linear-gradient(180deg, #f5e7b8 0%, #d4af55 60%, #8F6A1F 100%)',
            borderRadius: 1,
            animation: `priv-eq-bar 0.85s ease-in-out ${delay}s infinite`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}

export function SimilarSection({ others }: { others: ReservationArtist[] }) {
  if (!others.length) return null
  return (
    <section style={{ paddingBottom: 80 }}>
      <SectionHeading eyebrow="Si te gustan" title="También considera" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 760 }}>
        {others.map((a) => (
          <SimilarCard key={a.id} artist={a} />
        ))}
      </div>
    </section>
  )
}

function SimilarCard({ artist }: { artist: ReservationArtist }) {
  const photo = artist.bookingImageUrl || artist.imageUrl || ''
  return (
    <a
      href={`/artist/${artist.id}`}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(232,199,122,0.55)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(232,199,122,0.22)' }}
      style={{
        background: 'linear-gradient(155deg, rgba(42,26,16,0.55) 0%, rgba(13,8,5,0.55) 100%)',
        border: '1px solid rgba(232,199,122,0.22)',
        cursor: 'pointer',
        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div style={{
        aspectRatio: '4/3',
        backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65))${photo ? `, url(${photo})` : ''}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'sepia(20%) saturate(95%)',
      }} />
      <div style={{ padding: '18px 18px 20px' }}>
        {artist.genre && (
          <div style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: 9, letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(232,199,122,0.55)',
            marginBottom: 6,
          }}>{artist.genre}</div>
        )}
        <div style={{
          fontFamily: 'Rye, serif',
          fontSize: 18, color: '#fcf6ba',
          letterSpacing: '0.04em',
          marginBottom: 4,
        }}>{artist.name}</div>
        {artist.city && (
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 12, fontStyle: 'italic',
            color: 'rgba(252,246,186,0.55)',
          }}>{artist.city}</div>
        )}
      </div>
    </a>
  )
}
