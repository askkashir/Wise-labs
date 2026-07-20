# WISE Lab — Interactive Flagship Prototype

A high-fidelity, front-end **prototype** for **WISE Lab (Women Innovation &
Startup Empowerment Lab)** — Pakistan's national platform for women-led startups
and MSMEs. Single-page, no backend.

The centerpiece is an interactive 3D hero: an abstract particle figure that
**morphs between three states** (neutral → Founder / blue → Enterprise / orange)
and recolors the whole page as you switch tracks.

## Run it locally

Requirements: **Node.js 20+** and npm (no database, API keys, or `.env` needed —
it's a fully static front-end).

```bash
# 1. clone
git clone git@github.com:askkashir/Wise-labs.git
cd Wise-labs        # (folder name may differ if you cloned via HTTPS)

# 2. install dependencies
npm install

# 3. start the dev server
npm run dev
```

Then open the URL it prints (default **http://localhost:5173**).

> Cloning over HTTPS instead? Use
> `git clone https://github.com/askkashir/Wise-labs.git`

## Other commands

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Tech stack

React + Vite + TypeScript · react-three-fiber / three.js (3D hero) ·
Tailwind CSS · shadcn/ui + Radix (form) · Framer Motion · Lenis (smooth scroll).

## Notes for reviewers

- **The 3D hero needs a real, visible browser tab** to animate — browsers freeze
  `requestAnimationFrame` in hidden/background tabs. Click the blue/orange track
  selectors under the hero to see the figure morph and the page recolor.
- Fully responsive; the track toggle works on touch. Honors
  `prefers-reduced-motion`, and falls back gracefully if WebGL is unavailable.
- The three.js scene is code-split and lazy-loaded, so the initial page is light.
- Optional future hook: a real rigged GLB model can be dropped in via
  `FIGURE_GLB_URL` in `src/components/Hero3D/HeroScene.tsx` — off by default.
