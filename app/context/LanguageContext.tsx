"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { dictionary } from "../i18n/dictionaries"

type Language = "es" | "en"
type Dictionary = typeof dictionary.es

interface LanguageContextType {
    language: Language
    t: Dictionary
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("es") // Default to Spanish

    // Optional: Persist language
    useEffect(() => {
        const savedLang = localStorage.getItem("app-language") as Language
        if (savedLang && (savedLang === "es" || savedLang === "en")) {
            setLanguage(savedLang)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("app-language", lang)
    }

    const value = {
        language,
        t: dictionary[language],
        setLanguage: handleSetLanguage,
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
