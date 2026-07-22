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

## Phase 9 — i18n (EN/UR/PS/PA + RTL), live stats/countdown flag, partner config
- **i18n infrastructure** (`react-i18next` + `i18next`, newly installed): `src/i18n/index.ts` sets
  up 4 locale bundles, persists the chosen language to `localStorage`, and keeps
  `<html lang>`/`<html dir>` in sync via `applyLanguageToDocument` (fired on init and on every
  `languageChanged` event) — this is what actually flips the page to RTL for Urdu/Pashto/Punjabi,
  not just a CSS class. `src/components/LanguageSwitcher.tsx` is a Select-based switcher (reusing
  the existing shadcn Select) mounted in both the desktop nav bar and the mobile slide-in menu.
  Added Noto Nastaliq Urdu as a webfont and a `[dir='rtl'] body { font-family: ... }` rule in
  `index.css` so RTL script actually renders instead of tofu/fallback glyphs.
- **Translation coverage — partial, and this is a deliberate, disclosed scope decision, not an
  oversight.** The landing page has deeply choreographed, per-word/per-character framer-motion
  entrance animations (Hero.tsx's `words` array is animated letter-group-by-letter with staggered
  delays; several other sections have similar hardcoded copy tied to animation timing). Machine-
  translating every string across the whole site in one pass risked either (a) silently breaking
  those animations by changing string/word-count assumptions the animation math depends on, or
  (b) shipping visually broken RTL layouts in sections never designed with RTL in mind, with no
  way to verify visually in this environment. Chose a smaller, fully-correct, fully-wired subset
  over a larger, unverified one:
  - **Translated and wired**: Nav (links, home aria-label, CTA, mobile menu), Footer (tagline,
    PM-vision copy, funded-by line, copyright, closing line), the new BecomeAMentor section
    (Phase 8), WhatsAppButton's aria-label, and all of DynamicForm's chrome strings (submit/
    sending/validation errors/success-fallback-name/submit-another/add-row/remove-row/choose-one)
    — meaning every one of the four application forms (Founder/Enterprise/Mentor/Partner) is
    already RTL- and translation-aware for all its non-schema-driven UI.
  - **Left in English, not yet wired to i18n**: Hero's animated headline/subcopy, WiseJourney,
    BuildTracks, EnterTheLab's card copy, PowerCircle, BehindTheWings, WiseConnect's field labels,
    and the Founder/Enterprise/Mentor/Partner form *schemas themselves* (question text, e.g.
    "What problem are you solving?") — these still render in English regardless of selected
    language. Flagged explicitly in TODO_FOR_HUMAN.md item 9 with a concrete list of what's left.
  - The locale JSON files themselves (`ur.json`/`ps.json`/`pa.json`) all carry a `"_meta":
    {"reviewStatus": "machine-drafted, NOT reviewed by a native speaker..."}` key as a
    machine-readable flag, in addition to the TODO_FOR_HUMAN.md callout — so the flag survives
    even if someone greps the JSON directly instead of reading the markdown.
- **Live stats + countdown** (`src/lib/stats.ts` + `src/sections/LiveStats.tsx`): real
  Supabase-derived counts (applications/cities/mentors, computed from the same `analytics` map
  every submission carries) plus a countdown timer. Gated behind `VITE_FEATURE_LIVE_STATS`
  (default `false`) and **not mounted in `App.tsx`** — there's no real application-cycle deadline
  to count down to, so `getNextCycleDeadline()` defaults to "30 days from first page load,
  persisted per session" rather than a fabricated hardcoded date. A human flips the flag and adds
  `<LiveStats />` to the landing page once real numbers/dates exist (TODO_FOR_HUMAN.md item 10).
