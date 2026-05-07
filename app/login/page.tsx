import Link from "next/link"
import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

import LoginCard, { GuestLink } from "../components/LoginCard"

export default function LoginPage() {
    async function googleAction() {
        "use server"
        await signIn("google", { redirectTo: "/" })
    }
    async function guestAction() {
        "use server"
        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        cookieStore.set("guest-mode", "true")
        redirect("/")
    }

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            style={{
                background:
                    'radial-gradient(ellipse at 50% 30%, #2c1810 0%, #1a0f0a 55%, #0a0503 100%)',
                isolation: 'isolate',
            }}
        >
            {/* Spotlight halo */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '85%',
                    height: '70%',
                    background:
                        'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 30%, transparent 60%)',
                }}
            />
            {/* Paper grain */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    opacity: 0.12,
                    backgroundImage:
                        'url(https://www.transparenttextures.com/patterns/stardust.png)',
                }}
            />
            {/* Outer vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
                }}
            />

            {/* Top minimal header */}
            <div
                className="absolute z-[5] flex items-center justify-between"
                style={{ top: 28, left: 32, right: 32 }}
            >
                <Link
                    href="/"
                    className="flex items-center uppercase no-underline"
                    style={{
                        gap: 10,
                        color: 'rgba(232,199,122,0.65)',
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 10,
                        letterSpacing: '0.32em',
                    }}
                >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>‹</span>
                    Volver
                </Link>
                <div
                    className="uppercase"
                    style={{
                        fontFamily: 'Sancreek, cursive',
                        fontSize: 10,
                        letterSpacing: '0.42em',
                        color: 'rgba(232,199,122,0.45)',
                    }}
                >
                    Las Privadas · Monterrey
                </div>
            </div>

            {/* The plaque */}
            <div className="priv-plaque-in relative z-[2]">
                <LoginCard
                    googleAction={googleAction}
                    guestSlot={<GuestLink formAction={guestAction} />}
                />
            </div>

            {/* Bottom hairline credit */}
            <div
                className="absolute text-center uppercase"
                style={{
                    bottom: 24,
                    left: 0,
                    right: 0,
                    fontFamily: 'Sancreek, cursive',
                    fontSize: 9,
                    letterSpacing: '0.42em',
                    color: 'rgba(232,199,122,0.30)',
                }}
            >
                Reservas íntimas · Hecho a mano · MTY
            </div>
        </div>
    )
}
