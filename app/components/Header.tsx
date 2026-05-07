"use client"

import Link from "next/link"
import Image from "next/image"
import LanguageSwitcher from "./LanguageSwitcher"
import { useLanguage } from "../context/LanguageContext"

interface HeaderProps {
    session: any
}

export default function Header({ session }: HeaderProps) {
    const { t } = useLanguage()

    return (
        <header className="relative z-50 w-full flex-shrink-0">
            {/* Espresso gradient base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-[#2c1810] to-[#3e2723] shadow-2xl" />

            {/* Stardust grain overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />

            {/* Gold trim with glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#fcf6ba] to-transparent shadow-[0_0_14px_rgba(212,175,55,0.55)]" />

            {/* Desktop layout: 3-column grid (eyebrow / logo / pill). Mobile: stacked. */}
            <div className="relative h-auto md:h-[88px] grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-8 py-4 md:py-0">

                {/* Left — editorial eyebrow */}
                <div className="hidden md:flex items-center gap-2.5 uppercase"
                    style={{
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 10,
                        letterSpacing: '0.32em',
                        color: 'rgba(252,246,186,0.55)',
                    }}
                >
                    <span className="inline-block w-[22px] h-px bg-[rgba(212,175,55,0.45)]" />
                    Privada
                    <span className="text-[rgba(212,175,55,0.45)]">·</span>
                    MMXXVI
                </div>

                {/* Center — logo (smaller per design) */}
                <Link href="/" className="group relative inline-flex items-center justify-center mx-auto pointer-events-auto transition-transform duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Image
                        src="/logo.png"
                        alt="Las Privadas"
                        width={300}
                        height={120}
                        className="h-[64px] md:h-[70px] w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative z-10"
                        priority
                    />
                </Link>

                {/* Right — language + auth combined into a single gold-tinted capsule */}
                <div className="flex items-center justify-center md:justify-end">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-[#D4AF37]/25 rounded-full px-[18px] py-2 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)] hover:border-[#D4AF37]/50 transition-colors duration-300">

                        <LanguageSwitcher />

                        <span className="w-px h-3 bg-[#D4AF37]/30" />

                        {session?.user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col text-right leading-tight">
                                    <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]/60 font-medium">{t.home.hi}</span>
                                    <span className="text-xs font-western text-[#fcf6ba] tracking-wide drop-shadow-sm">{session.user.name}</span>
                                </div>

                                {session.user.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="group flex items-center justify-center w-6 h-6 rounded-full bg-red-900/40 border border-red-500/30 hover:bg-red-900/60 hover:border-red-500/60 transition-all duration-300"
                                        title="Admin Dashboard"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    </Link>
                                )}

                                <Link
                                    href="/api/auth/signout"
                                    className="text-white/60 hover:text-[#D4AF37] transition-colors"
                                    title={t.home.sign_out}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/login" className="group flex items-center gap-2">
                                <span
                                    className="font-bold uppercase text-[#D4AF37] group-hover:text-[#fcf6ba] transition-colors"
                                    style={{ fontSize: 11, letterSpacing: '0.22em', fontFamily: 'Playfair Display, serif' }}
                                >
                                    {t.home.sign_in}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform">
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