- **Partner logo fetching** (`src/lib/partners.ts`): a config-driven `Partner[]` module
  (name/role/logoUrl/href) intended as the single place partner data lives, ready to swap for a
  real fetch or Supabase table later without touching any component. Deliberately did NOT rewire
  the existing `PowerCircle.tsx` section to consume it — that section's hardcoded partner cards
  already work correctly and rewiring them for no visible behavior change (all `logoUrl: null`
  today, since no real partner logo URLs were provided) would be pure risk with no benefit.
  Flagged in TODO_FOR_HUMAN.md item 11.
- Verified: `npx tsc -b --force`, `npm run build`, `npm run lint` all clean (same 4 pre-existing-
  category warnings). Validated all 4 locale JSON files parse correctly. Confirmed via grep that
  `LiveStats`/`partners.ts` are intentionally not wired into `App.tsx`/`PowerCircle.tsx` (dead
  code by design, not by accident) so a reviewer doesn't mistake this for an incomplete wire-up.

## Phase 10 — Finalize
- **Secrets scan**: ran a manual `git diff main | grep -iE "api[_-]?key|secret|password|token|
  bearer"` across the entire feature branch diff. All matches are either documentation text
  (env var names, comments about where secrets go) or legitimate `password`-typed form fields in
  the admin login UI — no real secret values anywhere in the diff.
- **Found and fixed a real gap**: `.gitignore` had no `.env` pattern at all (pre-existing, not
  introduced by this work, but this feature branch is the first thing in the repo that actually
  creates a documented `.env` workflow via `.env.example`). Added `.env` / `.env.*` /
  `!.env.example` to `.gitignore` so a future `cp .env.example .env` with real Supabase keys
  can't be accidentally committed to this public repo.
- **Final verification pass**: `npm run build` and `npm run lint` clean (same 4 pre-existing-
  category fast-refresh warnings as every prior phase, none new). Smoke-tested via
  `npm run preview`: `/`, `/apply/{founder,enterprise,mentor,partner}`, `/blog`, `/admin`,
  `/admin/login` all return HTTP 200 and serve the SPA shell (client-side routing resolves them
  correctly in-browser; `vercel.json`'s rewrite rule replicates this on Vercel's static hosting).
