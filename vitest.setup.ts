// Registers jest-dom matchers (toBeInTheDocument, toHaveTextContent, …) on
// Vitest's `expect`. Safe in the node environment — matchers only touch the DOM
// when actually called (i.e. in jsdom component tests). RTL auto-cleanup runs
// via the global afterEach (globals: true) when a test imports @testing-library/react.
import '@testing-library/jest-dom/vitest'
