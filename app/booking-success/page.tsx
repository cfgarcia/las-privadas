import Link from "next/link"

export default function BookingSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center transform transition-all hover:scale-105 duration-500">

                {/* Sending Animation */}
                <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-50 rounded-full"></div>
                    <svg
                        className="w-12 h-12 text-indigo-600 animate-fly"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Solicitud Enviada
                </h1>

                <p className="text-gray-600 mb-8 text-lg">
                    Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto para confirmar los detalles.
                </p>

            </div>
        </div>
    )
}