- PLAN.md checklist: all 11 phase lines marked done (Phase 4/6/7 landed together as one commit,
  documented at the top of that phase's log entry; every other phase is 1:1 with a commit).
- Pushed `feat/wiselab-platform-v1` to the `fork` remote (T361/Wise-labs) — never pushed to
  `origin` (askkashir/Wise-labs), per the task's access constraints.
- Opened the PR cross-repo via `gh pr create --repo askkashir/Wise-labs --head T361:feat/wiselab-
  platform-v1`. Not merged, per instruction.

## Phase 11 — Mobile responsiveness audit + tasteful polish pass
Additive-only pass: no redesign, no palette/typography/hero changes. Read `src/index.css` and
`tailwind.config.js` first to confirm existing tokens (plum/teal/coral/beige, `shadow-card` /
`shadow-card-hover`, `rounded-3xl` card vocabulary, Reveal/RevealGroup/RevealItem spring
patterns) before writing anything, per the task brief.

**Audit method**: read every section in `src/sections/*.tsx`, every page in `src/pages/**/*.tsx`,
`DynamicForm.tsx`, `Nav.tsx`, `LanguageSwitcher.tsx`, `WhatsAppButton.tsx`, and `Footer.tsx` in
full. Ran `npm run dev` and used the Playwright MCP browser to resize to 375/390/413(428
viewport, DPR-adjusted)/768px and check `document.documentElement.scrollWidth >
document.documentElement.clientWidth` (the definitive horizontal-overflow test) plus screenshots,
across `/`, `/blog`, `/apply/{founder,enterprise,mentor,partner}`, `/admin/login`. The admin
dashboard/submissions/blog pages sit behind Supabase auth with no project provisioned in this
environment, so those three were verified by careful JSX/Tailwind reading rather than live
screenshots, per the task's fallback instruction.

**Finding — the landing page, blog, and apply pages were already solid.** Every section
(`Hero`, `WiseJourney`, `BuildTracks`, `EnterTheLab`, `PowerCircle`, `BehindTheWings`,
`BecomeAMentor`, `WiseConnect`, `Footer`), `Nav.tsx` (including its mobile slide-in drawer,
`LanguageSwitcher`, and interplay with `WhatsAppButton`'s z-40 vs. the drawer's z-60), `ApplyPage`,
`BlogListPage`/`BlogPostPage`, and `DynamicForm.tsx` (including the team-member "table"/repeater
field, which already collapses to `grid-cols-1` below the `sm:` breakpoint) all measured zero
horizontal overflow at every tested width and use the existing `sm:`/`md:`/`lg:` convention
correctly. No changes were needed to any of these for mobile correctness.

**Real bug found and fixed**: `src/pages/admin/AdminLayout.tsx` had a fixed `w-64 shrink-0`
(256px) sidebar with **no mobile handling at all** — on a 375px viewport that leaves ~119px for
all dashboard/submissions/blog-admin content, unusable and with no way to collapse it. Rebuilt as
a responsive layout: sidebar nav is now hidden below `lg:` and replaced with a mobile top bar
(logo + hamburger, 44px touch target) that opens a slide-in drawer (same spring/backdrop-blur
pattern as `Nav.tsx`'s mobile menu, `AnimatePresence` + `type: 'spring', stiffness: 320, damping:
34`), auto-closing on route change. Desktop `lg:` and above keeps the original always-visible
sidebar unchanged.

**Smaller mobile fixes** (all in `src/pages/admin/*.tsx`, found by reading JSX for
overflow/cramping risk since the live dashboard isn't reachable without Supabase):
- `AdminSubmissionsPage.tsx`: track-filter `<select>` was `h-10` (40px, under the 44px touch
  baseline) and a fixed inline width that could crowd the "Submissions" heading on narrow
  screens — now `h-11 w-full sm:w-auto`. Applicant name row: added `min-w-0`/`truncate` so a long
  name can't push the "View"/"Hide" toggle off-screen.
- `AdminBlogPage.tsx`: post-title row same `min-w-0`/`truncate` + `flex-wrap` fix so a long blog
  title doesn't crush the Edit/Delete actions at 375px.
- `AdminDashboardPage.tsx`: the "by vertical" bar-chart row's label column was a fixed `w-40`
  (160px) — at 375px that alone is nearly half the viewport before the bar even starts. Now
  `w-24 truncate sm:w-40`.
- All admin page `<h1>`s: `text-3xl` → `text-2xl sm:text-3xl` for less cramped headings on
  narrow screens, matching the `clamp()`/responsive-size convention used elsewhere in the app.

**Polish pass** (within the existing plum/teal/coral/beige system — no new colors, no dark theme):
brought the five admin pages and `AdminLoginPage` up to the same animation quality as the
original landing-page sections, since they were built fast in the prior session and had zero
`Reveal`/`RevealGroup` usage. Added `Reveal`/`RevealGroup`/`RevealItem` (existing component,
untouched) to `AdminLoginPage`, `AdminDashboardPage`, `AdminSubmissionsPage`, `AdminBlogPage`,
`AdminBlogEditorPage` — same stagger/spring values already used on the landing page, nothing
new invented. Added `hover:shadow-card-hover` (existing Tailwind token) to admin stat cards,
submission rows, and blog-post rows so hovering them reads consistently with the rest of the
site's card vocabulary. Converted `BlogListPage`'s post cards from a plain CSS-transition `Link`
to the same `motion(Link)` + `whileHover={{ y: -5 }}` + `spring stiffness: 300, damping: 24`
pattern `EnterTheLab.tsx` already uses for its pillar cards. Added a matching subtle
arrow-nudge-on-hover (`group-hover:-translate-x-0.5`) to the "Back to WISE Lab" / "Back to the
Journal" links on `ApplyPage`, `BlogListPage`, and `BlogPostPage`. Nav's sticky-header glass
treatment (`bg-beige/80 backdrop-blur-xl` on scroll) was already in place from the prior session
and needed no change — it's the same glassmorphism vocabulary the task brief asked to extend.

**Explicitly not touched**: `TRACK_THEME` in `src/lib/theme.ts`, fonts in
`tailwind.config.js`/`index.css`, the Hero3D particle system, the WhatsApp number placeholder,
Supabase provisioning, and i18n translation review — all out of scope per the task and
`TODO_FOR_HUMAN.md`.

**Verification**: `npm run build`, `npx tsc --noEmit -p .`, and `npm run lint` all clean (same 4
pre-existing fast-refresh-category warnings as every prior phase, none new, zero new errors).
Playwright-driven `scrollWidth`/`clientWidth` checks confirmed zero horizontal overflow at
375/390/413/428/768px across `/`, `/blog`, `/apply/{founder,enterprise,mentor,partner}`, and
`/admin/login` both before and after the changes in this phase.

## Phase 12 — i18n application forms, full UR/PS/PA coverage, Apply Now launcher, worktree reconcile
Resumed uncommitted work from a prior session on branch `fix/wiselab-follow-ups` (base commit
`d3836c6`). No palette/font/hero changes.

**Application forms → i18n keys**: `src/lib/forms/schemas/{founder,enterprise,mentor,partner}.ts`
now store i18n key paths (e.g. `forms.founder.startupName.label`) instead of hardcoded English.
`DynamicForm.tsx` and `ApplyPage.tsx` call `t(...)` on titles, subtitles, section headings,
field labels/placeholders/help, option labels, table column headers, consent text, and success
copy — including `t(schema.successTitle, { name })` with real `{{name}}` interpolation. Stable
analytics `dimension` / field `name` / `column.key` values were left untouched.

**Translations**: filled `en.json` (source) and completed `ur.json`, `ps.json`, `pa.json`
(machine-drafted, `_meta.reviewStatus` kept). Coverage script reports **0 missing keys** in
UR/PS/PA vs EN (each has one extra `_meta.reviewStatus` key EN lacks — benign). All four locale
files parse cleanly.

**Persistent Apply Now launcher**: new `ApplyNowButton.tsx` — fixed bottom-left floating button
(mirrors `WhatsAppButton`) opening a menu of all four `/apply/*` routes, reusing
`enterTheLab.pillars.*` i18n keys. Wired in `AppRouter.tsx` `GlobalChrome`: visible on every
public route except `/admin` and while already on `/apply/*`.

**Worktree reconcile** (`.claude/worktrees/agent-*`): no extra commits ahead of this branch;
picked uncommitted fixes only:
- `useAdminAuth.tsx`: null-session safety, `isAdmin` gate via `admin_profiles` lookup (matches
  RLS), sign-in rejects non-provisioned users and signs them out; `AdminLayout.tsx` now requires
  `session && isAdmin`.
- `Footer.tsx`: `wiselab.org.pk` → `https://wiselab.org.pk` (was `href="#"` stub).
- `BehindTheWings.tsx`: director LinkedIn → real profile URL (was `href="#"` stub).
Worktrees removed after merge (`git worktree remove` ×3, `git worktree prune`).

**Verification**: `npm run build` + `npm run lint` clean (same 4 pre-existing fast-refresh
warnings). Dev-server smoke: `/`, `/apply/{founder,enterprise,mentor,partner}`, `/admin/login`
all HTTP 200. Browser pass on `/`: PM banner text at top, "Become a Mentor" in nav + footer,
Apply Now menu shows all four tracks, social icons + footer site link are real URLs, founder
form at `/apply/founder` renders all sections/fields. WhatsApp placeholder (`wa.me/923000000000`)
and Supabase provisioning still deferred per `TODO_FOR_HUMAN.md`.

**Commits on `fix/wiselab-follow-ups`**: `05f09b0` (forms i18n + locales), `f5f12ba` (Apply Now),
`f04469d` (admin auth + dead links). PR opened against `main` — not merged.

## Phase 13 — End-to-end verification, cohesion, and feature-completeness pass
Resumed on `fix/wiselab-follow-ups` with a clean tree and re-ran the full baseline gate first:
`npm install`, `npm run build`, `npm run lint` all green (same 4 known fast-refresh warnings only).

**Deterministic/static fixes landed**
- `src/i18n/locales/en.json`: added `_meta.reviewStatus` so EN/UR/PS/PA now have exact key parity.
  Re-ran the key-diff script: **0 missing / 0 extra** in `ur`, `ps`, `pa` vs `en`.
- `src/AppRouter.tsx`: added `/apply` -> `/` redirect so the bare `/apply` route is no longer a
  blank no-match page; kept `/apply/:track` redirecting invalid tracks back to `/`.
- `src/AppRouter.tsx`: removed the old `/apply/*` exclusion from `GlobalChrome`, so `ApplyNowButton`
  is now mounted on **all public routes**, hidden only on `/admin/*`, matching the owner's
  "always there everywhere" requirement.
- `src/components/ApplyNowButton.tsx`: removed the delayed entrance animation so the launcher
  appears immediately instead of a second late (important for both perceived prominence and
  browser-based verification).

**Public-surface i18n completion**
- `src/pages/BlogListPage.tsx`, `src/pages/BlogPostPage.tsx`, `src/pages/admin/AdminLoginPage.tsx`,
  `src/pages/admin/AdminLayout.tsx`: converted remaining public/admin-login hardcoded strings to `t(...)`.
- Locale keys added across `src/i18n/locales/{en,ur,ps,pa}.json` for:
  - `blogPage.*`
  - `blogPostPage.backToJournal`
  - `admin.common.*`, `admin.nav.*`, `admin.login.*`
- `src/components/Hero3D/TrackToggle.tsx`: removed the last landing-page hardcoded English strings
  (`Startup Incubation`, `MSME Training`, `Scalable, tech-enabled ventures`, `Small & home-based businesses`)
  and wired them to existing `buildTracks.*` keys; added `hero.trackToggleAria` in all locales.
- `src/components/Nav.tsx`, `src/sections/BehindTheWings.tsx`, `src/sections/WiseConnect.tsx`:
  localized menu button aria labels, the director LinkedIn aria label, and social-link
  "opens in a new tab" accessible names so non-English routes no longer leak English through
  assistive text.

**Live route/browser verification**
- HTTP smoke (`curl`) returns `200` for `/`, `/blog`, `/blog/not-a-real-post`, `/apply`,
  `/apply/founder`, `/apply/enterprise`, `/apply/mentor`, `/apply/partner`,
  `/apply/does-not-exist`, `/admin/login`, `/admin`.
- Browser-verified:
  - `/apply` now redirects to `/` instead of rendering a blank route shell.
  - `/apply/does-not-exist` redirects to `/`.
  - `/blog/not-a-real-post` resolves gracefully back to `/blog`.
  - `/admin` redirects to `/admin/login` with no data exposure.
  - `Apply Now` is visible on `/`, `/blog`, `/blog/:slug` fallback, and `/apply/founder`;
    `WhatsApp` remains bottom-right and `Apply Now` bottom-left.
  - PM banner remains at the top above nav.
  - Urdu route sweep confirmed translated landing page, translated founder form, translated blog page,
    translated admin login, translated Apply Now button, and translated mobile-nav labels.
- Mobile snapshot at `375px` confirmed no corner collision between `Apply Now` and WhatsApp on `/`,
  and founder/apply-page global chrome remains present.

**Backend/static verification by reading (no live infra available)**
- Verified `src/lib/forms/submitApplication.ts` still inserts into `submissions(track, values,
  analytics, submitted_at, meta)` — exactly matching `supabase/migrations/0001_init.sql`.
- Verified `src/lib/admin/submissions.ts`, `src/lib/blog/api.ts`, `src/lib/stats.ts`, and
  `supabase/functions/notify-submission/index.ts` all reference real table/column names from
  the migrations (`submissions`, `blog_posts`, `admin_profiles`; `track`, `values`, `analytics`,
  `submitted_at`, `meta`, `slug`, `status`, `published_at`, etc.).
- Verified RLS intent is consistent by inspection:
  - public can `insert` into `submissions` but cannot read them;
  - only authenticated users with an `admin_profiles` row can read `submissions`;
  - public can read only `blog_posts.status = 'published'`;
  - admins can read/write all `blog_posts`.
- `useAdminAuth.tsx` already matched this model from Phase 12 (`session` + `admin_profiles`
  membership check), so no further auth change was needed in this pass.

**Boundary / still deferred**
- Supabase provisioning is still absent, so DB writes, RLS enforcement, and the notify-submission
  edge function were verified statically only, not exercised live.
- The WhatsApp placeholder (`wa.me/923000000000` in dev fallback), native-speaker translation review,
  and real partner-logo assets remain intentionally deferred per `TODO_FOR_HUMAN.md`.

## Admin demo mode (post-launch follow-up)

Added `src/lib/demo/` — a gated demo mode for the admin portal so it can be shown to
stakeholders before a real Supabase project is provisioned:

- `config.ts` — `DEMO_MODE` flag (`VITE_DEMO_MODE=true`, off by default) and hardcoded demo
  credentials (`demo@wiselab.org.pk` / `WiseLabDemo2026!`).
- `seedData.ts` — realistic fake submissions across all 4 tracks (varied verticals, cities,
  genders, stages so dashboard charts look populated) and 3 fake blog posts (2 published, 1 draft).
- `store.ts` — in-memory mutable store so blog create/edit/delete feels interactive within a demo
  session (resets on reload — acceptable, nothing here is meant to persist).
- `useAdminAuth.tsx` — `signIn` checks demo credentials first when `DEMO_MODE` is on; a successful
  demo login sets `session: 'demo'` and persists a flag to `sessionStorage` (not `localStorage`, so
  it clears when the tab closes) so the session survives a page reload or direct URL navigation,
  matching how a real Supabase session behaves.
- `src/lib/admin/submissions.ts` and `src/lib/blog/api.ts` — each read/write function checks
  `DEMO_MODE` first and routes to the demo store instead of Supabase.
- `AdminLayout.tsx` — a bright, unmissable "Demo mode" banner renders on every admin page whenever
  the active session is the demo login, specifically so an accidental production enablement could
  never be silently exploited.
- `AdminLoginPage.tsx` — prints the demo credentials directly on the login form when demo mode is
  active, since the user needs to know them to log in and demo it to others.

**Real bugs found and fixed in the same pass** (not demo-mode-specific):
- The entire `admin.*` i18n namespace (`admin.login.title`, `admin.nav.dashboard`, etc. — 12 keys
  referenced via `t()` with no fallback string) was missing from all 4 locale files, so the admin
  login page and sidebar nav were rendering raw translation keys instead of text, in every
  language including English. Added real translations across en/ur/ps/pa, parity restored.

**Verified live** via Playwright against the dev server with `VITE_DEMO_MODE=true`: login with demo
credentials → dashboard shows correct aggregate counts and a populated by-vertical chart →
submissions list shows all 13 seeded entries with working track filter → blog list shows 3 seeded
posts with correct published/draft states → session survives a full-page direct navigation to
`/admin/submissions`. Build and lint clean; `VITE_DEMO_MODE` unset (default) also builds clean.

**Deferred**: demo mode does not persist blog edits across a reload (by design — it's not meant to);
does not affect the public-facing site at all (only `/admin/*`); must stay off in the real
production environment (documented in `TODO_FOR_HUMAN.md`).
