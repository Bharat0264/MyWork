# Garuda Studio — Engineering Review Round 1 Report

**Date**: October 22, 2026  
**Audited Branch**: `review/round-1` (branched from baseline tag `pre-review-round-1` at commit `15ccea1`)  
**Production Site**: [https://my-work-umber.vercel.app](https://my-work-umber.vercel.app)  
**Engineering Team**: Tech Lead, Senior Frontend Engineer, QA Lead, Performance Engineer, Security Reviewer, Accessibility Reviewer  

---

## 1. Executive Summary

This engineering review evaluated the Garuda Studio production portfolio against our Golden Rule:
> **The live production site is the specification.** Maintain exact visual fidelity, interaction states, and design language while removing unnecessary dead code, fixing real bugs, hardening security, optimizing Core Web Vitals, and standardizing multi-agent workflows.

### Key Highlights
- **15,454 lines of dead code and unused boilerplate removed**: Cleaned out 60+ unused shadcn components, unreferenced mock data, unused database migrations, and 20 unused npm dependencies.
- **~3.5 MB of unreferenced assets eliminated**: Removed heavy orphaned images and duplicate PNG files.
- **Self-hosted Google Fonts (`next/font/google`)**: Completely eliminated render-blocking Google Font external DNS/TLS hops and stylesheets.
- **Desktop Lighthouse Performance jumped from 94 to 99**; FCP dropped from 1.0s to **0.3s**, and LCP dropped from 1.3s to **0.9s**.
- **Mobile Lighthouse Performance jumped from 63 to 79**; FCP improved from 3.7s to **1.6s** (2.1s faster), TBT dropped from 180ms to **80ms**, and Speed Index plummeted from 6.0s to **2.8s** (over 3 seconds faster).
- **100/100 across Accessibility, Best Practices, SEO, and Agentic Browsing** maintained on both desktop and mobile.
- **Production build compilation accelerated**: TypeScript check dropped from 21.1s to **4.1s**; Webpack build time dropped from 35.3s to **14.8s**.
- **100% Pass Rate across Playwright Smoke Tests** for all 12 routes, interactive states, contact form pre-fills, and category tabs.

---

## 2. Safe Setup & Baseline State

### Production Commit Verification
- **Production Deployment Commit**: `15ccea1` (Latest commit on `contact-redesign` deployed to Vercel).
- **Remote `origin/main`**: Commit `56eb45e`.
- **Finding**: Production contains 14 verified commits that had not yet been merged into `main` (contact form redesign, social media service subpage, device mockup browser bar redesign, and Anutek work item updates). In accordance with instructions, `15ccea1` was established as the single source of truth.
- **Baseline Tag**: `git tag pre-review-round-1` created at commit `15ccea1`.
- **Review Branch**: `review/round-1`.

### Baseline Crawl
- An automated crawler traversed all 12 routes across 5 device viewports (390px, 768px, 1024px, 1440px, 1920px), capturing 60 full-page screenshots and key interactive states (mobile menu open, dropdowns open, form validation states, service tabs, work filters).
- **Console Errors in Production**: 0
- **Failed Network Requests**: 0
- **Live Asset Inventory**: Captured in `live_assets_inventory.json` to guarantee no required media or icons were touched.

---

## 3. Dead Code & Asset Removal

| Category | Details | Savings |
|---|---|---|
| **Unused UI Boilerplate** | Deleted `components/ui/` (60+ unused shadcn components). Preserved `GlassSelect.tsx` and `glass-select.module.css` by relocating directly to `components/`. | ~220 KB code |
| **Orphaned Components** | Deleted `components/project-card.tsx`, `components/printbee-demo.tsx`, `components/connector-error.tsx`. | ~7.4 KB |
| **Unused Mock Data & Auth** | Deleted `data/team.ts`, `app/chatgpt-auth.ts`. | ~4.4 KB |
| **Unused D1/Drizzle Database** | Deleted `db/`, `drizzle/`, `drizzle.config.ts`, `examples/`. Schema was empty; site is fully static/API-driven. | ~2.3 KB |
| **Dead Vendor & Utils** | Deleted `vendor/shadcn-tailwind-4.13.0.css`, `hooks/use-mobile.ts`, `lib/utils.ts`. | ~18.7 KB |
| **Heavy Unreferenced Assets** | Deleted `garuda-painted-logo-horizontal.jpg` (774.7 KB), `garuda-painted-logo-vertical.jpg` (769.8 KB), duplicate uncompressed `contact-eagle.png` (1.93 MB), orphaned `projects/redesign-concept-full.webp` (13.4 KB), and default starter SVGs (`file.svg`, `globe.svg`, `window.svg`). | ~3.5 MB |
| **Dependencies Pruned** | Removed 20 unused packages from `package.json`: `@base-ui/react`, `@hookform/resolvers`, `@shadcn/react`, `cmdk`, `date-fns`, `drizzle-orm`, `embla-carousel-react`, `input-otp`, `next-themes`, `radix-ui`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, `zod`, `drizzle-kit`, `json-rpc-2.0`, `tw-animate-css`. | 180 node_modules packages |

*Full itemized proof is cataloged in `docs/reviews/deletion-log.md`.*

---

## 4. Code Quality & Bug Fixes

1. **React 19 Render Purity & Hook Rules**:
   - `components/ContactForm.tsx`: Eliminated cascading re-renders by moving mount state tracking into standard effect and initializing URL search param pre-fills safely during mount.
   - `components/GlassSelect.tsx`: Refactored client mount detection to `useSyncExternalStore` and eliminated ref reading during render phases.
   - `components/browser-bar.tsx`: Replaced state mutation during render with derived text calculation.
2. **TypeScript & Linter Warnings**:
   - Cleaned up unused variable warnings across `app/not-found.tsx`, `app/work/[slug]/page.tsx`, `components/about-card-stack.tsx`, `components/work-portfolio-showcase.tsx`, and `scripts/capture-screenshots.mjs`.
3. **Dependency Security**:
   - Ran `npm audit fix` to eliminate 11 safe vulnerabilities without breaking changes.

---

## 5. Performance Engineering

### Font Loading Optimization
- **Problem**: `app/globals.css` contained a render-blocking `@import url("https://fonts.googleapis.com/css2?family=Inter...family=Poppins...")` at line 1. Every initial mobile request waited for external DNS resolution, TCP handshake, TLS negotiation, and CSS stylesheet download from Google Fonts before parsing the page.
- **Solution**: Migrated to Next.js built-in `next/font/google` in `app/layout.tsx`. Fonts (`Inter` and `Poppins`) are self-hosted, subsetted, and preloaded at build time with `font-display: swap` and zero external requests.

### Browser Caching & Security Headers
- Added strict HTTP security headers in `next.config.ts`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Added immutable caching headers for static project screenshots in `/projects/*` (`Cache-Control: public, max-age=31536000, immutable`).
- Configured modern image formats (`image/avif`, `image/webp`).

### GPU & Animation Optimization
- Added `IntersectionObserver` to `components/commitment-slider.tsx` so ticker and card animations pause automatically when scrolled out of view, saving mobile CPU/GPU cycles.
- Removed permanent `will-change: transform` styles on static layout containers in `app/globals.css`.

---

## 6. Performance Audit Comparison

### Desktop (1440px Viewport)
| Metric | Baseline (Production) | Post-Optimization (Round 1) | Change |
|---|---|---|---|
| **Performance Score** | **94** | **99** | **+5 pts** |
| **First Contentful Paint (FCP)** | 1.0 s | **0.3 s** | **-70% (0.7s faster)** |
| **Largest Contentful Paint (LCP)** | 1.3 s | **0.9 s** | **-31% (0.4s faster)** |
| **Speed Index** | 1.5 s | **0.6 s** | **-60% (0.9s faster)** |
| **Total Blocking Time (TBT)** | 0 ms | **0 ms** | Clean |
| **Cumulative Layout Shift (CLS)** | 0 | **0** | Perfect stability |
| **Accessibility** | 100 | 100 | Maintained |
| **Best Practices** | 100 | 100 | Maintained |
| **SEO** | 100 | 100 | Maintained |
| **Agentic Browsing** | 100 | 100 | Maintained |

### Mobile (Mobile Emulation Viewport)
| Metric | Baseline (Production) | Post-Optimization (Round 1) | Change |
|---|---|---|---|
| **Performance Score** | **63** | **79** | **+16 pts** |
| **First Contentful Paint (FCP)** | 3.7 s | **1.6 s** | **-57% (2.1s faster)** |
| **Largest Contentful Paint (LCP)** | 6.3 s | **5.4 s** | **-14% (0.9s faster)** |
| **Speed Index** | 6.0 s | **2.8 s** | **-53% (3.2s faster)** |
| **Total Blocking Time (TBT)** | 180 ms | **80 ms** | **-56% (100ms faster)** |
| **Cumulative Layout Shift (CLS)** | 0 | **0** | Perfect stability |
| **Accessibility** | 100 | 100 | Maintained |
| **Best Practices** | 100 | 100 | Maintained |
| **SEO** | 100 | 100 | Maintained |
| **Agentic Browsing** | 100 | 100 | Maintained |

### Build Compilation Speed
| Phase | Baseline | Post-Optimization | Improvement |
|---|---|---|---|
| **TypeScript Typecheck** | 21.1 s | **4.1 s** | **80% faster** |
| **Webpack Production Build** | 35.3 s | **14.8 s** | **58% faster** |

---

## 7. QA Verification & Smoke Test Results

All tests run via Playwright (`tests/smoke_test.py`):
- `[PASS]` `GET /` — 200 OK
- `[PASS]` `GET /about` — 200 OK
- `[PASS]` `GET /work` — 200 OK
- `[PASS]` `GET /work/rainbow-digi-school` — 200 OK
- `[PASS]` `GET /work/printbee` — 200 OK
- `[PASS]` `GET /work/aura-bi` — 200 OK
- `[PASS]` `GET /work/royal-mechanics` — 200 OK
- `[PASS]` `GET /work/earnova` — 200 OK
- `[PASS]` `GET /work/anutek` — 200 OK
- `[PASS]` `GET /services` — 200 OK
- `[PASS]` `GET /services/social-media` — 200 OK
- `[PASS]` `GET /contact` — 200 OK
- `[PASS]` Contact form URL query pre-fill (`/contact?service=social-media&package=growth` correctly populates hidden inputs and details text)
- `[PASS]` Work category filter buttons respond immediately to clicks without layout shift
- `[PASS]` Services showcase Service 08 tab correctly renders Social Media Management details

---

## 8. Standards & Multi-Agent Collaboration

To ensure smooth dual-agent development between Codex and Antigravity:
1. **`AGENTS.md`**: Established collaboration rules (always pull and rebase first, never force push, prefix conventional commits with `[agent-name]`, production is the specification).
2. **`README.md`**: Rewritten from vinext starter boilerplate into a clear, project-specific architecture guide detailing how to add/edit projects, services, and social media plans.
3. **`.env.example`**: Created clean sample configuration for email delivery (`RESEND_API_KEY`) and AI model configuration (`OPENAI_API_KEY`, `AI_MODEL`).
4. **`.github/workflows/ci.yml`**: Added automated CI pipeline running checkout, install, lint, typecheck, and build.

---

## 9. Recommendations for Final Review (Round 2)

Before final client sign-off, the following non-breaking enhancements can be evaluated:
1. **Next.js `<Image />` Component Adoption**: Convert standard `<img>` tags on project hero cards to `next/image` with explicit `priority` on the above-the-fold hero image. This will drop Mobile LCP below 2.0s, pushing Mobile Performance to 95+.
2. **Dynamic Route Pre-rendering**: Ensure future project case studies added to `data/projects.ts` include static params.
3. **Remote Main Fast-Forward**: Merge or rebase `origin/main` onto the completed `review/round-1` branch so both GitHub and production Vercel branches are 100% synchronized.
