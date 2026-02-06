
export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
            <div className="w-16 h-16 border-4 border-leather-light border-t-gold rounded-full animate-spin"></div>
            <h2 className="mt-4 text-xl font-western text-leather-dark animate-pulse">Loading...</h2>
        </div>
    )
}
