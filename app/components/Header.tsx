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
        <header className="relative z-50 w-full transition-all duration-300">
            {/* --- Premium Background Layers --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-[#2c1810] to-[#3e2723] shadow-2xl"></div>

            {/* Texture Overlay (Noise/Grain) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-overlay"></div>

            {/* Gold Bottom Trim with Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#996515] via-[#fcf6ba] to-[#996515] shadow-[0_0_15px_rgba(212,175,55,0.6)]"></div>

            {/* Remove max-w-7xl constraint to allow edge positioning */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-3 relative md:h-28 flex flex-col items-center md:block">

                {/* --- Logo Area --- */}
                {/* Desktop: Absolute Center. Mobile: Natural Flow */}
                <div className="md:absolute md:inset-x-0 md:top-0 md:bottom-0 md:flex md:items-center md:justify-center pointer-events-none z-10">
                    <Link href="/" className="group relative transform transition-transform duration-500 hover:scale-105 pointer-events-auto inline-block">
                        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <Image
                            src="/logo.png"
                            alt="Las Privadas Logo"
                            width={300}
                            height={120}
                            className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative z-10"
                            priority
                        />
                    </Link>
                </div>

                {/* --- User Controls --- */}
                {/* Desktop: Absolute Right of Viewport. Mobile: Flow below Logo */}
                <div className="mt-5 md:mt-0 md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 px-4 py-1.5 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)] hover:border-[#D4AF37]/50 transition-colors duration-300 z-20">

                    <LanguageSwitcher />

                    <div className="w-px h-5 bg-[#D4AF37]/20 mx-1"></div>

                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col text-right hidden sm:block leading-tight">
                                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]/60 font-medium">Hello</span>
                                <span className="text-xs font-western text-[#fcf6ba] tracking-wide drop-shadow-sm">{session.user.name}</span>
                            </div>

                            {session.user.role === "ADMIN" && (
                                <Link href="/admin" className="group flex items-center justify-center w-6 h-6 rounded-full bg-red-900/40 border border-red-500/30 hover:bg-red-900/60 hover:border-red-500/60 transition-all duration-300" title="Admin Dashboard">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
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
                        <Link href="/login" className="flex items-center gap-2 group">
                            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest group-hover:text-[#fcf6ba] transition-colors">{t.home.sign_in}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
