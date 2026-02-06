import { prisma } from "@/lib/prisma"
import { updateBookingStatus, deleteBooking } from "../actions"

export default async function BookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: { artist: true },
    })

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Requests</h2>
            <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {bookings.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No bookings found.</li>
                    )}
                    {bookings.map((booking) => (
                        <li key={booking.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
                                                booking.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-sm text-gray-500">ID: {booking.id.slice(0, 8)}...</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">{booking.artist.name}</h3>
                                    <div className="mt-1 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                        <p><span className="font-semibold">Client:</span> {booking.clientName}</p>
                                        <p><span className="font-semibold">Email:</span> {booking.clientEmail || "N/A"}</p>
                                        <p><span className="font-semibold">Date:</span> {booking.date.toLocaleDateString()}</p>
                                        <p><span className="font-semibold">Hours:</span> {booking.hours} hrs</p>
                                        <p><span className="font-semibold">Phone:</span> {booking.cellphone}</p>
                                        <p><span className="font-semibold">Location:</span> {booking.city}, {booking.state}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:flex-col sm:w-32">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <form action={updateBookingStatus.bind(null, booking.id, "CONFIRMED")}>
                                                <button className="w-full bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700">
                                                    Accept
                                                </button>
                                            </form>
                                            <form action={updateBookingStatus.bind(null, booking.id, "REJECTED")}>
                                                <button className="w-full bg-gray-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-600">
                                                    Reject
                                                </button>
                                            </form>
                                        </>
                                    )}
                                    <form action={deleteBooking.bind(null, booking.id)}>
                                        <button className="w-full bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-200">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
