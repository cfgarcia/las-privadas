"use server"

import { signIn } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/" })
}

export async function continueAsGuest() {
    const cookieStore = await cookies()
    cookieStore.set("guest-mode", "true")
    // We don't need to redirect if we are already on the page, 
    // but for the modal we might want to just revalidate or let the client handle the UI update.
    // However, server actions usually return or redirect. 
    // If we redirect to current path, it refreshes data.
}
