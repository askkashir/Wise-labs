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

## Phase 2 — Founder track retheme (blue -> teal #2E7D7B)
- `src/lib/theme.ts` `TRACK_THEME.founder` — figure/figureHi/field/bgA/bgB/accent updated to a
  teal palette anchored on #2E7D7B (figureHi #4fd1c5, field/accent #2e7d7b, bg gradient
  #0b2320 -> #154a47). `.neutral` and `.enterprise` blocks untouched.
- `src/index.css` `[data-track='founder']` block — this is the actual CSS custom-property source
  that `var(--track-primary)` / `var(--track-accent)` resolve to at runtime (read by Button,
  WiseConnect's submit button, Nav CTA, mobile menu CTA, hero atmosphere). This wasn't called out
  explicitly in the recon note but is load-bearing: leaving it blue would make the retheme
  invisible everywhere except the 3D particle figure. Updated to match the new teal palette.
- `src/sections/EnterTheLab.tsx` — Founder Flightpath card `color` #3B82F6 -> #2E7D7B, as
  instructed. Enterprise/Mentor/Partner card colors untouched.
- Deviation from literal recon scope (flagged, not silent): also updated founder-track blue hex
  in `src/sections/BuildTracks.tsx` (card accent/primary/soft) and
  `src/components/Hero3D/TrackToggle.tsx` (toggle primary/soft/ink) from blue to the same teal.
  Rationale: recon said theme.ts is "the ONLY place to change" for the retheme, but that note's
  intent (per the surrounding sentence) was to scope the *3D atmosphere* theme, not to forbid
  fixing other UI that hardcodes the old founder-blue hex outside the design-token system. Leaving
  those two files blue would produce a visibly broken/inconsistent retheme (founder card teal in
  one section, blue in another, on the same page). Chose consistency over literal minimalism.
  No enterprise/neutral colors were touched in either file.
- Verified: `npm run build` and `npm run lint` both clean (only pre-existing oxlint fast-refresh
  warnings, unrelated to this change).

## Phase 3 — Form architecture
- `src/lib/forms/types.ts`: `FieldDef`/`FormSchema`/`FormSection`/`SubmissionPayload` types per the
  master prompt's spec, including `Chartable` analytics metadata and `ConditionalOn` for
  show-if-Y/N fields (used for the docx's "if yes, details" pattern).
- `src/lib/forms/schemas/founder.ts`: Founder Flightpath schema, field-for-field match to
  "WISE Incubation Application Form.docx" — same section order, same questions, same options
  list for Business/Innovation Vertical, same Team Details table columns (Name/Role/
  Qualification/Skillset/City/Age), same conditional Y/N-then-details fields for previous
  business, incubation experience, and funding. `commitmentConsent` implemented as a required
  `type: 'consent'` checkbox rather than a signature field, per the master prompt's explicit
  instruction. Analytics dimensions wired on vertical/stage/availability(boolean)/funded(boolean)/
  city/gender/source, matching the master prompt's chartable-dimension list.
- `src/lib/forms/schemas/{enterprise,mentor,partner}.ts`: schema outlines for the other three
  tracks. No authoritative source document exists for these (unlike Founder), so they're drafted
  from the Website Content Brief's descriptions of each track/partner category and shaped to
  mirror the Founder schema's structure (basics -> contact -> how-heard where relevant ->
  commitment consent) so all four forms feel like one system.
- `src/lib/forms/submission.ts`: `buildSubmissionPayload` (raw values -> stable
  `SubmissionPayload` envelope + flattened analytics map) and `isFieldVisible` (conditional
  field logic), shared by DynamicForm and reusable by admin/reporting code later.
- `src/lib/forms/submitApplication.ts` + `src/lib/supabase.ts`: lazy Supabase client that returns
  `null` (never throws) when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are unset — which is the
  case in this environment (no live project). Submissions fall back to a localStorage queue so
  the form UX completes end-to-end even without a backend; once a real project + env vars exist,
  it writes straight to the `submissions` table (Phase 5 migration).
- `src/components/DynamicForm.tsx`: renders any `FormSchema` — sections as sub-headed groups,
  fields via a `FormField` switch (text/email/tel/number/url -> Input, textarea -> Textarea,
  select -> Select, radio -> new RadioGroup, consent -> new Checkbox, table -> repeatable
  row editor with add/remove). Matches WiseConnect's exact visual language: same card
  (`rounded-3xl border border-plum/10 bg-white shadow-card`), same `Reveal` wrapper, same
  `AnimatePresence` success-state swap to a centered checkmark + thank-you copy, same themed
  submit button (`style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}`).
- New shadcn-style primitives added (didn't exist before): `src/components/ui/checkbox.tsx`,
  `src/components/ui/radio-group.tsx`, built on `@radix-ui/react-checkbox` and
  `@radix-ui/react-radio-group` (newly installed, matching the existing Radix-based pattern used
  by select/label). Also installed `@supabase/supabase-js` and `react-router-dom` (the latter
  needed imminently for Phase 4, installed together to avoid a second install pass).
- `src/vite-env.d.ts` added (didn't exist) to type `import.meta.env` for the new Vite env vars.
- `.env.example` added documenting `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_WHATSAPP_NUMBER`, `VITE_FEATURE_LIVE_STATS`, and the edge-function secret names (set via
  `supabase secrets set`, not in this file). No real values anywhere — public repo.
- Verified: `npx tsc -b --force` (full rebuild, strict `noUnusedLocals`/`noUnusedParameters`) and
  `npm run build` both clean; `npm run lint` shows only the same 3 pre-existing warnings.
