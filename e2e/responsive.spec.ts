import { test, expect } from '@playwright/test'
import { gotoAsGuest, scrollStage, BREAKPOINTS } from './_helpers'

type Box = { x: number; y: number; width: number; height: number }
function overlaps(a: Box, b: Box): boolean {
    return !(
        a.x + a.width <= b.x ||
        b.x + b.width <= a.x ||
        a.y + a.height <= b.y ||
        b.y + b.height <= a.y
    )
}

test.describe('responsive layout', () => {
    for (const width of BREAKPOINTS) {
        test(`no horizontal overflow at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 820 })
            await gotoAsGuest(page, '/')

            const topOverflow = await page.evaluate(
                () => document.documentElement.scrollWidth - window.innerWidth,
            )
            expect(topOverflow, `overflow at top (${width}px)`).toBeLessThanOrEqual(1)

            await scrollStage(page, 1)
            const bottomOverflow = await page.evaluate(
                () => document.documentElement.scrollWidth - window.innerWidth,
            )
            expect(bottomOverflow, `overflow at footer (${width}px)`).toBeLessThanOrEqual(1)
        })
    }

    test('the active carousel card fits within the viewport on mobile', async ({ page }) => {
        // `overflowX: clip` on the carousel hides an oversized card from the
        // document width, so a plain overflow check misses it — measure the
        // active card's box directly instead.
        await page.setViewportSize({ width: 320, height: 820 })
        await gotoAsGuest(page, '/')
        await scrollStage(page, 0.5)

        const box = await page.getByTestId('artist-card-active').boundingBox()
        expect(box, 'active card should be rendered').not.toBeNull()
        expect(box!.x, 'card left edge off-screen').toBeGreaterThanOrEqual(-1)
        expect(box!.x + box!.width, 'card right edge off-screen').toBeLessThanOrEqual(320 + 1)
    })

    test('footer link columns do not overlap on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 393, height: 820 })
        await gotoAsGuest(page, '/')
        await scrollStage(page, 1)

        const footer = page.locator('footer')
        // DOM text is mixed-case; the uppercase look is CSS text-transform.
        const headings = ['Explorar', 'La Casa', 'Ayuda']
        const boxes: Box[] = []
        for (const h of headings) {
            const box = await footer.getByText(h, { exact: true }).boundingBox()
            expect(box, `footer heading "${h}" should be rendered`).not.toBeNull()
            boxes.push(box!)
        }
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                expect(
                    overlaps(boxes[i], boxes[j]),
                    `"${headings[i]}" overlaps "${headings[j]}"`,
                ).toBe(false)
            }
        }
    })
})

// Visual baselines are platform-specific (macOS vs Linux). They run locally to
// catch visual regressions; in CI they're skipped until Linux baselines are
// generated on the runner (see TESTING.md). The deterministic overflow +
// non-overlap checks above are the cross-platform guardrail.
test.describe('visual regression', () => {
    test.skip(!!process.env.CI, 'per-platform baselines generated on the CI runner')

    for (const width of [375, 1280] as const) {
        test(`home matches the baseline at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 })
            await gotoAsGuest(page, '/')
            await expect(page).toHaveScreenshot(`home-${width}.png`, { fullPage: false })
        })
    }
})
