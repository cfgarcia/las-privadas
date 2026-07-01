# Las Privadas — Design System & Practices

The principles behind the Las Privadas booking app. Read this before changing
visuals so the product stays coherent and authentically *Titan Records vintage*.
The tokens here are the source of truth; `tailwind.config.ts` and
`app/globals.css` mirror them.

---

## 1. Brand & voice

**Aesthetic:** 90s corridos / western ranchero under **Titan Records** — warm,
analog, golden, a little gritty. Espresso leather + gold, with the Titan cassette
seal as the legitimacy stamp. **Never** modern-minimal, pastel, neon, or
flat-corporate.

**Voice** (see the `voz_las_privadas` memory): *ranchera, sencilla, directa.*
- Verb-led, short sentences. "Elige tu artista." "Llevamos el corrido a tu privada."
- Use real catalog names (El As de la Sierra, Catarino y los Rurales) — never generic boleros.
- Mexican colloquialisms are fine when natural ("compa", "se fue del baile").
- **Banned AI-fluff:** "selección curada", "experiencia única", "hecho a tu medida".
- All user-facing copy lives in `app/i18n/dictionaries.ts` (es **and** en) — never
  hard-code Spanish inline, or English users see Spanish (the bug we just fixed).

---

## 2. Typography

Fonts are self-hosted via `next/font` (`app/layout.tsx`) and exposed as CSS
variables. **Never** `@import` from Google Fonts (render-blocking) and **never**
reference a font by its raw name inline — use the variable.

| Role | Family | Token | Use for |
|------|--------|-------|---------|
| Display / headings | **Rye** | `var(--font-western)` / `font-western` | h1–h3, artist names, wordmarks |
| Body | **Playfair Display** | `var(--font-body)` / `font-body` | paragraphs, descriptions, subtitles (italic ok) |
| Accent / label | **Sancreek** | `var(--font-accent)` / `font-display` | eyebrows, small-caps labels ONLY — never body text |

**Fluid scale** — size display type with `clamp()` so it breathes across screens:
```
hero h1:  clamp(64px, 10vw, 156px)
section:  clamp(28px, 4vw, 44px)
```
**Minimums (mobile legibility):**
- Body / inputs: **≥16px** (inputs at 16px also stop iOS from zoom-on-focus).
- Eyebrows/labels: ≥11px **with** ≥0.3em letter-spacing (they're tracked caps, not body).
- Sancreek is decorative — keep it short and spaced; never set a sentence in it.

---

## 3. Color & legibility

**Palette** (canonical — `tailwind.config.ts` + `:root` mirror these):

```
Espresso  leather.night #1a0f0a · mid #2c1810 · dark #3E2723 · deepest #271c19
Gold      gold #C9A24A · light #E8C77A · pale #F2E5B8 · dark #8F6A1F · deep #6B4A12
Cream     cream #FDFBF7 · cream.text #fcf6ba
Titan red --titan-red #E2231A  ← SEAL ONLY. Never a general accent/CTA color.
```
> One gold family only. The old `#D4AF37` ("classic gold") drift was removed.

**Contrast roles** — gold-on-espresso is easy to get wrong:
- `--text-safe-gold` (`#F2E5B8`, pale) → body text, subtitles, captions. Clears WCAG AA on espresso.
- `--decoration-gold` (`#C9A24A`, mid) → rules, ornaments, icons, borders — **non-text only.**
- Don't set body/subtitle text below ~0.8 opacity of a pale gold; thin low-opacity gold fails AA.

**Focus:** every interactive element gets a visible gold `:focus-visible` ring
(global rule in `globals.css`). Don't remove outlines without replacing them.

---

## 4. Motion

**Engine:** Framer Motion v12 (`app/lib/motion.ts`) for orchestration; CSS
keyframes for ambient loops. No GSAP/Lenis — one engine, small bundle.

**Tokens** (`--ease-out`, `--dur-*`):
```
ease:  cubic-bezier(0.16, 1, 0.3, 1)   // the signature curve — use it everywhere
fast 150ms · normal 300ms · slow 600ms
```
**Variants** to reuse instead of ad-hoc `initial/animate`: `fadeUp`, `fadeIn`,
`staggerContainer`/`staggerItem`, `cardHover`, `revealOnScroll`.

**Rules:**
- Animate **compositor-friendly properties only**: `transform`, `opacity`, `filter` (sparingly). Never animate `width`/`height`/`top`/`left`/`margin`.
- `will-change` narrowly; one clear idea per surface (the loader is one cassette, not 13 layers).

**Reduced-motion contract (required):**
- CSS: a global `@media (prefers-reduced-motion: reduce)` block neutralizes loops
  (shimmer, ghost-drift, loader reels, scroll bounce) and collapses entrances to end-state.
- JS: gate parallax/3D with Framer Motion's `useReducedMotion()` — `MainStage`
  zeroes hero/carousel parallax; `ArtistCarousel` skips the 3D flip + blur.
  Opacity fades tied to scroll position are allowed (not auto-motion).

---

## 5. Mobile-first

- Author base styles for phones; layer up with `sm: md: lg:`. Test **320 / 375 / 768 / 1024 / 1440**.
- **No horizontal overflow at 320px.** Cap fixed-width art with `min(<px>, <vw>)`
  (e.g. the carousel card: `min(380px, 86vw)`), never a hard pixel width.
- **Touch targets ≥44px.** Carousel arrows are 52px; dots/CTAs must clear 44px.
- Provide swipe on anything carousel-like — phones expect drag, not just arrows.
- Respect safe areas; keep primary actions reachable with one thumb.

---

## 6. Titan vintage usage

- **Cassette seal** (`public/titan-seal.png`) = the legitimacy stamp. Use it in the
  footer / as a quiet watermark — not loud, not on every card. It carries the
  Tuscan/rotulista lettering and the only sanctioned Titan Red.
- **Tagline:** "El Sonido del Éxito" travels with the seal.
- **Film grain:** the `.priv-grain` utility (self-contained SVG noise, no network
  request) over hero/stage surfaces. Keep opacity ~0.05–0.08; it's atmosphere, not texture-spam.
- **Gold shimmer** for emphasis (hero title, wordmark); **don't** shimmer everything.

---

## 7. Performance (landing budget)

- Fonts self-hosted via `next/font`, `display: swap`, only the weights used.
- Images through `next/image` with explicit dimensions; hero/seal sized to render size.
- No external texture/CDN requests for grain (inline SVG noise instead).
- Keep landing JS lean — prefer CSS for simple motion; reach for Framer Motion only when coordination is needed.

---

## 8. Known follow-ups

- Some components still use inline `rgba(212,175,55,…)` (the old `#D4AF37`). Migrate
  these to the `#C9A24A` gold family / tokens opportunistically when touching a file.
- A few legacy loader keyframes in `globals.css` (`priv-loader-orbit`, `priv-loader-dots`,
  etc.) are now unused and can be pruned.
