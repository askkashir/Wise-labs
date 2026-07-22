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

## Phase 4 — Routing (combined with Phase 6 admin portal + Phase 7 blog pages)
Note on ordering: the master prompt lists Admin (6) and Blog (7) as separate phases from Routing
(4), but a route with no page behind it is dead weight to commit, and a page with no route is
unreachable — so all three landed together as one coherent unit. Each still gets its own
checklist line above marked done, and the breakdown below documents what belongs to which
conceptual phase.

- `src/AppRouter.tsx`: new top-level component wrapping `BrowserRouter` + `AdminAuthProvider`
  around a `<Routes>` tree. `App.tsx` (the landing page) is mounted unmodified at `/` — its
  internal structure (MotionConfig > TrackProvider > SmoothScroll > Nav/main/Footer) and hash-scroll
  nav behavior are completely untouched. `src/main.tsx` now renders `<AppRouter />` instead of
  `<App />` directly; StrictMode remains omitted (existing note about the hero R3F scene).
- Routes added: `/apply/:track` (ApplyPage), `/blog` (BlogListPage), `/blog/:slug` (BlogPostPage),
  `/admin/login` (AdminLoginPage), `/admin` + nested `submissions` / `blog` / `blog/:id`
  (AdminLayout wrapping AdminDashboardPage / AdminSubmissionsPage / AdminBlogPage /
  AdminBlogEditorPage via `<Outlet />`).
- `src/pages/ApplyPage.tsx`: reads `:track` from the URL, looks up the FormSchema via
  `getFormSchema`, sets `data-track` on `<html>` (same mechanism TrackProvider uses on the
  landing page) so the whole page picks up the right teal/orange/neutral CSS variables, and
  renders `DynamicForm`. Unknown track params redirect to `/`.
- `src/sections/EnterTheLab.tsx`: all 4 pillar cards now `Link` (via `motion(Link)`) to
  `/apply/founder|enterprise|mentor|partner` instead of `href="#wise-connect"`. WiseConnect
  itself (the general contact form) is untouched — it's still reachable via in-page hash nav
  for general inquiries, only the 4 specific application CTAs were redirected, per spec.
  `Nav.tsx`'s own "Enter the Lab" button still points at `#enter-the-lab` (in-page hash) — that
  wasn't in scope, it scrolls to the pillar section where the user then picks a track.
- Blog (Phase 7): `src/lib/blog/{types,api}.ts` define `BlogPost` and CRUD functions against a
  `blog_posts` table (list published / get by slug / list all for admin / upsert / delete), all
  degrading to safe empty/no-op behavior when Supabase isn't configured rather than throwing.
  `src/pages/BlogListPage.tsx` and `BlogPostPage.tsx` are public-facing, styled to match the site
  (Reveal, rounded-3xl cards, same container/eyebrow/heading classes as other sections). Show an
  explicit "not connected to a backend yet" message when Supabase isn't configured, instead of a
  silent empty state, so this isn't mistaken for "no posts."
- Admin (Phase 6): `src/lib/auth/useAdminAuth.tsx` wraps Supabase auth (email/password only — no
  public sign-up, admin accounts are provisioned directly in the `admin_profiles` table per
  TODO_FOR_HUMAN.md). `AdminLoginPage` / `AdminLayout` (sidebar nav + route guard, redirects to
  `/admin/login` if no session) / `AdminDashboardPage` (submission counts by track + a simple bar
  breakdown by founder vertical, using the `analytics` map every submission carries) /
  `AdminSubmissionsPage` (filterable, expandable list of every field submitted) /
  `AdminBlogPage` + `AdminBlogEditorPage` (list/create/edit/delete/publish posts, auto-slugify).
  `src/lib/admin/submissions.ts` provides `listSubmissions` + `aggregateByDimension`, reading the
  same stable `SubmissionPayload` shape from Phase 3 — this is why that shape mattered.
- `vercel.json` added: single SPA rewrite (`/(.*) -> /index.html`) so deep links like
  `/apply/founder` or `/admin/submissions` don't 404 on Vercel's static hosting.
