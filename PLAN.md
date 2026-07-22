# WISE Lab Platform v1 — Implementation Plan

Branch: `feat/wiselab-platform-v1`
Remote: push to `fork` (T361/Wise-labs) only. Never push to `origin` (askkashir/Wise-labs).
Final PR: cross-repo, `gh pr create --repo askkashir/Wise-labs --head T361:feat/wiselab-platform-v1`, NOT merged.

## Resumability contract
- This file (PLAN.md) is the source of truth for phase status. Check the checkboxes as phases land.
- IMPLEMENTATION_LOG.md has one entry per phase: what changed, why, verification performed.
- TODO_FOR_HUMAN.md lists everything a human must still do (Supabase provisioning, env vars, ambiguous defaults that were flagged instead of blocking).
- Commit after every phase (small, scoped commits). If interrupted, `git log` + this file's checkboxes show exactly where to resume.
- Every phase must pass `npm run build` and `npm run lint` before commit.

## Never-block-default-and-flag policy
Ambiguous/unspecified inputs are never blockers. Default sensibly, ship, and record the default + rationale in TODO_FOR_HUMAN.md:
- Teal hex for founder retheme: using `#2E7D7B` (explicitly given in task).
- WhatsApp number: no real number provided -> placeholder `+92 300 0000000` via `VITE_WHATSAPP_NUMBER` env var, defaults to a clearly-fake placeholder, flagged.
- Banner filename/path: `public/pm-banner.jpg`, flagged as extracted+recompressed asset.
- i18n non-English strings: machine-drafted (UR/PS/PA), flagged for native-speaker review.

## Phases

- [x] Phase 0 — Recon + asset extraction (logo from PDF, banner processed, content brief read)
- [x] Phase 1 — Logo swap + favicon + PM banner asset landed in public/
- [x] Phase 2 — Founder track retheme (blue -> teal #2E7D7B) in src/lib/theme.ts + index.css + EnterTheLab/BuildTracks/TrackToggle founder color
- [x] Phase 3 — Form architecture: FieldDef/FormSchema types, Founder/Enterprise/Mentor/Partner schemas, DynamicForm component
- [x] Phase 4 — Routing: react-router-dom, /apply/:track, /blog, /blog/:slug, /admin/*, vercel.json, CTA wiring in EnterTheLab
- [x] Phase 5 — Backend: Supabase SQL migrations (submissions/blog_posts/admin_profiles), RLS policies, env var docs, edge function stub
- [x] Phase 6 — Admin portal (auth-gated, submissions table, blog CRUD) — built alongside Phase 4 routing since routes/pages are one unit of work; see log
- [x] Phase 7 — Blog management (public list/detail pages + admin CRUD wired to schema) — built alongside Phase 4/6 for the same reason
- [ ] Phase 8 — Become-a-Mentor section/page + floating WhatsApp button
- [ ] Phase 9 — Multilingual EN/UR/PS/PA with RTL support; live stats/countdown behind feature flag; partner logo fetching
- [ ] Phase 10 — Finalize: full verification pass, TODO_FOR_HUMAN.md finalize, push to fork, open PR cross-repo

## Key repo facts (recon, don't re-derive)
- Founder theme: `src/lib/theme.ts` `TRACK_THEME.founder` — only touch this block for retheme.
- `src/App.tsx` root structure must stay intact; router wraps around it.
- `src/lib/nav.ts` = in-page hash nav only, don't repurpose.
- `src/sections/EnterTheLab.tsx` line ~64 `href="#wise-connect"` on 4 cards -> route to /apply/founder|enterprise|mentor|partner.
- `src/sections/WiseConnect.tsx` is the visual/pattern reference (Reveal, Field wrapper, shadcn Input/Textarea/Select, themed submit Button, AnimatePresence success state).
- package.json: `npm run dev|build|lint|preview`. No test runner.
- No live Supabase project / MCP unauthenticated -> SQL migrations as files only, no live apply.
- index.html favicon/title/meta: favicon updated in Phase 1; title/meta left as-is unless a route needs its own.

## Assets extracted (Phase 0)
- `public/wise-lab-logo.png` — full lockup (mark + wordmark + tagline), white-keyed transparent, extracted from page 1 of "WISE Lab Logo Reveal.pdf" via pdftoppm @300dpi + PIL crop/key.
- `public/wise-lab-mark.png` — butterfly mark only, same source, transparent.
- `public/favicon.svg` — SVG wrapping a 192x192 raster of the mark (replaces prior generic purple placeholder).
- `public/pm-banner.jpg` — Shahbaz Sharif / Ignite / Ministry of IT & Telecom / WISE Lab banner, downscaled to 2400px wide, recompressed JPEG q85 (source was 11801x3485, ~3.6MB).
- Content brief read in full; confirms banner is the official "under the vision of the PM" endorsement strip — used near Hero or Footer in Phase 1/8.
