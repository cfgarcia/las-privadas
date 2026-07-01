import type { Page } from '@playwright/test'

/**
 * Navigate as a guest — sets the `guest-session` flag before any page script
 * runs so the login modal never appears (mirrors clicking "ver como invitado").
 */
export async function gotoAsGuest(page: Page, path = '/') {
    await page.addInitScript(() => {
        try {
            sessionStorage.setItem('guest-session', 'true')
        } catch {
            /* sessionStorage unavailable — ignore */
        }
    })
    await page.goto(path)
}

/** Scroll the home stage (an inner overflow container) to a fraction of its range. */
export async function scrollStage(page: Page, fraction: number) {
    await page.evaluate((f) => {
        let best: Element | null = null
        let bestGap = 0
        document.querySelectorAll('*').forEach((el) => {
            const gap = el.scrollHeight - el.clientHeight
            const oy = getComputedStyle(el).overflowY
            if (gap > bestGap && (oy === 'auto' || oy === 'scroll')) {
                best = el
                bestGap = gap
            }
        })
        const target = (best as unknown as HTMLElement) ?? document.scrollingElement!
        target.scrollTop = (target.scrollHeight - target.clientHeight) * f
    }, fraction)
    await page.waitForTimeout(700)
}

export const BREAKPOINTS = [320, 375, 768, 1024, 1440] as const
