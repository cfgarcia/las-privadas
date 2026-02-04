"use client"

import { useLanguage } from "../context/LanguageContext"

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    return (
        <div className="flex items-center gap-2 text-sm">
            <button
                onClick={() => setLanguage("es")}
                className={`px-2 py-1 rounded transition-colors ${language === "es"
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
            >
                ES
            </button>
            <span className="text-gray-300">|</span>
            <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded transition-colors ${language === "en"
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
            >
                EN
            </button>
        </div>
    )
}
