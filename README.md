# OFFGRID / STUDIO

OFFGRID / STUDIO is an experimental creative agency website that explores bold editorial design, kinetic typography and purposeful interaction. It is built with Next.js, React, TypeScript, Tailwind CSS and GSAP. The work focuses on art-directed motion, a visible 12-column grid that the type and imagery deliberately break, responsive layouts recomposed for each screen size, and case studies that each keep their own identity inside one shared system.

The studio, its four projects and their brands are fictional portfolio concepts. No clients, results or services are real.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript. Every route is statically prerendered.
- Tailwind CSS 4, with design tokens as CSS custom properties in `src/app/globals.css`.
- GSAP 3 with ScrollTrigger and `@gsap/react`. There is no smooth-scroll library, because native scrolling stays predictable with the pinned gallery, the menu's scroll lock and keyboard use.
- `next/font` for Space Grotesk (display), Geist (body) and IBM Plex Mono (metadata). `next/image` serves the WebP assets.
- React Hook Form and Zod for the inquiry form. Lucide for icons.
- Playwright for browser tests.

## Setup

Requires Node 20 or later.

```bash
npm install
cp .env.example .env.local   # optional locally; set NEXT_PUBLIC_SITE_URL in production
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (all routes static) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Build, then run the Playwright suite against the production server |
| `npm run assets` | Regenerate `public/images` and `public/og` from the source PNGs |

The Chromium projects use your installed Google Chrome. WebKit and Firefox use Playwright's own builds, so install them once with `npx playwright install webkit firefox`. On a machine without Chrome, also run `npx playwright install chromium` and set `E2E_CHANNEL=` (empty). Run a single engine with `npx playwright test --project=webkit-desktop`.

## Environment

`NEXT_PUBLIC_SITE_URL` is the deployed origin without a trailing slash. It feeds `metadataBase`, the Open Graph URLs, `robots.txt` and `sitemap.xml`. Canonical links are only emitted when it is set. Without it the site falls back to `http://localhost:3000`, so set it before deploying.

## Routes

| Route | Content |
| --- | --- |
| `/` | Hero, manifesto, selected work, services, statement, contact CTA |
| `/work` | Project index, then the projects (a pinned horizontal gallery on desktop) |
| `/work/[slug]` | `rift`, `frequency`, `mono`, `signal`. Statically generated; any other slug returns a 404 |
| `/studio` | Introduction, philosophy, services, process |
| `/contact` | Project inquiry form (demo only, see below). `?type=` preselects the project type |
| `/colophon` | About this build: the portfolio framing, stack, motion architecture and measured test and Lighthouse results. Linked from the footer and the menu, not the header |
| `/robots.txt`, `/sitemap.xml` | Generated from `src/app/robots.ts` and `src/app/sitemap.ts` |
| `/icon`, `/apple-icon`, `/manifest.webmanifest` | Lime "O" favicon (32×32) and "OG" touch icon (180×180) from `src/app/icon.tsx` and `src/app/apple-icon.tsx`, plus `src/app/manifest.ts`. The icons are rendered at build time in Space Grotesk 700, which they fetch from Google Fonts, so the build needs network access (as `next/font` already does) |

## Structure

- `src/data` holds typed content. `projects.ts` has the case studies, each with a `treatment` (accent colour, hero mode, gallery layout). It sits alongside `media.ts`, `services.ts`, `navigation.ts` and `site.ts`.
- `src/components/ui` holds the primitives: `Container`, `EditorialHeading`, `SectionLabel`, `GridLines`, `CtaLink`, `AssetImage`.
- `src/components/{layout,home,work,contact}` holds the page sections. `src/components/motion` holds the motion layer.
- `src/lib/metadata.ts` builds every page's title, description, Open Graph and Twitter cards.
- `scripts/import-assets.sh` maps each source PNG in the project root (kept locally, not committed; the generated files in `public/` are) to its WebP path and generates the 1200×630 social cards. `AssetImage` renders a labelled "Missing asset" frame if a file is ever absent.

Pages and sections are Server Components. Client Components are limited to interactive pieces (`FullscreenMenu`, `NavLink`, `InquiryForm`, `CtaLink`, the error boundary) and the motion components.

## Animation architecture

