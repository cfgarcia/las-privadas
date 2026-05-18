"use client"

import { useEffect, useRef, useState } from "react"

interface SearchBarProps {
    query: string
    onQuery: (q: string) => void
    appear: number
    resultCount: number
}

export default function SearchBar({ query, onQuery, appear, resultCount }: SearchBarProps) {
    const [focused, setFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const visible = appear > 0.02

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
            if (isModK) {
                e.preventDefault()
                inputRef.current?.focus()
                inputRef.current?.select()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    return (
        <div
            className="relative z-30 w-full flex flex-col items-center"
            style={{
                gap: 8,
                padding: '12px 24px 24px',
                opacity: appear,
                transform: `translateY(${(1 - appear) * -16}px)`,
                pointerEvents: visible ? 'auto' : 'none',
                transition: 'opacity 200ms, transform 240ms cubic-bezier(0.16,1,0.3,1)',
                willChange: 'opacity, transform',
            }}
        >
            <label
                className="relative flex items-center w-full"
                style={{
                    gap: 14,
                    maxWidth: 520,
                    padding: '14px 20px',
                    background:
                        'linear-gradient(to bottom, rgba(46, 26, 16, 0.85), rgba(26, 15, 10, 0.92))',
                    border: `1px solid ${focused ? 'rgba(232,199,122,0.65)' : 'rgba(212,175,55,0.30)'}`,
                    borderRadius: 9999,
                    boxShadow: focused
                        ? 'inset 0 1px 0 rgba(232,199,122,0.10), 0 8px 24px rgba(0,0,0,0.55), 0 0 0 3px rgba(232,199,122,0.18), 0 0 30px rgba(232,199,122,0.18)'
                        : 'inset 0 1px 0 rgba(232,199,122,0.06), 0 6px 20px rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={focused ? '#E8C77A' : 'rgba(212,175,55,0.65)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: 'stroke 220ms' }}
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => onQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Busca por nombre o descripción…"
                    className="flex-1 bg-transparent border-0 outline-none min-w-0"
                    style={{
                        fontFamily: 'Playfair Display, serif',
                        fontStyle: query ? 'normal' : 'italic',
                        fontSize: 16,
                        color: '#fcf6ba',
                        letterSpacing: '-0.005em',
                    }}
                />
                {query ? (
                    <button
                        type="button"
                        onClick={() => onQuery('')}
                        aria-label="Limpiar"
                        className="flex items-center justify-center cursor-pointer flex-shrink-0"
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: 0,
                            background: 'rgba(232,199,122,0.18)',
                            color: '#fcf6ba',
                            fontSize: 14,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                ) : (
                    <span
                        className="inline-flex items-center uppercase flex-shrink-0"
                        style={{
                            padding: '3px 9px',
                            fontFamily: 'Sancreek, cursive',
                            fontSize: 9,
                            letterSpacing: '0.28em',
                            color: '#fcf6ba',
                            background: 'rgba(232,199,122,0.10)',
                            border: '1px solid rgba(232,199,122,0.30)',
                            borderRadius: 3,
                            boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.4)',
                        }}
                    >
                        ⌘K
                    </span>
                )}
            </label>
            {query && (
                <div
                    className="uppercase"
                    style={{
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 10,
                        letterSpacing: '0.28em',
                        color: 'rgba(232,199,122,0.55)',
                    }}
                >
                    {resultCount === 0
                        ? 'Sin resultados'
                        : `${resultCount} ${resultCount === 1 ? 'artista' : 'artistas'} · "${query}"`}
                </div>
            )}
        </div>
    )
}
