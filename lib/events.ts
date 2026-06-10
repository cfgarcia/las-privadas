// Event dates are stored as midnight UTC of the show's calendar date.
// Comparing them against the current calendar date in Los Angeles keeps an
// event visible through its whole show day anywhere in the US and drops it
// at LA midnight.
export function laTodayStart(): Date {
    const laDate = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date())
    return new Date(`${laDate}T00:00:00Z`)
}

// Render a stored event date without timezone drift (always UTC components).
export function formatEventDate(date: Date, options: Intl.DateTimeFormatOptions): string {
    return date.toLocaleDateString("es-MX", { ...options, timeZone: "UTC" })
}
