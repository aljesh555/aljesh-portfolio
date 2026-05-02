# Atelier of Code — Aljesh Raut · Portfolio

Premium, motion-rich single-page portfolio for an independent software craftsman.

## Stack

- Vite + React 19
- Tailwind v4 (`@tailwindcss/vite`)
- Framer Motion (scroll-driven animation, magnetic CTAs, route transitions)
- Lenis (Apple-grade smooth scroll)
- React Three Fiber + drei (liquid 3D hero)
- GSAP (utility, ready to extend with ScrollTrigger)
- Lucide icons

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build       # outputs ./dist
npm run preview     # serves ./dist locally
```

## Deploy (Cloudflare Pages, via Wrangler)

```bash
# already authenticated
npm run build
npx wrangler pages deploy dist --project-name=aljesh-portfolio --branch=main
```

The first deploy creates the project on your Cloudflare account; subsequent deploys are incremental.

## Notes

- Theme: white (Bone) ↔ dark (Nocturne). Persists in `localStorage`.
- Cursor: custom dot/ring on desktop, native on touch.
- Reduced motion is respected throughout.
- The hero portrait lives at `/public/portrait.jpg` — swap as needed.
- Contact channels are configured in `src/lib/data.js`.
