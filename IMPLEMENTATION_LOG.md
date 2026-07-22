# Implementation Log

## Phase 0 — Recon + asset extraction
- Confirmed repo state: clean, builds via `npm run build`, remotes `fork` (push target) and `origin` (read-only) both present.
- Read src/lib/theme.ts, src/App.tsx, src/sections/EnterTheLab.tsx, src/sections/WiseConnect.tsx, src/components/{Nav,Reveal,WiseLabLogo}.tsx, src/lib/{nav,useTrackState}.ts, index.html to confirm patterns before writing any code.
- PDF logo extraction: `WISE Lab Logo Reveal.pdf` has 4 pages, no embedded raster images (`pdfimages -list` empty — vector AI artwork). Rasterized all 4 pages at 300dpi with `pdftoppm`. Page 1 is the clean full-color lockup on white (mark + "WISE Lab" wordmark + "HER IDEA . HER ENTERPRISE" tagline) — matches the existing in-repo SVG fallback design 1:1, confirming this is the canonical mark.
- Used PIL to autocrop whitespace, then band-detect (row content analysis) to isolate the butterfly mark from the wordmark/tagline bands, producing a mark-only crop.
- Keyed white background to transparent (alpha channel) via numpy pixel threshold (>240,240,240 -> alpha 0) on both the full lockup and the mark-only crop.
- Output: `public/wise-lab-logo.png` (full lockup, transparent), `public/wise-lab-mark.png` (mark only, transparent), `public/favicon.svg` (192x192 raster of the mark embedded as base64 inside an SVG wrapper — replaces the prior generic/unrelated purple abstract-shape placeholder favicon).
- Banner: `SHAHABZBANNER.jpeg` is 11801x3485 (~3.6MB) — downscaled to 2400px wide (708px tall, same ~3.4:1 aspect), JPEG quality 85 -> ~113KB. Saved as `public/pm-banner.jpg`.
- Read Content Brief PDF in full via pdftotext. Confirms: banner = official "Under the vision of the Honorable Prime Minister of Pakistan, WISE Lab is designed & funded by the Ministry of IT & Telecom & Ignite - National Technology Fund" endorsement strip, intended for header/landing area per brief's `[Commented KK1]` annotation. Also confirms exact CTA copy already matches EnterTheLab.tsx pillar cards (Take Flight / Grow Your Enterprise / Become a Mentor / Partner with WISE) — no copy changes needed there.
- Verification: `npm run build` passes at baseline (pre-existing, confirmed before any edits).

## Phase 1 — Logo swap + favicon + PM banner landed
(see commit for file list)
