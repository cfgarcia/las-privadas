import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-center p-4">
            <div className="bg-cream-dark p-12 border-2 border-leather-light rounded-sm shadow-xl max-w-lg w-full relative bg-leather-texture">
                <h2 className="text-6xl font-western text-leather-dark mb-2">404</h2>
                <h3 className="text-2xl font-western text-leather mb-6">Lost Your Way, Partner?</h3>
                <p className="text-leather-dark/80 mb-8 font-body text-lg">
                    The page you are looking for seems to have wandered off into the sunset.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-leather-dark text-gold border border-gold hover:bg-leather transition-colors font-western tracking-wider uppercase shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                    Return to Saloon
                </Link>
            </div>
        </div>
    )
}
