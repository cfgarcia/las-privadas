// Makes Vitest's global APIs (describe/it/expect/vi/beforeEach/…) available to
// TypeScript without adding a `types` array to tsconfig.json (which would
// un-include @types/react and friends). Additive via triple-slash reference.
/// <reference types="vitest/globals" />
