import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/admin/bookings" className="text-leather-dark hover:text-gold">Bookings</a>
                        <a href="/admin/artists" className="text-leather-dark hover:text-gold">Artists</a>
                        <a href="/" className="text-gray-500 hover:text-gray-700">Back to App</a>
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                {children}
            </main>
        </div>
    )
}
