import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

// E2E + visual regression + a11y. Locally it reuses a running `next dev` on
// :3000; in CI it builds and serves a production build (pointed at a seeded
// test database by the workflow).
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    expect: {
        // Tolerate sub-pixel AA differences in screenshot comparisons.
        toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        // In CI the workflow builds first, so we just start the server here.
        command: isCI ? 'npm run start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !isCI,
        timeout: 180_000,
    },
})
