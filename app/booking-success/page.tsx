"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "../context/LanguageContext"

export default function BookingSuccessPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] relative overflow-hidden px-4">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}></div>

            <div className="relative z-10 max-w-lg w-full text-center">

                {/* Arrival Animation */}
                <div className="relative h-64 w-full mb-8 flex items-center justify-center">
                    <motion.div
                        initial={{ y: 500, x: -200, rotate: 45, scale: 0.5, opacity: 0 }}
                        animate={{
                            y: [500, -50, 0],
                            x: [-200, 50, 0],
                            rotate: [45, -10, 0],
                            scale: [0.5, 1.1, 1],
                            opacity: 1
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeOut",
                            times: [0, 0.7, 1]
                        }}
                        className="text-leather-dark drop-shadow-2xl"
                    >
                        {/* Paper Plane Icon */}
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
                        </svg>
                    </motion.div>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <h1 className="text-5xl font-western text-leather-dark mb-6 drop-shadow-sm">
                        {t?.booking?.success_title || "Solicitud Enviada"}
                    </h1>

                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full opacity-50 mb-8"></div>

                    <p className="text-leather/70 font-serif italic text-xl mb-12 leading-relaxed max-w-md mx-auto">
                        {t?.booking?.success_message || "Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto para confirmar los detalles."}
                    </p>

                    <Link href="/artist/1" className="inline-block group">
                        {/* Note: Ideally this links back to home or relevant artist, hardcoded temporarily or use history back */}
                        <button className="px-10 py-4 bg-transparent border-2 border-leather/20 text-leather-dark font-serif text-lg uppercase tracking-widest hover:bg-leather hover:text-gold hover:border-leather transition-all duration-300 transform hover:-translate-y-1 rounded-sm">
                            {t?.common?.back || "Volver al Inicio"}
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-leather/10 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-leather/10 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-leather/10 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-leather/10 rounded-br-lg pointer-events-none"></div>
        </div>
    )
}
