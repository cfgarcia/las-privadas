# Testing

How we keep Las Privadas stable. Three layers: fast **unit/integration** (Vitest,
mocked) and **E2E + visual + a11y** (Playwright), wired into **GitHub Actions CI**.

## Commands

```bash
npm test            # Vitest — unit + integration (run once)
npm run test:watch  # Vitest watch mode
npm run test:ui     # Vitest browser UI
npm run test:cov    # Vitest + coverage (enforces thresholds on tested lib/**)
npm run test:e2e    # Playwright — E2E + overflow + a11y (+ visual locally)
npm run test:e2e:ui # Playwright UI mode
npm run test:all    # Vitest then Playwright
npm run typecheck   # tsc --noEmit
```

`npm run test:e2e` locally reuses a running `next dev` on :3000 (or starts one).

## Layers & what lives where

| Layer | Tool | Env | Location | Covers |
|-------|------|-----|----------|--------|
| Unit | Vitest | node | `lib/*.test.ts`, `app/**/schemas.test.ts`, `app/i18n/*.test.ts` | pure logic, Zod schemas, i18n parity |
| Integration | Vitest | node | `app/api/**/route.test.ts` | route handlers (Prisma/auth/supabase **mocked**) |
| Component | Vitest | jsdom | `app/components/*.test.tsx` | client components via Testing Library |
| E2E / visual / a11y | Playwright | chromium | `e2e/*.spec.ts` | real app: guest flow, overflow, footer, axe |

- Component tests opt into jsdom with a `// @vitest-environment jsdom` docblock on line 1.
- Route-handler tests import the handler and call it with a `Request`, asserting on the returned `Response`.

## Conventions

- **TDD** (`superpowers:test-driven-development`): write the failing test first, watch it fail for the right reason, then write minimal code. The extracted `lib/` functions (`sort`, `search`, `availability`) were built this way.
- **AAA** structure (Arrange / Act / Assert); behavior-describing test names.
- **Isolation**: no shared state; mock external deps (`vi.mock('@/lib/prisma')`, the `@/lib/auth` module, `@supabase/supabase-js`). Reset with `vi.clearAllMocks()` in `beforeEach`.
- **Prefer pure functions**: logic that's hard to test usually wants extracting to `lib/` (that's why `norm`, the center-out sort, and the availability merge now live there).
- **New code ships with tests.**

## Coverage

`npm run test:cov` reports coverage for the logic layers (`lib/**`, `app/api/**`,
`app/i18n/**`, `app/admin/schemas.ts`) and **enforces** high thresholds on the
extracted pure-logic modules (`lib/{sort,search,availability,slug,events}.ts`).
Infra libs (`prisma`/`auth`/`storage`/`meta-webhook`) and the presentational
component tree are intentionally out of unit-test scope — they're exercised by
E2E. Ratchet more modules under threshold as they gain tests (the 80% target is
the destination, not the day-1 gate).

## E2E details

- **Guest bypass**: `gotoAsGuest()` sets `sessionStorage.guest-session` before load so the login modal never blocks the page.
- **Deterministic guardrails** (run everywhere, incl. CI): no horizontal overflow at 320/375/768/1024/1440, and footer link columns not overlapping on mobile — this is the cross-platform regression net for the layout bug classes.
- **Visual baselines** (`toHaveScreenshot`): platform-specific, so they run **locally only** and are **skipped in CI** until Linux baselines are generated on the runner. First local run creates them (`npm run test:e2e -- --update-snapshots`); commit the `*-snapshots/` PNGs.

## CI (`.github/workflows/ci.yml`)

- **unit** job (every push to main + all PRs): install → `prisma generate` → lint → typecheck → `test:cov`. No DB, no secrets.
- **e2e** job: Postgres service → `migrate deploy` → `db seed` → build → Playwright (guest flow, overflow, a11y). Uses a throwaway DB + dummy auth env; admin/authenticated flows are out of scope for v1.

## Adding a test

1. Pure logic → put/keep the function in `lib/`, add `lib/<name>.test.ts`.
2. Route handler → `app/api/.../route.test.ts`, mock `@/lib/prisma` (+ auth/supabase as needed).
3. Component → `app/components/<Name>.test.tsx` with the jsdom docblock + `renderWithProviders`.
4. Critical flow → `e2e/<flow>.spec.ts` using `gotoAsGuest`.
