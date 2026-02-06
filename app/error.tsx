'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center">
            <div className="bg-cream-dark p-8 border-2 border-leather-light rounded-sm shadow-xl max-w-md w-full relative">
                {/* Decorative corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold pointer-events-none"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold pointer-events-none"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold pointer-events-none"></div>

                <h2 className="text-3xl font-western text-leather-dark mb-4">Something went wrong!</h2>
                <p className="text-leather mb-6 font-body">
                    We encountered an unexpected error. Don't worry, we're working on fixing it.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 bg-leather-dark text-gold border border-gold hover:bg-leather transition-colors font-western tracking-wider uppercase text-sm"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-2 border border-leather-light text-leather-dark hover:bg-leather-light/10 transition-colors font-western tracking-wider uppercase text-sm flex items-center justify-center"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