- **Gating.** Every GSAP feature is built inside `gsap.matchMedia()` with a query from `motionQuery` in `motion/gsap.ts`. Reduced-motion users get none of it, touch devices get no cursor or magnetic pull, and only desktop gets the horizontal gallery. Crossing a breakpoint reverts cleanly, and leaving a route reverts everything through `useGSAP`.
- **Homepage entrance.** This one is pure CSS (`globals.css`, "Homepage entrance"). An inline script in the root layout sets `data-intro="play"` before first paint on a full load of `/`, so the sequence starts on the first frame without waiting for hydration. The sculpture is painted from the start (dimmed, then lit), so it stays the LCP element. Without the flag (JavaScript off, reduced motion, client-side visits) the hero renders in its final state.
- **Behaviour components.** `TextScrub`, `MediaReveal`, `StatementMotion` and `WorkGalleryMotion` render a hidden `<span>` and animate their parent. The sections stay Server Components and no wrapper element disturbs the grid.
- **Server-split text.** `EditorialHeading` renders `[data-line-mask] > [data-line]` per line and, with `splitWords`, `[data-word]` per word. No library rewrites React-owned DOM in the browser.
- **Reveals.** `buildMediaReveal` (`motion/reveal.ts`) is the one image reveal used everywhere. It animates opacity, never `visibility`, so unrevealed links stay focusable and readable by screen readers. The manifesto's muted words never drop below 3:1 contrast.
- **Cursor.** `CustomCursor` reads `data-cursor="view" | "open" | "drag" | "explore"` from the closest ancestor (labels in `motion/cursor.ts`). Positions go straight to transforms through `quickTo`, with no React state. Form fields and open dialogs get the native cursor back, and the label resets on every route change.
- **Magnetic.** `useMagnetic()` returns a ref. Put `data-magnetic-label` on the inner element that should travel further. It is only used on the primary CTA and the form submit.
- **Page transitions.** `TransitionLink` wraps `next/link` and uses `onNavigate`, which Next only fires for same-origin client navigations, so modified clicks, new tabs and downloads behave natively. `PageTransition` covers, navigates, then reveals once the pathname changes, with a 2.5s failsafe. Back/forward and direct loads are never intercepted.
- **Work gallery.** On desktop, `WorkGalleryMotion` sets `data-gallery-mode="horizontal"` (styles in `globals.css`) and pins a track whose scroll distance equals its real overflow. It supports drag to scroll and keeps keyboard focus in view.

## Tests

`tests/e2e` runs across six projects in three engines. Chrome has desktop 1440×900, mobile 390×844 with touch, and desktop with reduced motion. WebKit (the Safari engine) has desktop 1440×900 and iPhone 14 with touch. Firefox has desktop 1440×900. Each test gates on the kind at the end of the project name (`desktop`, `mobile`, `reduced-motion`). Engine-independent checks such as metadata run once, on `chrome-desktop`.

- **Journeys:** home, the menu by keyboard (focus stays inside, Escape closes and restores focus), menu navigation, every case study from Work, the Next-project chain, back/forward, the contact form (validation, focus and the no-send confirmation, with no write requests), the service prefill, the skip link and the 404.
- **Motion:** the horizontal gallery reaches both ends without clipping and keyboard focus brings each project into view. Also the cursor labels, the magnetic return to zero, repeated navigation without leaked overlays or pins, touch behaviour, and reduced motion (no entrance, no wipe, no pin, full-contrast text).
- **Layout:** no horizontal overflow or clipped text on every route at 320, 390, 768, 1024 and 1440px, in each desktop engine because text metrics differ between them. Unique Open Graph titles, no duplicate ids, alt on every image, and working robots and sitemap.

Under Safari's default keyboard setting, Tab skips links and Option+Tab reaches them, so the skip-link test presses Option+Tab on WebKit.

## Demo limitations

- The inquiry form has no backend. It validates in the browser, shows a summary and says plainly that nothing was sent, saved or stored.
- `hello@offgrid.example` is a reserved placeholder domain, and the social links and the author credit show "Pending". Replace them in `src/data/site.ts` (`email`, `socials`, `author`).
- The 404 page uses the site's default title. Next only supports custom 404 metadata through the experimental `global-not-found`.
- Lighthouse mobile LCP is about 2.4 to 3.4s on its simulated slow 4G, driven by the full-bleed campaign images. Desktop LCP is below 1s.
- Automated tests run in Chrome, WebKit (Playwright's Safari engine, desktop and iPhone 14 emulation) and Firefox. Branded Safari, Firefox on Android and physical devices have not been tested.

## Planned, not implemented

A real inquiry backend or email service, a CMS, real social profiles and a production domain.
