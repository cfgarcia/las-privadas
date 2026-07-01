import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { gotoAsGuest } from './_helpers'

test('home page has no serious or critical accessibility violations', async ({ page }) => {
    await gotoAsGuest(page, '/')

    const results = await new AxeBuilder({ page }).analyze()
    const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
    )

    // Report which rules failed (if any) for a readable failure message.
    expect(blocking.map((v) => `${v.id} (${v.impact})`)).toEqual([])
})
