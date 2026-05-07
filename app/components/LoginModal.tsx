"use client"

import { useEffect, useState } from "react"
import { loginWithGoogle } from "@/app/actions/auth"
import LoginCard, { GuestLink } from "./LoginCard"

export default function LoginModal() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Hide if the user already chose Guest in this session.
        const isGuest = sessionStorage.getItem("guest-session")
        if (!isGuest) setIsVisible(true)
    }, [])

    const handleGuest = () => {
        setIsVisible(false)
        sessionStorage.setItem("guest-session", "true")
    }

    if (!isVisible) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{
                padding: 24,
                background:
                    'radial-gradient(ellipse at 50% 40%, rgba(10,5,3,0.55) 0%, rgba(10,5,3,0.85) 70%)',
                backdropFilter: 'blur(8px) saturate(110%)',
                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
            }}
        >
            <div className="priv-plaque-in">
                <LoginCard
                    googleAction={loginWithGoogle}
                    guestSlot={<GuestLink onClick={handleGuest} />}
                    onClose={() => setIsVisible(false)}
                />
            </div>
        </div>
    )
}
