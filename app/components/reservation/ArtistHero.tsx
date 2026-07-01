'use client'

import Link from 'next/link'
import type { ReservationArtist } from './types'

type Props = {
  artist: ReservationArtist
  scrollY?: number
  fallbackEyebrow?: string
}

export default function ArtistHero({ artist, scrollY = 0, fallbackEyebrow }: Props) {
  const parallax = Math.min(scrollY * 0.35, 220)
  const fadeOut = Math.max(0, 1 - scrollY / 600)
  const photo = artist.bookingImageUrl || artist.imageUrl || ''
  const eyebrowParts: string[] = []
  if (artist.genre) eyebrowParts.push(artist.genre)
  if (artist.city) eyebrowParts.push(artist.city)
  const eyebrow = eyebrowParts.length
    ? `· ${eyebrowParts.join(' · ')} ·`
    : (fallbackEyebrow ? `· ${fallbackEyebrow} ·` : '· Las Privadas ·')

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 720,
      overflow: 'hidden',
      background: '#0a0503',
    }}>
      {/* Parallaxed portrait */}
      <div style={{
        position: 'absolute',
        inset: '-60px 0 0 0',
        backgroundImage: photo ? `url(${photo})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        filter: 'sepia(25%) saturate(105%) brightness(0.78)',
        transform: `translateY(${parallax}px) scale(1.08)`,
        transition: 'transform 60ms linear',
      }} />

      {/* Vignette + bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse at 50% 35%, transparent 0%, rgba(10,5,3,0.45) 65%, rgba(10,5,3,0.95) 100%)',
          'linear-gradient(180deg, rgba(10,5,3,0.55) 0%, transparent 25%, transparent 55%, rgba(10,5,3,0.85) 90%, #0a0503 100%)',
        ].join(', '),
      }} />

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
        opacity: 0.18, mixBlendMode: 'overlay',
      }} />

      {/* Top nav */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 3,
      }}>
        <Link href="/" style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          color: '#fcf6ba',
          fontFamily: 'var(--font-accent), cursive', fontSize: 11,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>‹ Volver al roster</Link>
        <div style={{
          fontFamily: 'var(--font-western), serif',
          fontSize: 16, letterSpacing: '0.18em',
          color: '#E8C77A',
        }}>LAS PRIVADAS</div>
      </div>

      {/* Hero copy */}
      <div className="priv-fade-up" style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 96,
        padding: '0 96px',
        opacity: fadeOut, transition: 'opacity 80ms linear',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: 'var(--font-accent), cursive',
          fontSize: 12, letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,199,122,0.75)',
          marginBottom: 18,
        }}>{eyebrow}</div>

        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-western), serif',
          fontSize: 92,
          letterSpacing: '0.02em',
          lineHeight: 0.95,
          background: 'linear-gradient(180deg, #fff8d6 0%, #f3e3a8 35%, #c89d3e 70%, #6b4912 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 18px rgba(0,0,0,0.65)',
          maxWidth: 880,
        }}>{artist.name}</h1>

        {artist.tagline && (
          <div style={{
            marginTop: 22,
            display: 'flex', alignItems: 'center', gap: 16,
            maxWidth: 560,
          }}>
            <div style={{ height: 1, width: 36, background: '#E8C77A' }} />
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-body), serif',
              fontStyle: 'italic',
              fontSize: 18, lineHeight: 1.5,
              color: 'rgba(252,246,186,0.85)',
            }}>{artist.tagline}</p>
          </div>
        )}
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        opacity: fadeOut * 0.7,
        fontFamily: 'var(--font-accent), cursive',
        fontSize: 9, letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: 'rgba(232,199,122,0.85)',
        textAlign: 'center',
      }}>
        Conoce más
        <div style={{
          marginTop: 8, width: 1, height: 24,
          background: 'linear-gradient(to bottom, rgba(232,199,122,0.85), transparent)',
          margin: '8px auto 0',
        }} />
      </div>
    </div>
  )
}
