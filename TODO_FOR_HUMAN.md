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
   WhatsApp button reads from `VITE_WHATSAPP_NUMBER` (see `.env.example`), defaulting to a clearly
   fake placeholder (`+92 300 0000000`) if unset, and the button is not rendered at all when the
   env var is empty in production builds... (see Phase 8 log for exact behavior). **Set the real
   WISE Lab WhatsApp number before launch.**
7. **PM banner asset**: `public/pm-banner.jpg` was extracted from `SHAHABZBANNER.jpeg`, downscaled
   from 11801x3485 to 2400px wide and recompressed to JPEG q85 for web performance. Please confirm
   image rights/usage clearance for the Prime Minister's photo are in place — this is government/PM
   media and typically requires clearance to publish (WISE Lab team should confirm, not assumed here).
8. **Logo extraction**: `public/wise-lab-logo.png` and `public/wise-lab-mark.png` were rasterized
   from `WISE Lab Logo Reveal.pdf` (vector Illustrator source, no embedded raster) at 300dpi and
   PNG-exported with white keyed to transparent. This is a *rasterization*, not the original vector.
   If print-quality or the original .ai/.eps source is needed, get it from whoever produced the PDF.
9. **i18n translations (UR/PS/PA)**: Urdu, Pashto, and Punjabi strings in `src/i18n/locales/` are
   **machine-drafted**, not reviewed by native speakers. Every non-English string is flagged with a
   `// TODO: native review` comment or equivalent marker in the locale JSON (see Phase 9 log for the
   exact mechanism used). Do not ship to production without a native-speaker review pass, especially
   for RTL (Urdu/Pashto) layout and any legal/commitment-statement copy in the Founder Flightpath form.
10. **Live stats + countdown**: shipped behind a feature flag (`VITE_FEATURE_LIVE_STATS`, default
    off) because there is no real data source. When ready, wire it to real numbers and flip the flag.
11. **Partner logo fetching**: implemented as a config-driven list (`src/lib/partners.ts`) rather than
    a live fetch from an external source, since no partner logo API/CMS was specified. Populate real
    partner logo URLs there.

## Secrets handling note
This is a **public repo**. No real secrets, API keys, or the real WhatsApp number were committed
anywhere, including in `.env.example` (placeholders only). Do not commit `.env` (already gitignored).
