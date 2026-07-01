import type { Variants, Transition } from "framer-motion";

/**
 * Shared motion language for Las Privadas.
 *
 * Built on the project's signature easing so every entrance/hover feels part of
 * one system. Prefer these over ad-hoc inline `initial/animate` props. All
 * variants animate compositor-friendly properties only (transform/opacity).
 *
 * Reduced motion: CSS handles looping animations globally (see globals.css).
 * For JS-driven motion, gate with Framer Motion's `useReducedMotion()` and fall
 * back to `fadeIn` (opacity only, no travel).
 */

// Signature easing — mirrors `--ease-out` / `--ease-out: cubic-bezier(0.16,1,0.3,1)`.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
} as const;

const baseTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE_OUT,
};

/** Opacity + upward travel. The default section/element entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

/** Opacity only — the reduced-motion-safe entrance. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE_OUT } },
};

/** Parent that staggers its children's entrances. Pair with `staggerItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = fadeUp;

/** Card hover lift — apply via `whileHover="hover"`. */
export const cardHover: Variants = {
  rest: { y: 0, scale: 1, transition: { duration: DURATION.normal, ease: EASE_OUT } },
  hover: { y: -6, scale: 1.02, transition: { duration: DURATION.normal, ease: EASE_OUT } },
};

/** Scroll-reveal helper for `whileInView`. */
export const revealOnScroll: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};
