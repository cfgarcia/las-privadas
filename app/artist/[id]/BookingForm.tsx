"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import AvailabilityCalendar from "@/app/components/AvailabilityCalendar"

import { useLanguage } from "../../context/LanguageContext"

export default function BookingForm({ artistId }: { artistId: string }) {
    const router = useRouter()
    const { t } = useLanguage()
    const [date, setDate] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const [showSuccessModal, setShowSuccessModal] = useState(false) // Unused state

    const handleDateSelect = (selectedDate: Date) => {
        // Adjust for timezone offset to ensure the date string is correct
        const offset = selectedDate.getTimezoneOffset()
        const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000))
        const dateString = adjustedDate.toISOString().split("T")[0]

        setDate(dateString)
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            artistId,
            date,
            hours: formData.get("hours"),
            city: formData.get("city"),
            state: formData.get("state"),
            clientName: formData.get("clientName"),
            cellphone: formData.get("cellphone"),
            hasWhatsapp: formData.get("hasWhatsapp") === "on",
        }

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                router.push("/booking-success")
            } else {
                alert(t.common.error)
            }
        } catch (error) {
            console.error("Booking error", error)
            alert(t.common.error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mt-8 bg-cream border-2 border-leather/20 p-8 rounded-sm shadow-lg relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-leather via-gold to-leather"></div>
            <h3 className="text-2xl font-western text-leather-dark mb-6 text-center border-b-2 border-leather/10 pb-4">{t.artist.book_title}</h3>

            <div className="mb-8 p-4 bg-white/50 rounded border border-leather/10">
                <label className="block text-sm font-bold uppercase tracking-wider text-leather mb-4 text-center">
                    {t.booking.select_date}
                </label>
                <div className="flex justify-center">
                    <AvailabilityCalendar artistId={artistId} onDateSelect={handleDateSelect} />
                </div>
                <p className="mt-4 text-sm text-center font-body min-h-[1.5em]">
                    {date ? (
                        <span className="text-leather-dark font-bold bg-gold/20 px-3 py-1 rounded-full border border-gold/30">{t.booking.selected}: {date}</span>
                    ) : (
                        <span className="text-leather/50 italic">{t.booking.select_prompt}</span>
                    )}
                </p>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="hours" className="block text-xs font-bold uppercase text-leather/70 mb-1">
                                {t.booking.hours_label}
                            </label>
                            <select
                                id="hours"
                                name="hours"
                                required
                                className="block w-full pl-3 pr-10 py-3 text-base border-2 border-leather/20 focus:outline-none focus:border-gold focus:ring-0 bg-white text-leather-dark rounded-none transition-colors"
                            >
                                <option value="1">{t.booking.hours_options[1]}</option>
                                <option value="2">{t.booking.hours_options[2]}</option>
                                <option value="3">{t.booking.hours_options[3]}</option>
                                <option value="4">{t.booking.hours_options[4]}</option>
                                <option value="5">{t.booking.hours_options[5]}</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="clientName" className="block text-xs font-bold uppercase text-leather/70 mb-1">
                                {t.booking.name_label}
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                id="clientName"
                                required
                                className="block w-full px-3 py-3 border-2 border-leather/20 focus:outline-none focus:border-gold focus:ring-0 bg-white text-leather-dark rounded-none transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-xs font-bold uppercase text-leather/70 mb-1">
                                {t.booking.city_label}
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                required
                                className="block w-full px-3 py-3 border-2 border-leather/20 focus:outline-none focus:border-gold focus:ring-0 bg-white text-leather-dark rounded-none transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-xs font-bold uppercase text-leather/70 mb-1">
                                {t.booking.state_label}
                            </label>
                            <input
                                type="text"
                                name="state"
                                id="state"
                                required
                                className="block w-full px-3 py-3 border-2 border-leather/20 focus:outline-none focus:border-gold focus:ring-0 bg-white text-leather-dark rounded-none transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="cellphone" className="block text-xs font-bold uppercase text-leather/70 mb-1">
                                {t.booking.phone_label}
                            </label>
                            <input
                                type="tel"
                                name="cellphone"
                                id="cellphone"
                                required
                                className="block w-full px-3 py-3 border-2 border-leather/20 focus:outline-none focus:border-gold focus:ring-0 bg-white text-leather-dark rounded-none transition-colors"
                            />
                        </div>

                        <div className="flex items-center h-full pt-6">
                            <input
                                id="hasWhatsapp"
                                name="hasWhatsapp"
                                type="checkbox"
                                className="h-5 w-5 text-gold border-2 border-leather/30 rounded-sm focus:ring-0 cursor-pointer"
                            />
                            <label htmlFor="hasWhatsapp" className="ml-3 block text-sm font-medium text-leather-dark cursor-pointer">
                                {t.booking.whatsapp_label}
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-4 px-4 border-2 border-gold bg-leather text-gold font-western text-xl tracking-widest hover:bg-leather-dark hover:text-white uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:translate-y-0.5"
                    >
                        {isSubmitting ? t.booking.submitting_btn : t.booking.submit_btn}
                    </button>
                </form>
            )}
        </div>
    )
}
