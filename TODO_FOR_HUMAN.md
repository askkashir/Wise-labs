# TODO for a human — WISE Lab Platform v1

This file lists everything that could not be completed autonomously (infra provisioning,
credentials, ambiguous inputs that were defaulted instead of blocking) plus items worth a
native-speaker/design/legal review pass before this ships to production.

## Must do before this is live

1. **Provision Supabase project.** No live project exists and the Supabase MCP server is
   unauthenticated in this environment. SQL migrations are committed under `supabase/migrations/`
   but were never applied to a real database. Steps:
   - Create a Supabase project.
   - Run the migrations in `supabase/migrations/` in order (via `supabase db push` or the SQL editor).
   - Copy the project URL + anon/publishable key into `.env` (see `.env.example`).
   - Set the same env vars in Vercel project settings (Production + Preview).
2. **Set Vercel environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   plus any edge-function secrets (see `.env.example` and `supabase/functions/`).
3. **Deploy the notification edge function** (`supabase/functions/notify-submission/`) — written
   but not deployed (no live project to deploy to). Needs an email provider API key (Resend
   suggested — see `email-best-practices` conventions) set as a Supabase function secret.
4. **Create the first admin user** in `admin_profiles` once the project exists — there is no
   seed/bootstrap script by design (don't want a hardcoded default admin in a public repo).

## Defaulted-and-flagged (never blocked, but needs a real decision)

5. **Teal retheme hex**: used `#2E7D7B` per the explicit instruction in the master prompt. Confirm
   this matches brand guidelines before shipping (Phase 2, `src/lib/theme.ts` `TRACK_THEME.founder`).
6. **WhatsApp number**: no real number was provided anywhere in the assets or brief. The floating
   WhatsApp button (`src/components/WhatsAppButton.tsx`) reads `VITE_WHATSAPP_NUMBER` (see
   `.env.example`). In production builds, if that var is unset the button renders **nothing at
   all** (chosen over showing a fake number that would look real to a site visitor); in `npm run
   dev` only, it falls back to an obviously-fake placeholder so the button is visibly testable
   during development. **Set the real WISE Lab WhatsApp number in production before launch,
   otherwise the floating button simply won't appear.**
7. **PM banner asset**: `public/pm-banner.jpg` was extracted from `SHAHABZBANNER.jpeg`, downscaled
   from 11801x3485 to 2400px wide and recompressed to JPEG q85 for web performance. Please confirm
   image rights/usage clearance for the Prime Minister's photo are in place — this is government/PM
   media and typically requires clearance to publish (WISE Lab team should confirm, not assumed here).
8. **Logo extraction**: `public/wise-lab-logo.png` and `public/wise-lab-mark.png` were rasterized
   from `WISE Lab Logo Reveal.pdf` (vector Illustrator source, no embedded raster) at 300dpi and
   PNG-exported with white keyed to transparent. This is a *rasterization*, not the original vector.
   If print-quality or the original .ai/.eps source is needed, get it from whoever produced the PDF.
9. **i18n translations (UR/PS/PA)** — two separate things to know:
   - **Coverage is now site-wide.** Hero, WiseJourney, BuildTracks, EnterTheLab, PowerCircle,
     BehindTheWings, WiseConnect, and all four application form schemas (Founder/Enterprise/
     Mentor/Partner — including every field label, placeholder, help text, and option) are wired
     to `react-i18next`. Form schema strings are translated via a derived-key layer
     (`src/lib/forms/i18nKeys.ts`) rather than editing the schema files directly, so
     `src/lib/forms/schemas/*.ts` remain the single English source of truth. Hero's word-by-word
     headline animation now splits the *translated* string on spaces at render time instead of a
     hardcoded English word array, so it keeps working regardless of language. Verified: all four
     locales render with zero horizontal overflow, `<html dir>` flips to `rtl` for UR/PS/PA, and
     the founder/enterprise/mentor/partner track sync still works with a language active.
   - **Translation quality**: every string that IS translated into Urdu, Pashto, and Punjabi is
     **machine-drafted**, not reviewed by native speakers. Each locale file
     (`src/i18n/locales/{ur,ps,pa}.json`) carries a top-level `"_meta": {"reviewStatus": "machine-
     drafted, NOT reviewed..."}` key as a machine-readable flag. Do not ship to production without
     a native-speaker review pass — especially for the commitment-statement consent checkbox
     copy, which has legal/ethical weight.
10. **Live stats + countdown**: shipped behind a feature flag (`VITE_FEATURE_LIVE_STATS`, default
    off) because there is no real data source. When ready, wire it to real numbers and flip the flag.
11. **Partner logo fetching**: implemented as a config-driven list (`src/lib/partners.ts`) rather than
    a live fetch from an external source, since no partner logo API/CMS was specified. Populate real
    partner logo URLs there.

12. **Admin demo mode** (`src/lib/demo/`): a hardcoded admin login + realistic fake submissions/blog
    posts, gated behind `VITE_DEMO_MODE=true`, so the admin portal can be demoed to stakeholders
    before a real Supabase project exists. Demo credentials: `demo@wiselab.org.pk` /
    `WiseLabDemo2026!` (see `src/lib/demo/config.ts`). A bright "Demo mode" banner appears on every
    admin page whenever this is on, and the login page prints the credentials directly, so it's
    unmissable and self-serve. **Set `VITE_DEMO_MODE=false` (or leave it unset) in the real
    production Vercel environment** — this flag is a genuine auth bypass by design, meant only for
    a local run or a throwaway preview deployment used for a demo, never for the live site once
    real submissions start coming in.

## Secrets handling note
This is a **public repo**. No real secrets, API keys, or the real WhatsApp number were committed
anywhere, including in `.env.example` (placeholders only). Do not commit `.env` (already gitignored).
The demo admin credentials above ARE committed in plain sight (`src/lib/demo/config.ts`) — that is
intentional (it's a demo login, not a real secret) but is exactly why demo mode must stay off in
production: those credentials are public.
