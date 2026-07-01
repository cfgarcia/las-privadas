import { test, expect } from '@playwright/test'
import { gotoAsGuest, scrollStage } from './_helpers'

test.describe('home page', () => {
    test('shows the hero headline', async ({ page }) => {
        await gotoAsGuest(page, '/')
        await expect(page.getByRole('heading', { name: /Reserva tu artista/i })).toBeVisible()
    })

    test('toggling the language switches the hero copy es → en', async ({ page }) => {
        await gotoAsGuest(page, '/')
        await expect(page.getByRole('heading', { name: /Reserva tu artista/i })).toBeVisible()

        await page.getByText('EN', { exact: true }).first().click()

        await expect(page.getByRole('heading', { name: /Book your artist/i })).toBeVisible()
    })

    test('scrolling reveals the artist search', async ({ page }) => {
        await gotoAsGuest(page, '/')
        await scrollStage(page, 0.5)
        await expect(page.getByPlaceholder('Busca un artista…')).toBeVisible()
    })
})