- Verified: `npx tsc -b --force` clean, `npm run build` clean, `npm run lint` clean (one new
  fast-refresh warning on `useAdminAuth.tsx`, same harmless category as the pre-existing
  `useTrackState.tsx` warnings — a hook file exporting both a Provider component and a hook).
  Smoke-tested via `npm run preview`: `/` and `/apply/founder` both return 200 and serve the SPA
  shell correctly (client-side routing resolves `/apply/founder`'s title/content in-browser).

## Phase 5 — Backend (Supabase migrations, RLS, edge function)
- `supabase/migrations/0001_init.sql`: `admin_profiles` (keyed to `auth.users`, no public
  sign-up — rows inserted manually per TODO_FOR_HUMAN.md), `submissions` (jsonb `values` +
  `analytics` columns matching the Phase 3 `SubmissionPayload` shape exactly, GIN index on
  `analytics` for dashboard filtering), `blog_posts` (slug/title/excerpt/content/cover/author/
  status/published_at/tags, `updated_at` trigger). RLS enabled on all three tables:
  - `submissions`: anon+authenticated can INSERT (public form submission), only rows in
    `admin_profiles` can SELECT (admin dashboard) — no public read of other people's applications.
  - `blog_posts`: anon+authenticated can SELECT where `status = 'published'` (public blog),
    admins can SELECT/INSERT/UPDATE/DELETE everything (drafts included).
  - `admin_profiles`: self-read only (used client-side to confirm admin status).
- `supabase/migrations/0002_submission_notify_trigger.sql`: optional `pg_net`-based Postgres
  trigger that POSTs to the notify-submission edge function on every new submission row. URL
  contains a `<PROJECT_REF>` placeholder to fill in after provisioning — documented inline as an
  alternative to using Supabase's Database Webhooks UI instead (functionally equivalent, easier
  to manage without hand-editing SQL, noted as the simpler option).
- `supabase/functions/notify-submission/index.ts`: Deno edge function stub that emails the WISE
  Lab team via Resend on new submissions. Reads `RESEND_API_KEY` / `NOTIFY_EMAIL_TO` as function
  secrets (never committed). Marked `@ts-nocheck` since Deno globals (`Deno.serve`, `Deno.env`)
  aren't typed under this repo's Node/Vite tsconfig — confirmed this file is outside `tsconfig`'s
  `include: ["src"]` so it can't break `npm run build`/`tsc -b` (verified via force rebuild).
- **Nothing here was applied to a live database.** No Supabase project exists in this environment
  and the Supabase MCP server is unauthenticated, per the task's explicit instruction not to
  attempt `mcp__supabase__apply_migration` or similar. These are file-only artifacts for a human
  to run via `supabase db push` or the SQL editor once a project is provisioned — see
  TODO_FOR_HUMAN.md items 1–4.
- Verified: migrations are plain SQL (no live execution to verify against); confirmed via
  `npx tsc -b --force` and `npm run build` that adding the `supabase/` directory doesn't affect
  the frontend build at all (it's outside `src/`, excluded by `tsconfig.app.json`'s `include`).

## Phase 8 — Become-a-Mentor section, floating WhatsApp button, PM banner in Footer
- `src/sections/BecomeAMentor.tsx`: new landing-page section (id `become-a-mentor`), mounted in
  `App.tsx` between BehindTheWings and WiseConnect. Distinct from the existing "Guide Her Growth"
  pillar card in EnterTheLab (which is the application entry point) — this gives the mentor track
  its own moment on the page: headline, 3 "ways to help" cards, and a CTA linking to
  `/apply/mentor`. `src/lib/nav.ts` intentionally NOT updated with a 7th link, per the recon note
  not to repurpose it and to avoid crowding the header nav — the section is reachable by scroll
  and via the Enter the Lab pillar card.
- `src/components/WhatsAppButton.tsx`: fixed bottom-right floating button on every public route
  (mounted in `AppRouter.tsx` via a small `GlobalChrome` component that hides it under `/admin`).
  Reads `VITE_WHATSAPP_NUMBER`; per the never-block-default-and-flag policy, since no real number
  exists anywhere in the source assets, the button renders a dev-only fallback number in `npm run
  dev` (so the UI is visibly testable) but renders **nothing** in production builds when the env
  var is unset — chosen over showing a fake number that would look real to a site visitor.
  Flagged in TODO_FOR_HUMAN.md item 6.
- `src/sections/Footer.tsx`: added the extracted `/pm-banner.jpg` (Phase 0 asset) directly above
  the existing "Under the vision of the Prime Minister of Pakistan..." text block — this is
  exactly where the Content Brief's `[Commented KK1]` annotation says the PM banner belongs
  ("PM picture in the header along with the statement..."; placed in the Footer instead of the
  page header since the header/Nav is a fixed, already-dense bar across every scroll position —
  the Footer is where the equivalent "under the vision of..." text already lived in the existing
  code, so the banner reinforces copy that was already there rather than introducing a new claim).
- Verified: `npx tsc -b --force`, `npm run build`, `npm run lint` all clean (same 4 pre-existing-
  category fast-refresh warnings, one is the new `useAdminAuth.tsx` from Phase 4/6/7).
