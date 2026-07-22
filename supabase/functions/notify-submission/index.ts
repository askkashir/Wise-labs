// Supabase Edge Function: notify-submission
//
// Triggered (via supabase/migrations/0002_submission_notify_trigger.sql) on
// every new row in `submissions`. Sends an email notification to the WISE
// Lab team so a new application doesn't sit unseen until someone checks the
// admin dashboard.
//
// NOT DEPLOYED — no live Supabase project exists in this environment (see
// TODO_FOR_HUMAN.md). Deploy with:
//   supabase functions deploy notify-submission
// and set secrets with:
//   supabase secrets set RESEND_API_KEY=... NOTIFY_EMAIL_TO=...
//
// Uses Resend (https://resend.com) since it's the email provider referenced
// by this project's available tooling conventions; swap the fetch call
// below if a different provider is preferred.

// deno-lint-ignore-file no-explicit-any
// @ts-nocheck -- Deno runtime globals (Deno.serve, Deno.env) aren't typed
// under this repo's Node/Vite tsconfig; this file only runs in the Supabase
// Edge Functions Deno runtime, never bundled by Vite.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_EMAIL_TO = Deno.env.get('NOTIFY_EMAIL_TO')

const TRACK_LABELS: Record<string, string> = {
  founder: 'Founder Flightpath',
  enterprise: 'Enterprise Flightpath',
  mentor: 'Guide Her Growth',
  partner: 'Open the Ecosystem',
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!RESEND_API_KEY || !NOTIFY_EMAIL_TO) {
    console.error('notify-submission: missing RESEND_API_KEY or NOTIFY_EMAIL_TO secret')
    return new Response('Not configured', { status: 500 })
  }

  const { id, track, submitted_at } = await req.json()
  const trackLabel = TRACK_LABELS[track] ?? track

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WISE Lab <notifications@wiselab.org.pk>',
      to: [NOTIFY_EMAIL_TO],
      subject: `New ${trackLabel} application`,
      text: `A new ${trackLabel} application was submitted at ${submitted_at}.\n\nView it in the admin dashboard: https://wiselab.org.pk/admin/submissions\n\nSubmission ID: ${id}`,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('notify-submission: Resend API error', res.status, body)
    return new Response('Failed to send notification', { status: 502 })
  }

  return new Response('ok', { status: 200 })
})
