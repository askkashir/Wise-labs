/**
 * Demo mode — lets someone click through the admin portal (login,
 * dashboard, submissions, blog) with realistic fake data before a real
 * Supabase project is provisioned, so the platform can be demoed to
 * stakeholders without waiting on infra.
 *
 * OFF by default. Only active when VITE_DEMO_MODE=true is set in the
 * build environment. Do NOT set this in the real production Vercel
 * environment — it enables a hardcoded login that bypasses real auth
 * entirely. Every admin page shows a visible "Demo mode" banner
 * whenever this is on, specifically so an accidental production
 * enablement would be impossible to miss rather than a silent backdoor.
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export const DEMO_CREDENTIALS = {
  email: 'demo@wiselab.org.pk',
  password: 'WiseLabDemo2026!',
}
