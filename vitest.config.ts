import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Unit + integration runner. Default env is `node` (pure logic + route
// handlers); component tests opt into jsdom with a `// @vitest-environment
// jsdom` docblock at the top of the file. The `@/` alias is resolved natively
// from tsconfig.json via resolve.tsconfigPaths.
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e', 'dist', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Scope coverage to the logic layers we unit/integration-test. The
      // presentational component tree is covered by Playwright (visual/e2e),
      // not counted here — see TESTING.md.
      include: [
        'lib/**/*.ts',
        'app/api/**/*.ts',
        'app/i18n/**/*.ts',
        'app/admin/schemas.ts',
      ],
      exclude: ['**/*.test.*', '**/*.d.ts'],
      thresholds: {
        // Enforce coverage on the extracted/tested pure-logic modules now.
        // Infra libs (prisma/auth/storage/meta-webhook) and presentational
        // components are intentionally out of unit-test scope (covered by E2E)
        // — the broad `include` above keeps the global report honest so we can
        // ratchet more in over time. See TESTING.md.
        'lib/{sort,search,availability,slug,events}.ts': {
          statements: 88,
          branches: 70,
          functions: 85,
          lines: 88,
        },
      },
    },
  },
})
