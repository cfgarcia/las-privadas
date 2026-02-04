"use client"

import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./calendar.css" // Custom styles for clean look

interface AvailabilityCalendarProps {
    artistId: string
    onDateSelect: (date: Date) => void
}

import { useLanguage } from "../context/LanguageContext"

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
            // Disable past dates and explicitly UNAVAILABLE dates (2+ bookings or manual)
            // Available (0), Pending (1), Confirmed (1) are ENABLED to allow selecting them (e.g. to request a slot on a busy day)
            // Wait, logic says "disabled van a ser los que ya tengan dos o mas reservas".
            // So UNAVAILABLE is disabled. 
            // What about CONFIRMED? User said "rojo van a ser dias muy concurridos que almenos ya tenga una reserva". Doesn't explicitly say disabled.
            // Usually if it's "concurrido" but not "disabled", you can still book?
            // "Disabled van a ser los que ya tengan dos o mas reservas". 
            // So status 'CONFIRMED' (1 booking) is NOT disabled, just Red.
            // status 'PENDING' (1 booking) is NOT disabled, just Yellow.
            // status 'AVAILABLE' (0 bookings) is Green.

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
            if (status === 'AVAILABLE' || !status) return 'available-date' // Default to green if no status (0 bookings)
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
        <div className="flex flex-col items-center">
            <Calendar
                onChange={handleChange}
                value={value}
                tileDisabled={isTileDisabled}
                tileClassName={getTileClassName}
                className="rounded-xl border-none shadow-sm p-4 font-sans mb-4"
            />

            <div className="grid grid-cols-2 gap-4 text-xs max-w-xs w-full px-4 mt-4 bg-white/50 p-3 rounded border border-leather/10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-200 border border-green-800"></div>
                    <span className="text-leather">{t.calendar.free}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold/50 border border-gold-dark"></div>
                    <span className="text-leather">{t.calendar.medium}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-leather-light border border-leather-dark"></div>
                    <span className="text-leather">{t.calendar.high}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-500"></div>
                    <span className="text-leather">{t.calendar.unavailable}</span>
                </div>
            </div>
        </div>
    )
}
