"use client"

import { useState, useEffect } from "react"
import Calendar from "react-calendar"
// import "react-calendar/dist/Calendar.css" // We are overriding completely
import "./calendar.css"
import { useLanguage } from "../context/LanguageContext"

interface AvailabilityCalendarProps {
    artistId: string
    onDateSelect: (date: Date) => void
}

export default function AvailabilityCalendar({ artistId, onDateSelect }: AvailabilityCalendarProps) {
    const { t } = useLanguage()
    const [dateStatuses, setDateStatuses] = useState<Map<string, string>>(new Map())
    const [value, setValue] = useState<Date | null>(null)

    useEffect(() => {
        async function fetchAvailability() {
            try {
                const res = await fetch(`/api/artists/${artistId}/availability`)
                if (res.ok) {
                    const data = await res.json()
                    const statusMap = new Map<string, string>()
                    data.dates.forEach((item: { date: string; status: string }) => {
                        statusMap.set(item.date, item.status)
                    })
                    setDateStatuses(statusMap)
                }
            } catch (error) {
                console.error("Failed to fetch availability", error)
            }
        }
        fetchAvailability()
    }, [artistId])

    const isTileDisabled = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const dateString = date.toISOString().split("T")[0]
            const status = dateStatuses.get(dateString)
            // Disable past dates and explicitly UNAVAILABLE dates
            return date < new Date(new Date().setHours(0, 0, 0, 0)) || status === 'UNAVAILABLE'
        }
        return false
    }

    const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const dateString = date.toISOString().split("T")[0]
            const status = dateStatuses.get(dateString)

            if (status === 'PENDING') return 'pending-date'
            if (status === 'CONFIRMED') return 'confirmed-date'
            if (status === 'AVAILABLE' || !status) return 'available-date'
        }
        return null
    }

    const handleChange = (val: any) => {
        setValue(val)
        if (val instanceof Date) {
            onDateSelect(val)
        }
    }

    return (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto">
            <Calendar
                onChange={handleChange}
                value={value}
                tileDisabled={isTileDisabled}
                tileClassName={getTileClassName}
                // Custom Navigation Icons
                nextLabel={<span className="text-xl text-leather font-western">›</span>}
                prevLabel={<span className="text-xl text-leather font-western">‹</span>}
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
                className="font-western text-leather-dark bg-transparent border-none w-full"
                formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]} // Single letter days
            />

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] w-full px-4 uppercase tracking-[0.2em] font-bold text-leather/60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border border-leather/20 bg-white"></div>
                    <span>{t.calendar.free}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold/50 shadow-sm"></div>
                    <span>{t.calendar.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-leather/80"></div>
                    <span>{t.calendar.high}</span>
                </div>
            </div>
        </div>
    )
}
