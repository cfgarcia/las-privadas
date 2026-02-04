"use client"

import Link from "next/link"
import Image from "next/image"
import LanguageSwitcher from "./LanguageSwitcher"
import { useLanguage } from "../context/LanguageContext"

interface HeaderProps {
    session: any // Using specific type if available would be better, but 'any' or Session for now
}

export default function Header({ session }: HeaderProps) {
    const { t } = useLanguage()

    return (
        <header className="bg-leather bg-leather-texture border-b-4 border-gold shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center relative z-10 gap-6">
                <div className="flex items-center justify-center w-full">
                    <Link href="/" className="transform hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logo.png"
                            alt="Las Privadas Logo"
                            width={400}
                            height={160}
                            className="h-32 sm:h-40 w-auto object-contain drop-shadow-xl"
                            priority
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-6 bg-leather-dark/60 px-8 py-3 rounded-full border border-gold/40 shadow-lg backdrop-blur-sm">
                    <LanguageSwitcher />
                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-body text-cream-dark tracking-wide">{t.home.hi}, {session.user.name}</span>
                            <Link href="/api/auth/signout" className="text-sm text-gold hover:text-gold-light font-bold uppercase tracking-wider transition-colors">
                                {t.home.sign_out}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm text-gold hover:text-gold-light font-bold uppercase tracking-wider transition-colors">
                            {t.home.sign_in}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
