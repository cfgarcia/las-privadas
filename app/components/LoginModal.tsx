"use client"

import { useState, useEffect } from "react"
import { loginWithGoogle } from "@/app/actions/auth"

export default function LoginModal() {
    const [isVisible, setIsVisible] = useState(false) // Default false to prevent flash if session exists
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check if user has already selected "Guest" in this session
        const isGuest = sessionStorage.getItem("guest-session")
        if (!isGuest) {
            setIsVisible(true)
        }
    }, [])

    const handleGuest = () => {
        setIsVisible(false)
        sessionStorage.setItem("guest-session", "true")
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all scale-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
                <p className="text-gray-600 mb-8">Sign in to book your favorite artists</p>

                <div className="space-y-4">
                    <form action={loginWithGoogle}>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-[1.02]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.033s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGuest}
                        className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 hover:scale-[1.02]"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    )
}
