"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import AvailabilityCalendar from "@/app/components/AvailabilityCalendar"
import { useLanguage } from "../../context/LanguageContext"

const MX_STATES = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
    "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
    "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
    "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Reusable Input Component for consistency
// Defined OUTSIDE the component to prevent focus loss on re-renders
const PremiumInput = ({ label, ...props }: any) => (
    <div className="group">
        <label className="block text-xs font-bold uppercase text-leather/60 mb-1 tracking-widest transition-colors group-focus-within:text-gold">
            {label}
        </label>
        <input
            {...props}
            className="block w-full px-0 py-2 border-b-2 border-leather/10 bg-transparent text-leather-dark font-serif text-lg focus:outline-none focus:border-gold transition-all placeholder:text-leather/20"
        />
    </div>
)

export default function BookingForm({ artistId, user }: { artistId: string, user?: { name?: string | null, email?: string | null } }) {
    const router = useRouter()
    const { t } = useLanguage()

    // Form State
    const [date, setDate] = useState("")
    const [currentStep, setCurrentStep] = useState(0) // 0: Calendar, 1: Hours, 2: Location, 3: Contact
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingType, setBookingType] = useState<'personal' | 'business'>('personal') // Step 1 Selection

    // Data State
    const [formData, setFormData] = useState({
        hours: "1",
        venue: "", // New required field for Business
        clientName: user?.name || "",
        city: "",
        state: "",
        country: "México",
        countryCode: "+52",
        cellphone: "",
        hasWhatsapp: false
    })

    const handleDateSelect = (selectedDate: Date) => {
        const offset = selectedDate.getTimezoneOffset()
        const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000))
        const dateString = adjustedDate.toISOString().split("T")[0]
        setDate(dateString)
        setCurrentStep(1) // Move to Hours step
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Basic Validation
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.cellphone)) {
            alert("Please enter a valid 10-digit phone number")
            setIsSubmitting(false)
            return
        }

        // Additional validation for Business
        if (bookingType === 'business' && !formData.venue.trim()) {
            alert(t.booking.venue_label + " is required") // Should use localized alert ideally
            setIsSubmitting(false)
            return
        }

        const payload = {
            artistId,
            date,
            bookingType,
            venue: bookingType === 'business' ? formData.venue : null,
            hours: formData.hours,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            clientName: formData.clientName,
            clientEmail: user?.email || null,
            cellphone: `${formData.countryCode} ${formData.cellphone}`,
            hasWhatsapp: formData.hasWhatsapp,
        }

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                // Wait for button launch animation (800ms)
                setTimeout(() => {
                    setIsSubmitting(false) // Stop submitting state for button reset (though it disappears)
                    setCurrentStep(4) // Move to Success State (In-Place)
                }, 800)
            } else {
                alert(t.common.error)
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error("Booking error", error)
            alert(t.common.error)
            setIsSubmitting(false)
        }
    }

    // Dynamic Placeholders based on Booking Type
    const cityPlaceholder = bookingType === 'business' ? 'Los Angeles' : 'San Pedro Garza García'
    const statePlaceholder = bookingType === 'business' ? 'California' : 'Nuevo León'

    // Premium Stepper UI
    const StepperIndicator = () => (
        <div className="flex justify-between items-center mb-10 px-4 relative max-w-xs mx-auto">
            {/* Dashed Connector Line */}
            <div className="absolute top-1/2 left-0 w-full h-0 border-t-2 border-dotted border-leather/30 -z-10 transform -translate-y-1/2"></div>

            {[1, 2, 3].map((step) => (
                <div key={step} className="relative group">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg transition-all duration-500 relative z-10
                        ${currentStep >= step
                                ? 'bg-gradient-to-br from-gold to-yellow-600 text-white shadow-lg scale-110 border-2 border-white'
                                : 'bg-[#FDFBF7] text-leather/40 border-2 border-leather/20 shadow-sm'}`}
                    >
                        {step}
                    </div>
                    <span
                        className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-colors duration-300
                        ${currentStep >= step ? 'text-leather-dark' : 'text-transparent'}`}
                    >
                        {step === 1 ? t.booking.step_hours : step === 2 ? t.booking.step_location : t.booking.step_contact}
                    </span>
                </div>
            ))}
        </div>
    )

    return (
        <div className="mt-12 relative max-w-2xl mx-auto">
            {/* Main Premium Container Wrapper */}
            <div className="bg-[#FDFBF7] relative rounded-lg shadow-2xl overflow-hidden border border-leather/10 transition-all duration-500">
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}></div>

                {/* Decorative Double Border */}
                <div className="absolute inset-2 border border-leather/5 pointer-events-none rounded-[4px]"></div>
                <div className="absolute inset-3 border border-gold/20 pointer-events-none rounded-[2px]"></div>

                {/* Content */}
                <div className="relative p-8 sm:p-12 z-10">
                    {/* Header - Hide on Success Step for cleaner look */}
                    {currentStep !== 4 && (
                        <div className="text-center mb-10">
                            <h3 className="text-4xl font-western text-leather-dark mb-2 drop-shadow-sm">{t.artist.book_title}</h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full opacity-50"></div>
                            <p className="mt-3 text-leather/60 font-serif italic">
                                {date ? (
                                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-leather/5 border border-leather/10 text-leather-dark text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                        {date}
                                    </span>
                                ) : t.booking.select_prompt}
                            </p>
                        </div>
                    )}

                    {currentStep > 0 && currentStep < 4 && <StepperIndicator />}

                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex justify-center -mx-4 sm:mx-0">
                                    <AvailabilityCalendar artistId={artistId} onDateSelect={handleDateSelect} />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                onSubmit={nextStep}
                                className="space-y-8 max-w-md mx-auto"
                            >
                                {/* Booking Type Selection */}
                                <div className="mb-8">
                                    <label className="block text-center text-sm font-bold uppercase text-leather/50 mb-4 tracking-[0.2em]">
                                        {t.booking.type_label}
                                    </label>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('personal')}
                                            className={`px-6 py-2 rounded-full border-2 transition-all font-serif italic text-lg
                                                ${bookingType === 'personal'
                                                    ? 'bg-leather text-gold border-leather shadow-md'
                                                    : 'bg-transparent text-leather/60 border-leather/20 hover:border-leather/40'}`}
                                        >
                                            {t.booking.type_personal}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('business')}
                                            className={`px-6 py-2 rounded-full border-2 transition-all font-serif italic text-lg
                                                ${bookingType === 'business'
                                                    ? 'bg-leather text-gold border-leather shadow-md'
                                                    : 'bg-transparent text-leather/60 border-leather/20 hover:border-leather/40'}`}
                                        >
                                            {t.booking.type_business}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-center text-sm font-bold uppercase text-leather/50 mb-6 tracking-[0.2em]">
                                        {t.booking.hours_label}
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4, 5].map((hour) => (
                                            <button
                                                key={hour}
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, hours: hour.toString() }))}
                                                className={`py-4 px-2 border transition-all duration-300 relative overflow-hidden group
                                                    ${formData.hours === hour.toString()
                                                        ? 'border-gold bg-leather text-gold shadow-md'
                                                        : 'border-leather/10 bg-white/50 text-leather hover:border-gold/30 hover:bg-white'}`}
                                            >
                                                <span className="relative z-10 font-western text-xl">{hour} {hour === 5 ? '+' : ''} {hour === 1 ? 'Hora' : 'Horas'}</span>
                                                {/* Shine effect */}
                                                {formData.hours === hour.toString() && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={prevStep} className="flex-1 py-3 border-b border-leather/20 text-leather/60 font-serif hover:text-leather transition-colors text-sm uppercase tracking-widest">
                                        {t.booking.back_step}
                                    </button>
                                    <button type="submit" className="flex-1 py-4 bg-leather-dark text-gold font-western text-lg uppercase tracking-widest shadow-lg hover:bg-leather hover:shadow-gold/20 transition-all transform hover:-translate-y-0.5">
                                        {t.booking.next}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {currentStep === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                onSubmit={nextStep}
                                className="space-y-8 max-w-md mx-auto"
                            >
                                <div className="space-y-6">
                                    {/* 1. Country */}
                                    <div className="group">
                                        <label className="block text-xs font-bold uppercase text-leather/60 mb-1 tracking-widest group-focus-within:text-gold">
                                            {t.booking.country_label}
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={(e) => {
                                                const newCountry = e.target.value;
                                                // Map country to phone code
                                                let newCode = "+52";
                                                if (newCountry === "USA" || newCountry === "Canada") newCode = "+1";

                                                handleInputChange(e);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    country: newCountry,
                                                    state: "",
                                                    countryCode: newCode
                                                }));
                                            }}
                                            className="block w-full px-0 py-2 border-b-2 border-leather/10 bg-transparent text-leather-dark font-serif text-lg focus:outline-none focus:border-gold transition-all cursor-pointer"
                                        >
                                            <option value="México">México</option>
                                            <option value="USA">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* 2. State (Conditional) */}
                                    {(formData.country === "México" || formData.country === "USA") ? (
                                        <div className="group">
                                            <label className="block text-xs font-bold uppercase text-leather/60 mb-1 tracking-widest group-focus-within:text-gold">
                                                {t.booking.state_label}
                                            </label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="block w-full px-0 py-2 border-b-2 border-leather/10 bg-transparent text-leather-dark font-serif text-lg focus:outline-none focus:border-gold transition-all cursor-pointer"
                                            >
                                                <option value="" disabled>Select State</option>
                                                {formData.country === "México" ? (
                                                    MX_STATES.map(st => <option key={st} value={st}>{st}</option>)
                                                ) : (
                                                    US_STATES.map(st => <option key={st} value={st}>{st}</option>)
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <PremiumInput
                                            label={t.booking.state_label}
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={statePlaceholder}
                                        />
                                    )}

                                    {/* 3. City */}
                                    <PremiumInput
                                        label={t.booking.city_label}
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={cityPlaceholder} // Dynamic placeholder
                                    />
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={prevStep} className="flex-1 py-3 border-b border-leather/20 text-leather/60 font-serif hover:text-leather transition-colors text-sm uppercase tracking-widest">
                                        {t.booking.back_step}
                                    </button>
                                    <button type="submit" className="flex-1 py-4 bg-leather-dark text-gold font-western text-lg uppercase tracking-widest shadow-lg hover:bg-leather hover:shadow-gold/20 transition-all transform hover:-translate-y-0.5">
                                        {t.booking.next}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {currentStep === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                onSubmit={handleSubmit}
                                className="space-y-8 max-w-md mx-auto relative"
                            >
                                {/* Suction Pattern Overlay - Visualizes "Packing" */}
                                <AnimatePresence>
                                    {isSubmitting && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 1.5 }}
                                            animate={{ opacity: 0.2, scale: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6, ease: "easeIn" }}
                                            className="absolute inset-0 pointer-events-none -z-10"
                                        >
                                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <g stroke="currentColor" strokeWidth="0.5" className="text-gold" fill="none">
                                                    <path d="M0 0 L50 100" />
                                                    <path d="M100 0 L50 100" />
                                                    <path d="M0 50 L50 100" />
                                                    <path d="M100 50 L50 100" />
                                                    <path d="M50 0 L50 100" />
                                                </g>
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* "Packing" Container - Inputs shrink into the button */}
                                <motion.div
                                    animate={isSubmitting ? {
                                        scale: 0,
                                        opacity: 0,
                                        y: 200, // Move down towards button
                                        transition: { duration: 0.6, ease: "backIn" }
                                    } : {}}
                                    className="space-y-6"
                                >
                                    {/* Venue Input - Only if Business */}
                                    {bookingType === 'business' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <PremiumInput
                                                label={t.booking.venue_label}
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="El Farallon"
                                            />
                                        </motion.div>
                                    )}

                                    <PremiumInput
                                        label={t.booking.name_label}
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Juan Perez"
                                    />

                                    <div className="group">
                                        <label className="block text-xs font-bold uppercase text-leather/60 mb-1 tracking-widest group-focus-within:text-gold">
                                            {t.booking.phone_label}
                                        </label>
                                        <div className="flex gap-4">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleInputChange}
                                                className="block w-24 px-0 py-2 border-b-2 border-leather/10 bg-transparent text-leather-dark font-serif text-lg focus:outline-none focus:border-gold transition-all"
                                            >
                                                <option value="+52">MX +52</option>
                                                <option value="+1">US +1</option>
                                            </select>
                                            <input
                                                required
                                                type="tel"
                                                name="cellphone"
                                                value={formData.cellphone}
                                                onChange={handleInputChange}
                                                placeholder="1234567890"
                                                maxLength={10}
                                                className="block flex-1 px-0 py-2 border-b-2 border-leather/10 bg-transparent text-leather-dark font-serif text-lg focus:outline-none focus:border-gold transition-all placeholder:text-leather/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <input
                                            id="hasWhatsapp"
                                            name="hasWhatsapp"
                                            type="checkbox"
                                            checked={formData.hasWhatsapp}
                                            onChange={(e) => setFormData(p => ({ ...p, hasWhatsapp: e.target.checked }))}
                                            className="h-5 w-5 text-gold border-leather/30 bg-transparent rounded focus:ring-0 cursor-pointer"
                                        />
                                        <label htmlFor="hasWhatsapp" className="ml-3 block text-sm font-medium text-leather/80 cursor-pointer font-serif italic">
                                            {t.booking.whatsapp_label}
                                        </label>
                                    </div>
                                </motion.div>
                                <div className="flex gap-4 pt-6 items-center">
                                    <motion.button
                                        type="button"
                                        onClick={prevStep}
                                        animate={isSubmitting ? { opacity: 0, x: -50 } : {}}
                                        className="flex-1 py-3 border border-leather/20 text-leather/60 font-serif hover:bg-leather/5 hover:text-leather hover:border-leather/40 transition-all rounded-sm text-sm uppercase tracking-widest active:scale-[0.98]"
                                    >
                                        {t.booking.back_step}
                                    </motion.button>

                                    {/* MORPHING SUBMIT BUTTON */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        layout
                                        animate={isSubmitting ? {
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(0,0,0,0)",
                                            borderColor: "rgba(0,0,0,0)",
                                            boxShadow: "none",
                                            y: -500, // Launch Up
                                            x: 200, // Launch Right
                                            rotate: 20,
                                            scale: 0.8,
                                            opacity: 0,
                                            transition: {
                                                width: { delay: 0.6, duration: 0.4 }, // Wait for Packing
                                                height: { delay: 0.6, duration: 0.4 },
                                                borderRadius: { delay: 0.6, duration: 0.4 },
                                                backgroundColor: { delay: 0.6, duration: 0.2 }, // Fade out
                                                borderColor: { delay: 0.6, duration: 0.2 },
                                                boxShadow: { delay: 0.6, duration: 0.2 },
                                                y: { delay: 1.0, duration: 0.8, ease: "backIn" }, // Launch after morph
                                                x: { delay: 1.0, duration: 0.8, ease: "backIn" },
                                                opacity: { delay: 1.7, duration: 0.1 }
                                            }
                                        } : {
                                            // Normal State
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "0.125rem", // rounded-sm
                                        }}
                                        className="flex-1 py-4 bg-leather-dark text-gold font-western text-lg uppercase tracking-widest shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] border border-leather-dark hover:bg-leather hover:border-leather hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group flex items-center justify-center min-w-[60px]"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {!isSubmitting ? (
                                                <motion.span
                                                    key="text"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative z-10 whitespace-nowrap"
                                                >
                                                    {t.booking.submit_btn}
                                                </motion.span>
                                            ) : (
                                                <motion.svg
                                                    key="plane"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.6 }} // Wait for Packing
                                                    className="w-8 h-8 text-gold"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </motion.svg>
                                            )}
                                        </AnimatePresence>

                                        {!isSubmitting && (
                                            <div className="absolute inset-1 border border-dashed border-white/20 pointer-events-none rounded-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}

                        {/* IN-PLACE SUCCESS STEP (4) */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center text-center py-8"
                            >
                                {/* Paper Plane Arrival */}
                                <div className="relative h-48 w-full mb-6 flex items-center justify-center">
                                    <motion.div
                                        initial={{ y: 200, x: -100, rotate: 45, scale: 0.5, opacity: 0 }}
                                        animate={{
                                            y: [200, -20, 0],
                                            x: [-100, 20, 0],
                                            rotate: [45, -5, 0],
                                            scale: [0.5, 1.1, 1],
                                            opacity: 1
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            ease: "easeOut",
                                        }}
                                        className="text-leather-dark drop-shadow-xl"
                                    >
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
                                        </svg>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="relative z-10"
                                >
                                    {/* Background Pattern for Success - "Topography" style for wind/air map feel */}
                                    <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden">
                                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="wind_pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                                    <path d="M0 20 Q10 10 20 20 T40 20" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#wind_pattern)" />
                                        </svg>
                                    </div>

                                    <h3 className="text-4xl font-western text-leather-dark mb-4 drop-shadow-sm">
                                        {t?.booking?.success_title || "Solicitud Enviada"}
                                    </h3>
                                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full opacity-50 mb-6"></div>
                                    <p className="text-leather/70 font-serif italic text-lg mb-8 leading-relaxed max-w-sm mx-auto">
                                        {t?.booking?.success_message || "Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto."}
                                    </p>

                                    <button
                                        onClick={() => window.location.reload()} // Simple reload to reset flow
                                        className="px-8 py-3 bg-transparent border-2 border-leather/20 text-leather-dark font-serif text-lg uppercase tracking-widest hover:bg-leather hover:text-gold hover:border-leather transition-all duration-300 transform hover:-translate-y-1 rounded-sm"
                                    >
                                        {t?.common?.back || "Volver al Inicio"}
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Decorative "Book Spine" visual on the left for fun depth */}
            <div className="absolute top-4 bottom-4 -left-3 w-4 bg-leather-dark rounded-l-md shadow-2xl hidden sm:block"></div>
        </div>
    )
}
